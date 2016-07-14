import { getMeta } from '../utils';

export function addMethodConfiguration(target: any, methodName: string, config: any) {
  let meta = getMeta(target);
  if (!meta.params[methodName]) {
    meta.params[methodName] = [];
  }
  meta.params[methodName].push(config);
}

export function parameterDecoratorFactory(parameterType: any): () => ParameterDecorator {
  return function(): ParameterDecorator {
    return function (target: any, methodName: string, index: number) {
      addMethodConfiguration(target, methodName, {index, type: parameterType});
    };
  };
}

export let Request = () => (target: any, methodName: string, index: number) => {
  addMethodConfiguration(target, methodName, {index, type: 'request'});
};

export let Response = () => (target: any, methodName: string, index: number) => {
  addMethodConfiguration(target, methodName, {index, type: 'response'});
};

export let Params = () => {

}

export let Param = (name: string) => {

}

export let QueryParams = () => {

}

export let QueryParam = (name: string) => {

}

export let Body = () => {

}

export let BodyParam = (name: string) => {

}

export let Headers = () => {

}

export let HeaderParam = (name: string) => {

}

export let Cookies = () => {

}

export let CookieParam = (name: string) => {

}
