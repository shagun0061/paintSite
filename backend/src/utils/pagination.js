export function toSkip({ page, limit }) {
  return (page - 1) * limit;
}

export function pageMeta({ page, limit }, total) {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

/** Runs a paginated find + count in parallel and returns `{ items, pagination }`. */
export async function paginate(Model, filter, { page, limit, sort, select }) {
  const [items, total] = await Promise.all([
    Model.find(filter).sort(sort).skip(toSkip({ page, limit })).limit(limit).select(select).lean(),
    Model.countDocuments(filter),
  ]);
  return { items, pagination: pageMeta({ page, limit }, total) };
}
