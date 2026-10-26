import { Router } from 'express';
import { requireCsrfHeader } from '../middleware/auth.js';
import { notFoundHandler } from '../middleware/errorHandler.js';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

router.use(requireCsrfHeader);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/', publicRoutes);
router.use(notFoundHandler);

export default router;
