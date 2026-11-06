import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { pool } from '../config/db';
import { AppError } from '../utils/AppError';

// Helper to convert empty strings to null for database safety
const toNull = (val: any) => (val === '' || val === undefined || val === null) ? null : val;
export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, price, city, location, address, property_type, listing_type, bedrooms, bathrooms, area_sqft, furnishing_status, main_image } = req.body;
  
  // 1. Force numbers safely
  const priceNum = price ? Number(price) : 0;
  const areaNum = area_sqft ? Number(area_sqft) : 0;
  const bedsNum = bedrooms ? Number(bedrooms) : 0;
  const bathsNum = bathrooms ? Number(bathrooms) : 0;

  // 2. Force string matching
  const safePropertyType = property_type || 'Apartment';
  const safeListingType = listing_type || 'Sale';

  console.log("ATTEMPTING TO INSERT:", { title, priceNum, safePropertyType, safeListingType });

  try {
    const result = await pool.query(
      `INSERT INTO properties (owner_id, title, description, price, city, location, address, property_type, listing_type, bedrooms, bathrooms, area_sqft, furnishing_status, main_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        req.user!.id, 
        title, 
        description, 
        priceNum, 
        city, 
        location, 
        address, 
        safePropertyType, 
        safeListingType, 
        bedsNum, 
        bathsNum, 
        areaNum, 
        furnishing_status || 'Unfurnished', 
        main_image || null
      ]
    );
    res.status(201).json({ success: true, property: result.rows[0] });
  } catch (dbError: any) {
    console.error("DATABASE ERROR:", dbError.message);
    throw new AppError(dbError.message, 500);
  }
});
export const getProperties = asyncHandler(async (req: Request, res: Response) => {
  // Check if the frontend is asking for "My Properties"
  const { city, minPrice, maxPrice, bedrooms, property_type, listing_type, page = 1, limit = 10, my_properties } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = `SELECT p.* FROM properties p WHERE p.status = 'Available'`;
  const values: any[] = [];
  let count = 1;

  // 🔥 NEW LOGIC: If they want their own properties, filter by owner_id
  if (my_properties === 'true') {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'You must be logged in to view your properties.' });
      return;
    }
    query += ` AND p.owner_id = $${count++}`;
    values.push(req.user.id);
  } else {
    // If public browsing, only show available
    if (city) { query += ` AND p.city ILIKE $${count++}`; values.push(`%${city}%`); }
    if (minPrice) { query += ` AND p.price >= $${count++}`; values.push(minPrice); }
    if (maxPrice) { query += ` AND p.price <= $${count++}`; values.push(maxPrice); }
    if (bedrooms) { query += ` AND p.bedrooms = $${count++}`; values.push(bedrooms); }
    if (property_type) { query += ` AND p.property_type = $${count++}`; values.push(property_type); }
    if (listing_type) { query += ` AND p.listing_type = $${count++}`; values.push(listing_type); }
  }

  query += ` ORDER BY p.created_at DESC LIMIT $${count++} OFFSET $${count++}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  res.json({ success: true, count: result.rowCount, data: result.rows });
});
export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT p.*, json_agg(pi.image_url) as images FROM properties p 
     LEFT JOIN property_images pi ON p.id = pi.property_id WHERE p.id = $1 GROUP BY p.id`, 
    [req.params.id]
  );
  if (result.rows.length === 0) throw new AppError('Property not found', 404);
  res.json({ success: true, data: result.rows[0] });
});

export const getSimilarProperties = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const current = await pool.query('SELECT city, property_type, bedrooms, price FROM properties WHERE id = $1', [id]);
  if (current.rows.length === 0) throw new AppError('Property not found', 404);
  
  const p = current.rows[0];
  const result = await pool.query(
    `SELECT *, (
       (CASE WHEN city = $1 THEN 30 ELSE 0 END) +
       (CASE WHEN property_type = $2 THEN 25 ELSE 0 END) +
       (CASE WHEN bedrooms = $3 THEN 20 ELSE 0 END) +
       (CASE WHEN price BETWEEN $4 * 0.8 AND $4 * 1.2 THEN 15 ELSE 0 END)
     ) AS similarity_score
     FROM properties 
     WHERE id != $5 AND status = 'Available'
     ORDER BY similarity_score DESC LIMIT 5`,
    [p.city, p.property_type, p.bedrooms, p.price, id]
  );
  res.json({ success: true, data: result.rows });
});

export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await pool.query('SELECT owner_id FROM properties WHERE id = $1', [id]);
  
  if (existing.rows.length === 0) throw new AppError('Property not found', 404);
  if (existing.rows[0].owner_id !== req.user!.id && req.user!.role !== 'admin') {
    throw new AppError('You do not have permission to edit this property', 403);
  }

  const { title, description, price, city, location, address, property_type, listing_type, bedrooms, bathrooms, area_sqft, furnishing_status, status, main_image } = req.body;

  const result = await pool.query(
    `UPDATE properties SET 
      title = $1, description = $2, price = $3, city = $4, location = $5, address = $6, 
      property_type = $7, listing_type = $8, bedrooms = $9, bathrooms = $10, area_sqft = $11, 
      furnishing_status = $12, status = $13, main_image = $14, updated_at = CURRENT_TIMESTAMP
     WHERE id = $15 RETURNING *`,
    [title, description, toNull(price), city, location, address, property_type, listing_type, toNull(bedrooms), toNull(bathrooms), toNull(area_sqft), toNull(furnishing_status), status, toNull(main_image), id]
  );
  res.json({ success: true, data: result.rows[0] });
});

export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await pool.query('SELECT owner_id FROM properties WHERE id = $1', [id]);
  
  if (existing.rows.length === 0) throw new AppError('Property not found', 404);
  if (existing.rows[0].owner_id !== req.user!.id && req.user!.role !== 'admin') {
    throw new AppError('You do not have permission to delete this property', 403);
  }

  await pool.query('DELETE FROM properties WHERE id = $1', [id]);
  res.json({ success: true, message: 'Property deleted successfully' });
});