import { Injectable } from '@server';

import { Message } from './message';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private messages = [];

  addMessage(message: Message) {
    this.messages.push(message);
  }

  getMessages() {
    return this.messages;
  }
}
