import client from './client';

// Types for Chat
interface Chat {
  _id: string;
  segmentId: string;
  userId: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Types for Message
interface Message {
  _id: string;
  chatId: string;
  content: string;
  sender: 'user' | 'system';
  createdAt?: Date;
  updatedAt?: Date;
}

// Response types
interface ChatResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const initialiseChat = async (segmentId: string): Promise<ChatResponse<object>> => {
  const res = await client.post(`/chat/init/${segmentId}`);
  return res.data;
};

export const newChat = async (segmentId: string, userId: string, title: string): Promise<ChatResponse<Chat>> => {
  const res = await client.post(`/chat/`, { userId, title, segmentId });
  return res.data;
};

export const getChatBySegmentId = async (segmentId: string): Promise<ChatResponse<Chat[]>> => {
  const res = await client.get(`/chat/segment/${segmentId}`);
  return res.data;
};

export const getChatMessages = async (chatId: string): Promise<ChatResponse<Message[]>> => {
  const res = await client.get(`/chat/${chatId}/messages`);
  return res.data;
};

export const sendMessage = async (
  segmentId: string,
  chatId: string,
  content: string
): Promise<ChatResponse<{ message: string; response: string }>> => {
  // Updated to use 'content' instead of 'message' to match server expectation
  const res = await client.post(`/chat/${segmentId}/${chatId}/message`, { content });
  return res.data;
};
