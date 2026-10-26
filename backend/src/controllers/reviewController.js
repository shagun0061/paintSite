import { Review } from '../models/Review.js';
import { getGoogleReviews } from '../services/googleReviews.js';
import { notFound } from '../utils/AppError.js';
import { paginate } from '../utils/pagination.js';

const PUBLIC_FIELDS = 'name location rating text createdAt';

/** Approved website reviews plus a summary computed from those same reviews. */
export async function listReviews(req, res) {
  const { page, limit } = req.validQuery;
  const [result, [summary]] = await Promise.all([
    paginate(Review, { status: 'approved' }, { page, limit, sort: { createdAt: -1 }, select: PUBLIC_FIELDS }),
    Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, count: { $sum: 1 }, average: { $avg: '$rating' } } },
    ]),
  ]);
  res.json({
    ...result,
    summary: {
      count: summary?.count ?? 0,
      average: summary ? Math.round(summary.average * 10) / 10 : null,
    },
  });
}

export async function submitReview(req, res) {
  const { website, ...data } = req.body;
  // Honeypot filled → silently accept without storing (don't tip off bots).
  if (!website) await Review.create({ ...data, status: 'pending' });
  res.status(201).json({ message: 'Thank you! Your review has been received and will appear once it has been approved.' });
}

export async function googleReviews(_req, res) {
  const data = await getGoogleReviews();
  res.set('Cache-Control', 'public, max-age=300');
  res.json(data);
}

/* ---- Admin ---- */

export async function adminListReviews(req, res) {
  const { page, limit, status } = req.validQuery;
  const filter = status ? { status } : {};
  const [result, counts] = await Promise.all([
    paginate(Review, filter, { page, limit, sort: { createdAt: -1 } }),
    Review.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
  ]);
  res.json({ ...result, counts: Object.fromEntries(counts.map((c) => [c._id, c.n])) });
}

export async function moderateReview(req, res) {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, moderatedAt: new Date(), moderatedBy: req.user._id },
    { new: true, runValidators: true },
  ).lean();
  if (!review) throw notFound('Review');
  res.json({ review });
}

export async function deleteReview(req, res) {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw notFound('Review');
  res.status(204).end();
}
