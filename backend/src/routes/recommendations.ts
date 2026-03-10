import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { getRecommendations } from '../controllers/recommendationController';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getRecommendations));

export default router;
