import rateLimit from 'express-rate-limit';

// Prevent spam: Max 5 inquiries per 15 minutes per IP
export const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { success: false, message: 'Too many inquiries sent. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});