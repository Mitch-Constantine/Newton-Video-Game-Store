/**
 * Extracts a user-friendly message from an HTTP error (e.g. from HttpClient subscribe error).
 * Handles API responses: ProblemDetails (detail), validation errors (errors array), plain string body.
 */
export function getErrorMessage(err: unknown, fallback = 'Request failed'): string {
  if (err == null) return fallback;
  const body = (err as { error?: unknown }).error;
  if (body != null && typeof body === 'object' && 'detail' in body && typeof (body as { detail?: string }).detail === 'string') {
    return (body as { detail: string }).detail;
  }
  if (body != null && typeof body === 'object' && 'errors' in body && Array.isArray((body as { errors?: string[] }).errors)) {
    const messages = (body as { errors: string[] }).errors;
    return messages.length > 0 ? messages.join(' ') : fallback;
  }
  if (typeof body === 'string') return body;
  const msg = (err as { message?: string }).message;
  return (typeof msg === 'string' && msg.length > 0) ? msg : fallback;
}
