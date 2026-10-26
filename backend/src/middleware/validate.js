import { AppError } from '../utils/AppError.js';

/** Turns zod issues into `{ fieldPath: message }` for the client. */
export function formatIssues(issues) {
  const details = {};
  for (const issue of issues) {
    const key = issue.path.join('.') || '_';
    if (!details[key]) details[key] = issue.message;
  }
  return details;
}

/**
 * Validates `req[source]` against a zod schema. Parsed (coerced, trimmed,
 * stripped of unknown keys) data replaces `req.body`/`req.params`; parsed
 * query data is put on `req.validQuery` because Express 5's req.query is read-only.
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source] ?? {});
  if (!result.success) {
    return next(new AppError(400, 'Please check the highlighted fields.', formatIssues(result.error.issues)));
  }
  if (source === 'query') req.validQuery = result.data;
  else req[source] = result.data;
  return next();
};
