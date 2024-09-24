import { BaseChatMessageHistory } from '@langchain/core/chat_history';
import { getMessagesByConversationId, addMessageToConversation } from '../../../api';
import type { BaseMessage } from '@langchain/core/messages';

export class SqlMessageHistory extends BaseChatMessageHistory {
  constructor(private conversationId: string) {
    super();
  }
  getMessages(): Promise<BaseMessage[]> {
    console.log(`Fetching messages for conversationId: ${this.conversationId}`);
    return getMessagesByConversationId(this.conversationId);
  }

  addMessage(message: any): Promise<void> {
    console.log(`Adding message to conversationId: ${message}`);
    return addMessageToConversation(this.conversationId, message.role, message.content);
  }

  addUserMessage(message: string): Promise<void> {
    return addMessageToConversation(this.conversationId, "human", message);
  }

  addAIChatMessage(message: string): Promise<void> {
    return addMessageToConversation(this.conversationId, "ai", message);
  }

  clear(): Promise<void> {
    return new Promise((resolve, _) => {
      resolve();
    });
  }

  lc_namespace: string[] = [];
}

