import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

type RequestContext = {
  requestId: string;
};

const storage = new AsyncLocalStorage<RequestContext>();

// Reject untrusted client headers — IDs longer than this are almost certainly garbage.
const MAX_INBOUND_ID_LENGTH = 128;
const SAFE_ID_PATTERN = /^[A-Za-z0-9_.:-]+$/;

function resolveRequestId(headerValue: unknown): string {
  if (typeof headerValue === 'string') {
    const trimmed = headerValue.trim();
    if (
      trimmed.length > 0 &&
      trimmed.length <= MAX_INBOUND_ID_LENGTH &&
      SAFE_ID_PATTERN.test(trimmed)
    ) {
      return trimmed;
    }
  }
  return randomUUID();
}

export function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

const requestContext: RequestHandler = (req, res, next) => {
  const requestId = resolveRequestId(req.headers['x-request-id']);
  res.setHeader('X-Request-Id', requestId);
  storage.run({ requestId }, () => next());
};

export default requestContext;
