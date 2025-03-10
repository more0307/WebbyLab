import { Router } from 'express';
import { AuthHttpHandler } from '../handlers/http/auth.http.handler';
import { CallHttpMiddleware } from '../handlers/http/middlewares/call.http.middleware';
import { loginSchema, registerSchema } from '../validations/auth.validation';

const router = Router();

router.post('/register', CallHttpMiddleware(AuthHttpHandler, 'register', registerSchema));
router.post('/login', CallHttpMiddleware(AuthHttpHandler, 'login', loginSchema));

export default router;
