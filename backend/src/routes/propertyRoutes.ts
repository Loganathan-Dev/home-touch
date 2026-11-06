import { Router } from 'express';
import { createProperty, getProperties, getPropertyById, getSimilarProperties, updateProperty, deleteProperty } from '../controllers/propertyController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management and search
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties (Search, Filter, Pagination)
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *         description: Number of bedrooms
 *       - in: query
 *         name: property_type
 *         schema:
 *           type: string
 *           enum: [Apartment, Independent House, Villa, Residential Land, Commercial Property]
 *         description: Type of property
 *       - in: query
 *         name: listing_type
 *         schema:
 *           type: string
 *           enum: [Sale, Rent]
 *         description: Sale or Rent
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of properties fetched successfully
 */
// Read token if it exists, but don't block if it doesn't
router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, getProperties);
/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a single property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property UUID
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get('/:id', getPropertyById);

/**
 * @swagger
 * /api/properties/{id}/similar:
 *   get:
 *     summary: Get similar property recommendations
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Current Property UUID to base recommendations on
 *     responses:
 *       200:
 *         description: List of 5 similar properties ranked by weighted score
 */
router.get('/:id/similar', getSimilarProperties);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property listing (Owner/Admin only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - city
 *               - location
 *               - address
 *               - property_type
 *               - listing_type
 *               - area_sqft
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               city:
 *                 type: string
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               property_type:
 *                 type: string
 *               listing_type:
 *                 type: string
 *               bedrooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               area_sqft:
 *                 type: number
 *               furnishing_status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Property created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Buyers cannot create properties)
 */
router.post('/', protect, restrictTo('owner', 'admin'), createProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update an existing property (Owner/Admin only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Available, Sold, Rented]
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       403:
 *         description: Not authorized to edit this property
 *       404:
 *         description: Property not found
 */
router.put('/:id', protect, restrictTo('owner', 'admin'), updateProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete a property (Owner/Admin only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       403:
 *         description: Not authorized to delete this property
 *       404:
 *         description: Property not found
 */
router.delete('/:id', protect, restrictTo('owner', 'admin'), deleteProperty);

export default router;