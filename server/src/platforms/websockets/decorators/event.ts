import { methodDecoratorFactory } from '../../../helpers';
import { WebSocketEventType } from '../types';

export function Event(url = '') {
  return methodDecoratorFactory({ type: WebSocketEventType.GENERIC, url });
}
