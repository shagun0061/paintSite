import { Router } from 'express';
import { createUser, deleteUser, listUsers } from '../controllers/authController.js';
import { getStats, uploadImages } from '../controllers/dashboardController.js';
import { deleteEnquiry, getEnquiry, listEnquiries, updateEnquiry } from '../controllers/enquiryController.js';
import {
  adminGetProject,
  adminListProjects,
  createProject,
  deleteProject,
  setProjectFlags,
  updateProject,
} from '../controllers/projectController.js';
import { adminListReviews, deleteReview, moderateReview } from '../controllers/reviewController.js';
import { adminListServices, createService, deleteService, updateService } from '../controllers/serviceController.js';
import { updateSettings } from '../controllers/settingsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { imageUpload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  adminProjectListQuery,
  adminReviewListQuery,
  createAdminSchema,
  enquiryListQuery,
  enquiryUpdateSchema,
  objectIdParam,
  projectPublishSchema,
  projectSchema,
  reviewModerateSchema,
  serviceSchema,
  settingsSchema,
} from '../validators/index.js';

const router = Router();
const id = validate(objectIdParam, 'params');
const adminOnly = requireRole('admin');

// Every route below requires a signed-in admin user.
router.use(requireAuth);

router.get('/stats', getStats);
router.post('/uploads', imageUpload, uploadImages);

router.get('/enquiries', validate(enquiryListQuery, 'query'), listEnquiries);
router.get('/enquiries/:id', id, getEnquiry);
router.patch('/enquiries/:id', id, validate(enquiryUpdateSchema), updateEnquiry);
router.delete('/enquiries/:id', adminOnly, id, deleteEnquiry);

router.get('/projects', validate(adminProjectListQuery, 'query'), adminListProjects);
router.post('/projects', validate(projectSchema), createProject);
router.get('/projects/:id', id, adminGetProject);
router.put('/projects/:id', id, validate(projectSchema), updateProject);
router.patch('/projects/:id', id, validate(projectPublishSchema), setProjectFlags);
router.delete('/projects/:id', id, deleteProject);

router.get('/reviews', validate(adminReviewListQuery, 'query'), adminListReviews);
router.patch('/reviews/:id', id, validate(reviewModerateSchema), moderateReview);
router.delete('/reviews/:id', id, deleteReview);

router.get('/services', adminListServices);
router.post('/services', validate(serviceSchema), createService);
router.put('/services/:id', id, validate(serviceSchema), updateService);
router.delete('/services/:id', adminOnly, id, deleteService);

router.put('/settings', adminOnly, validate(settingsSchema), updateSettings);

router.get('/users', adminOnly, listUsers);
router.post('/users', adminOnly, validate(createAdminSchema), createUser);
router.delete('/users/:id', adminOnly, id, deleteUser);

export default router;
