import { Router } from 'express';
import { changePassword, login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import { changePasswordSchema, loginSchema } from '../validators/index.js';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.post('/password', requireAuth, validate(changePasswordSchema), changePassword);

export default router;
