import { Router } from 'express';
import { CallHttpMiddleware } from '../handlers/http/middlewares/call.http.middleware';
import { AuthenticateHttpMiddleware } from '../handlers/http/middlewares/auth.http.middleware';
import { ActorHttpHandler } from '../handlers/http/actor.http.handler';

const router = Router();

// router.use(AuthenticateHttpMiddleware);

router.get('/', CallHttpMiddleware(ActorHttpHandler, 'list'));

export default router;
