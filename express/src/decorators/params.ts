import { getMeta } from '../meta';
import { ParameterType } from '../interface';

/**
 * Add metadata
 * @param {ExpressClass} target Target Class
 * @param {string|symbol} propertyKey Function name, parameters owner
 * @param {ParameterConfiguration} config Parameter configuration
 */
function addMeta(target: ExpressClass, propertyKey: string | symbol, config: ParameterConfiguration) {
  let meta = getMeta(target);
  if (!meta.params[propertyKey]) {
    meta.params[propertyKey] = [];
  }
  meta.params[propertyKey].push(config);
}

/**
 * Parameter decorator factory, creates parameter decorator
 * @param {ParameterType} parameterType Parameter Type
 * @returns { () => ParameterDecorator }
 */
function decoratorFactory(parameterType: ParameterType): (name?: string) => ParameterDecorator {
  return function(name?: string): ParameterDecorator {
    return function (target: ExpressClass, propertyKey: string | symbol, index: number) {
      addMeta(target, propertyKey, {index, type: parameterType, name});
    };
  };
}

/**
 * Express req object
 */
export const Request = decoratorFactory(ParameterType.REQUEST);

/**
 * Express res object
 */
export const Response = decoratorFactory(ParameterType.RESPONSE);

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
