import { Router } from 'express';
import usersRouter from './users';
import swipesRouter from './swipes';
import favoritesRouter from './favorites';
import recommendationsRouter from './recommendations';

const router = Router();

router.use('/users', usersRouter);
router.use('/swipes', swipesRouter);
router.use('/favorites', favoritesRouter);
router.use('/recommendations', recommendationsRouter);

export default router;
