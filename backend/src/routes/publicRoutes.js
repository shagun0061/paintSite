import { Router } from 'express';
import { createEnquiry } from '../controllers/enquiryController.js';
import { getProject, listProjects } from '../controllers/projectController.js';
import { googleReviews, listReviews, submitReview } from '../controllers/reviewController.js';
import { getService, listServices } from '../controllers/serviceController.js';
import { getSettings } from '../controllers/settingsController.js';
import { enquiryLimiter, reviewLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import {
  enquiryCreateSchema,
  projectListQuery,
  reviewCreateSchema,
  reviewListQuery,
  slugParam,
} from '../validators/index.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.get('/settings', getSettings);

router.get('/services', listServices);
router.get('/services/:slug', validate(slugParam, 'params'), getService);

router.get('/projects', validate(projectListQuery, 'query'), listProjects);
router.get('/projects/:slug', validate(slugParam, 'params'), getProject);

router.get('/reviews', validate(reviewListQuery, 'query'), listReviews);
router.get('/reviews/google', googleReviews);
router.post('/reviews', reviewLimiter, validate(reviewCreateSchema), submitReview);

router.post('/enquiries', enquiryLimiter, validate(enquiryCreateSchema), createEnquiry);

export default router;
