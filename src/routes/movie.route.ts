import { Router } from 'express';
import { CallHttpMiddleware } from '../handlers/http/middlewares/call.http.middleware';
import { MovieHttpHandler } from '../handlers/http/movie.http.handler';
import { movieCreateSchema, movieUpdateSchema } from '../validations/movie.validation';
import { processFileMiddleware } from '../handlers/http/middlewares/files.http.middleware';
import { AuthenticateHttpMiddleware } from '../handlers/http/middlewares/auth.http.middleware';

const router = Router();

router.get('/download/:fileName', CallHttpMiddleware(MovieHttpHandler, 'download'));

router.use(AuthenticateHttpMiddleware);

router.post('/', CallHttpMiddleware(MovieHttpHandler, 'create', movieCreateSchema));
router.get('/', CallHttpMiddleware(MovieHttpHandler, 'list'));
router.delete('/:id', CallHttpMiddleware(MovieHttpHandler, 'delete'));
router.get('/:id', CallHttpMiddleware(MovieHttpHandler, 'show'));
router.patch('/:id', CallHttpMiddleware(MovieHttpHandler, 'update', movieUpdateSchema));
router.post('/import', processFileMiddleware, CallHttpMiddleware(MovieHttpHandler, 'import'));

export default router;
