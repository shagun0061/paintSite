import { Settings } from '../models/Settings.js';

export async function getSettings(_req, res) {
  const settings = await Settings.getSingleton();
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ settings });
}

export async function updateSettings(req, res) {
  await Settings.getSingleton();
  const settings = await Settings.findOneAndUpdate({ key: 'business' }, { $set: req.body }, { new: true, runValidators: true });
  res.json({ settings });
}
