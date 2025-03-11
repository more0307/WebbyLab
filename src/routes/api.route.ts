import { Router } from 'express';

import authRouter from './auth.route';
import movieRouter from './movie.route';
import actorRouter from './actor.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/actors', actorRouter);

export default router;
