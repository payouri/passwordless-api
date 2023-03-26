import { FastifyInstance, FastifyRequest } from "fastify";

type RequestContext = Record<string, unknown>;

const RequestContextSymbol = Symbol("RequestContext");

export function initRequestContext(fastifyInstance: FastifyInstance) {
  fastifyInstance.decorateRequest(RequestContextSymbol, {});
}

export function setRequestContext<T extends FastifyRequest>({
  request,
  context,
  merge = true,
}: {
  request: T;
  context: RequestContext;
  merge?: boolean;
}) {
  Reflect.set(
    request as FastifyRequest,
    RequestContextSymbol,
    merge
      ? {
          ...getRequestContext(request),
          ...context,
        }
      : context
  );
}

export function getRequestContext<T extends FastifyRequest>(
  request: T
): RequestContext {
  return Reflect.get(request as FastifyRequest, RequestContextSymbol);
}
