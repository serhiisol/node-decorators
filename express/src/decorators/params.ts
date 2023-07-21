import { ExpressMeta, ParameterType, getMeta } from '../meta';

/**
 * Parameter decorator factory, creates parameter decorator
 */
function decoratorFactory(type: ParameterType) {
  return function (name?: string): ParameterDecorator {
    return function (target: object, methodName: string, index: number) {
      const meta: ExpressMeta = getMeta(target);

      if (meta.params[methodName] === undefined) {
        meta.params[methodName] = [];
      }

      meta.params[methodName].push({ index, type, name });
    };
  };
}

/**
 * Express req object
 */
export const Request = decoratorFactory(ParameterType.REQUEST);

/**
 * Express req object in short form
 */
export const Req = Request;

/**
 * Express res object
 */
export const Response = decoratorFactory(ParameterType.RESPONSE);

/**
 * Express res object in short form
 */
export const Res = Response;

/**
 * Express next function
 */
export const Next = decoratorFactory(ParameterType.NEXT);

/**
 * Express req.params object or single param, if param name was specified
 */
export const Params = decoratorFactory(ParameterType.PARAMS);

/**
 * Express req.query object or single query param, if query param name was specified
 */
export const Query = decoratorFactory(ParameterType.QUERY);

/**
 * Express req.body object or single body param, if body param name was specified
 */
export const Body = decoratorFactory(ParameterType.BODY);

/**
 * Express req.headers object or single headers param, if headers param name was specified
 */
export const Headers = decoratorFactory(ParameterType.HEADERS);

/**
 * Express req.body object or single cookies param, if cookies param name was specified
 */
export const Cookies = decoratorFactory(ParameterType.COOKIES);
