const requestIdMap = new WeakMap<Request, string>();

let counter = 0;

export function getRequestId(req: Request): string {
  let id = requestIdMap.get(req);
  if (!id) {
    counter += 1;
    id = `req_${Date.now()}_${counter}`;
    requestIdMap.set(req, id);
  }
  return id;
}

export function log(
  req: Request,
  event: string,
  meta?: Record<string, unknown>,
): void {
  const id = getRequestId(req);
  const entry = {
    timestamp: new Date().toISOString(),
    requestId: id,
    event,
    ...meta,
  };
  console.log(JSON.stringify(entry));
}

export function logError(
  req: Request,
  event: string,
  error: unknown,
  meta?: Record<string, unknown>,
): void {
  const id = getRequestId(req);
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const entry = {
    timestamp: new Date().toISOString(),
    requestId: id,
    event,
    error: message,
    stack,
    ...meta,
  };
  console.error(JSON.stringify(entry));
}
