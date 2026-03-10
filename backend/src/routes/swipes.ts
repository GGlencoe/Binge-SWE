import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { recordSwipe, getSwipeHistory } from '../controllers/swipeController';

const router = Router();

router.use(requireAuth);

router.post('/', asyncHandler(recordSwipe));
router.get('/', asyncHandler(getSwipeHistory));

export default router;
