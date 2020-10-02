export class DomainError extends Error {
  location?: string;

  debug?: unknown;

  constructor(readonly reason: string, readonly got?: unknown) {
    super(got ? `${reason}. Got: ${got}` : reason);
  }

  setLocation(location: string): this {
    this.location = location;
    this.message += `(in ${location})`;
    return this;
  }

  setDebug(object: unknown): this {
    this.debug = object;
    return this;
  }
}
