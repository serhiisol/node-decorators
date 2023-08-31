import { methodDecoratorFactory } from '../../../core';
import { EventType, SOURCE_TYPE } from '../helpers';

export function Connection() {
  return methodDecoratorFactory({
    source: SOURCE_TYPE,
    type: EventType.CONNECTION,
  });
}

export function Disconnect() {
  return methodDecoratorFactory({
    source: SOURCE_TYPE,
    type: EventType.DISCONNECT,
  });
}

export function Event(event: string) {
  return methodDecoratorFactory({
    event,
    source: SOURCE_TYPE,
    type: EventType.EVENT,
  });
}
