import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoritesController';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getFavorites));
router.post('/', asyncHandler(addFavorite));
router.delete('/:foodId', asyncHandler(removeFavorite));

export default router;
