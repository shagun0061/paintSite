const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details || {};
  }
}

let onUnauthorized = null;
/** Registers a callback for 401 responses from admin endpoints (session expired). */
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
  return () => {
    if (onUnauthorized === fn) onUnauthorized = null;
  };
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const isForm = body instanceof FormData;
  const headers = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${API_ORIGIN}/api${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('We could not reach the server. Please check your connection and try again.', 0);
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && path.startsWith('/admin') && onUnauthorized) onUnauthorized();
    throw new ApiError(data?.error?.message || `Request failed (${res.status})`, res.status, data?.error?.details);
  }
  return data;
}

const qs = (params = {}) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  return entries.length ? `?${new URLSearchParams(entries)}` : '';
};

export const api = {
  get: (path, params, opts) => request(`${path}${qs(params)}`, opts),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};

/** Resolves an image URL; uploaded files live on the API origin. */
export const assetUrl = (url) => (url?.startsWith('/uploads/') ? `${API_ORIGIN}${url}` : url);
