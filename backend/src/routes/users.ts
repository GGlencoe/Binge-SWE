import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  getMe,
  updateMe,
  getPreferences,
  upsertPreferences,
} from '../controllers/userController';

const router = Router();

router.use(requireAuth);

router.get('/me', asyncHandler(getMe));
router.put('/me', asyncHandler(updateMe));
router.get('/me/preferences', asyncHandler(getPreferences));
router.put('/me/preferences', asyncHandler(upsertPreferences));

export default router;
