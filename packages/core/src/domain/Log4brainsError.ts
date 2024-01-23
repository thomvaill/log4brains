/**
 * Log4brains Error base class.
 * Any error thrown by the core API extends this class.
 */
export class Log4brainsError extends Error {
  constructor(
    public readonly name: string,
    public readonly details?: string | unknown
  ) {
    super(`${name}${details ? ` (${details})` : ""}`);
  }
}
