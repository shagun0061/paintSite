import { Enquiry } from '../models/Enquiry.js';
import { Project } from '../models/Project.js';
import { Review } from '../models/Review.js';
import { Service } from '../models/Service.js';
import { processImage } from '../services/imageService.js';
import { AppError } from '../utils/AppError.js';

export async function getStats(_req, res) {
  const [newEnquiries, openEnquiries, pendingReviews, publishedProjects, draftProjects, activeServices, recentEnquiries] =
    await Promise.all([
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ status: { $in: ['Contacted', 'In Progress'] } }),
      Review.countDocuments({ status: 'pending' }),
      Project.countDocuments({ published: true }),
      Project.countDocuments({ published: false }),
      Service.countDocuments({ active: true }),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).select('name type service location status createdAt').lean(),
    ]);
  res.json({ newEnquiries, openEnquiries, pendingReviews, publishedProjects, draftProjects, activeServices, recentEnquiries });
}

export async function uploadImages(req, res) {
  if (!req.files?.length) throw new AppError(400, 'Choose at least one image to upload.');
  const folder = req.query.folder === 'services' ? 'services' : 'projects';
  const images = [];
  for (const file of req.files) images.push(await processImage(file.buffer, folder));
  res.status(201).json({ images });
}
