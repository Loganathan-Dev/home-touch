import { Router } from 'express';
import { createInquiry, getReceivedInquiries, getMyInquiries, updateInquiryStatus } from '../controllers/inquiryController';
import { protect } from '../middleware/authMiddleware';
import { inquiryLimiter } from '../middleware/rateLimiter';

const router = Router();
router.use(protect);

// Apply rate limiter ONLY to creating inquiries
router.post('/', inquiryLimiter, createInquiry); 
router.get('/my-inquiries', getMyInquiries);
router.get('/received', getReceivedInquiries);
router.get('/my-inquiries', getMyInquiries);
router.get('/received', getReceivedInquiries);
router.patch('/:id/status', updateInquiryStatus);

export default router;