import { Service } from '../models/Service.js';
import { deleteRemovedImages, deleteImages } from '../services/imageService.js';
import { notFound } from '../utils/AppError.js';
import { uniqueSlug } from '../utils/slugify.js';

export async function listServices(_req, res) {
  const items = await Service.find({ active: true }).sort({ order: 1, title: 1 }).lean();
  res.json({ items });
}

export async function getService(req, res) {
  const service = await Service.findOne({ slug: req.params.slug, active: true }).lean();
  if (!service) throw notFound('Service');
  res.json({ service });
}

/* ---- Admin ---- */

export async function adminListServices(_req, res) {
  const items = await Service.find().sort({ order: 1, title: 1 }).lean();
  res.json({ items });
}

export async function createService(req, res) {
  const slug = await uniqueSlug(Service, req.body.title);
  const service = await Service.create({ ...req.body, slug });
  res.status(201).json({ service });
}

export async function updateService(req, res) {
  const service = await Service.findById(req.params.id);
  if (!service) throw notFound('Service');
  const oldImage = service.image?.toObject();

  if (req.body.title !== service.title) service.slug = await uniqueSlug(Service, req.body.title, service._id);
  service.set(req.body);
  await service.save();
  if (oldImage) await deleteRemovedImages([oldImage], [service.image]);
  res.json({ service });
}

export async function deleteService(req, res) {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw notFound('Service');
  await deleteImages([service.image]);
  res.status(204).end();
}
