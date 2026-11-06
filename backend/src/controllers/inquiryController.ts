import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { pool } from '../config/db';
import { AppError } from '../utils/AppError';

export const createInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { property_id, message } = req.body;
  const buyer_id = req.user!.id;

  // 1. Check if property exists and get owner
  const prop = await pool.query('SELECT owner_id FROM properties WHERE id = $1', [property_id]);
  if (prop.rows.length === 0) throw new AppError('Property not found', 404);
  
  const owner_id = prop.rows[0].owner_id;

  // 2. Prevent self-inquiry
  if (owner_id === buyer_id) {
    throw new AppError('You cannot inquire about your own property', 400);
  }

  // 3. Prevent duplicate inquiries (same buyer, same property within 24 hours)
  const duplicateCheck = await pool.query(
    `SELECT id FROM inquiries 
     WHERE property_id = $1 AND buyer_id = $2 AND created_at > NOW() - INTERVAL '24 hours'`,
    [property_id, buyer_id]
  );
  
  if (duplicateCheck.rows.length > 0) {
    throw new AppError('You have already sent an inquiry for this property recently.', 429);
  }

  // 4. Insert Inquiry
  const result = await pool.query(
    'INSERT INTO inquiries (property_id, buyer_id, owner_id, message) VALUES ($1, $2, $3, $4) RETURNING *',
    [property_id, buyer_id, owner_id, message]
  );
  
  res.status(201).json({ success: true, data: result.rows[0] });
});

export const getReceivedInquiries = asyncHandler(async (req: Request, res: Response) => {
  // Fetch inquiries where the logged-in user is the OWNER
  const result = await pool.query(
    `SELECT i.id, i.message, i.status, i.created_at, 
            u.name as buyer_name, u.phone as buyer_phone, u.email as buyer_email,
            p.title as property_title, p.id as property_id
     FROM inquiries i 
     JOIN users u ON i.buyer_id = u.id 
     JOIN properties p ON i.property_id = p.id
     WHERE i.owner_id = $1 
     ORDER BY i.created_at DESC`,
    [req.user!.id]
  );
  res.json({ success: true, data: result.rows });
});

export const getMyInquiries = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT i.id, i.message, i.status, i.created_at, 
            p.id as property_id, p.title as property_title, p.city as property_city, p.location as property_location, p.main_image
     FROM inquiries i 
     JOIN properties p ON i.property_id = p.id
     WHERE i.buyer_id = $1 
     ORDER BY i.created_at DESC`,
    [req.user!.id]
  );
  res.json({ success: true, data: result.rows });
});
export const updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'Pending', 'Contacted', 'Closed'

  // Verify the user is the owner of this inquiry
  const inquiry = await pool.query('SELECT owner_id FROM inquiries WHERE id = $1', [id]);
  if (inquiry.rows.length === 0) throw new AppError('Inquiry not found', 404);
  if (inquiry.rows[0].owner_id !== req.user!.id) {
    throw new AppError('Not authorized to update this inquiry', 403);
  }

  await pool.query('UPDATE inquiries SET status = $1 WHERE id = $2', [status, id]);
  res.json({ success: true, message: 'Status updated' });
});