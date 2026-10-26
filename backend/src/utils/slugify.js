export function slugify(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

/** Returns a slug for `title` that is unique in `Model`, ignoring `excludeId`. */
export async function uniqueSlug(Model, title, excludeId) {
  const base = slugify(title);
  let slug = base;
  for (let n = 2; ; n += 1) {
    const clash = await Model.exists({ slug, ...(excludeId && { _id: { $ne: excludeId } }) });
    if (!clash) return slug;
    slug = `${base}-${n}`;
  }
}
