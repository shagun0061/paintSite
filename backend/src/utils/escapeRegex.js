/** Escapes user input for safe use inside a MongoDB $regex. */
export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
