import { Project } from '../models/Project.js';
import { deleteImages, deleteRemovedImages } from '../services/imageService.js';
import { notFound } from '../utils/AppError.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import { paginate } from '../utils/pagination.js';
import { uniqueSlug } from '../utils/slugify.js';

const LIST_FIELDS = 'title slug category summary location completedAt coverImage featured beforeImage afterImage';
const NEWEST = { completedAt: -1, createdAt: -1 };

export async function listProjects(req, res) {
  const { page, limit, category, featured } = req.validQuery;
  const filter = { published: true, ...(category && { category }), ...(featured !== undefined && { featured }) };
  const result = await paginate(Project, filter, { page, limit, sort: NEWEST, select: LIST_FIELDS });
  res.json(result);
}

export async function getProject(req, res) {
  const project = await Project.findOne({ slug: req.params.slug, published: true }).lean();
  if (!project) throw notFound('Project');
  const related = await Project.find({ published: true, category: project.category, _id: { $ne: project._id } })
    .sort(NEWEST)
    .limit(3)
    .select(LIST_FIELDS)
    .lean();
  res.json({ project, related });
}

/* ---- Admin ---- */

export async function adminListProjects(req, res) {
  const { page, limit, category, q } = req.validQuery;
  const filter = {
    ...(category && { category }),
    ...(q && { title: { $regex: escapeRegex(q), $options: 'i' } }),
  };
  const result = await paginate(Project, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
    select: `${LIST_FIELDS} published updatedAt`,
  });
  res.json(result);
}

export async function adminGetProject(req, res) {
  const project = await Project.findById(req.params.id).lean();
  if (!project) throw notFound('Project');
  res.json({ project });
}

export async function createProject(req, res) {
  const slug = await uniqueSlug(Project, req.body.title);
  const project = await Project.create({ ...req.body, slug });
  res.status(201).json({ project });
}

export async function updateProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) throw notFound('Project');
  const oldImages = project.allImages().map((img) => img.toObject());

  if (req.body.title !== project.title) project.slug = await uniqueSlug(Project, req.body.title, project._id);
  project.set(req.body);
  await project.save();

  await deleteRemovedImages(oldImages, project.allImages());
  res.json({ project });
}

export async function setProjectFlags(req, res) {
  const project = await Project.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true })
    .select(`${LIST_FIELDS} published updatedAt`)
    .lean();
  if (!project) throw notFound('Project');
  res.json({ project });
}

export async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw notFound('Project');
  await deleteImages(project.allImages());
  res.status(204).end();
}
