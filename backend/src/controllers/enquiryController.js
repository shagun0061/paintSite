import { ENQUIRY_STATUSES } from '../config/constants.js';
import { Enquiry } from '../models/Enquiry.js';
import { notFound } from '../utils/AppError.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import { paginate } from '../utils/pagination.js';

export async function createEnquiry(req, res) {
  const { website, ...data } = req.body;
  // Honeypot filled → pretend success without storing.
  if (!website) await Enquiry.create(data);
  res.status(201).json({
    message:
      data.type === 'quote'
        ? 'Thank you! Your quote request has been received. We will contact you shortly to arrange a visit.'
        : 'Thank you! Your message has been received. We will get back to you shortly.',
  });
}

/* ---- Admin ---- */

export async function listEnquiries(req, res) {
  const { page, limit, status, type, q } = req.validQuery;
  const rx = q && { $regex: escapeRegex(q), $options: 'i' };
  const filter = {
    ...(status && { status }),
    ...(type && { type }),
    ...(rx && { $or: [{ name: rx }, { phone: rx }, { email: rx }, { location: rx }] }),
  };
  const [result, counts] = await Promise.all([
    paginate(Enquiry, filter, { page, limit, sort: { createdAt: -1 } }),
    Enquiry.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
  ]);
  const byStatus = Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s, 0]));
  for (const c of counts) byStatus[c._id] = c.n;
  res.json({ ...result, counts: byStatus });
}

export async function getEnquiry(req, res) {
  const enquiry = await Enquiry.findById(req.params.id).lean();
  if (!enquiry) throw notFound('Enquiry');
  res.json({ enquiry });
}

export async function updateEnquiry(req, res) {
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean();
  if (!enquiry) throw notFound('Enquiry');
  res.json({ enquiry });
}

export async function deleteEnquiry(req, res) {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw notFound('Enquiry');
  res.status(204).end();
}
