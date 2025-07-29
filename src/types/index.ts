export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionRequest {
  title: string;
  messages: Message[];
  code: string;
}

export interface UpdateSessionRequest {
  title?: string;
  messages?: Message[];
  code?: string;
}

export interface SessionResponse {
  message: string;
  session: Session;
}

export interface SessionsResponse {
  sessions: Session[];
} 