interface SubmitErrorOptions {
  /** False when the same request would fail again (out of copies, duplicate…). */
  retryable: boolean;
}

/**
 * Rejection whose `message` is safe and useful to show to the user.
 *
 * This is the contract that lets a form render a server-provided explanation:
 * ONLY the message of a `SubmitError` may ever reach the UI. Any other rejection
 * (network, non-JSON response, a bug) must fall back to the form's own generic
 * copy, because its text can carry stack traces, internals or wording nobody
 * reviewed. Throw this only for validated, user-facing API messages.
 */
export default class SubmitError extends Error {
  readonly retryable: boolean;

  constructor(message: string, { retryable }: SubmitErrorOptions) {
    super(message);
    this.name = 'SubmitError';
    this.retryable = retryable;
  }
}
