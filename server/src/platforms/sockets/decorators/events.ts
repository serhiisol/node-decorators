import { methodDecoratorFactory } from '../../../core';
import { EventType } from '../helpers';

export function Connection() {
  return methodDecoratorFactory({
    type: EventType.CONNECTION,
  });
}

export function Disconnect() {
  return methodDecoratorFactory({
    type: EventType.DISCONNECT,
  });
}

export function Disconnecting() {
  return methodDecoratorFactory({
    type: EventType.DISCONNECTING,
  });
}

export function Event(event: string) {
  return methodDecoratorFactory({
    event,
    type: EventType.EVENT,
  });
}
