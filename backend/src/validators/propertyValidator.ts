import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    price: z.number().positive(),
    city: z.string(),
    location: z.string(),
    address: z.string(),
    property_type: z.enum(['Apartment', 'Independent House', 'Villa', 'Residential Land', 'Commercial Property']),
    listing_type: z.enum(['Sale', 'Rent']),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    area_sqft: z.number().positive(),
    furnishing_status: z.enum(['Furnished', 'Semi-Furnished', 'Unfurnished']),
  }),
});