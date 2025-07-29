import { Request, Response, NextFunction } from 'express';
import { CreateSessionRequest, UpdateSessionRequest } from '../types';

export const validateCreateSession = (req: Request, res: Response, next: NextFunction) => {
  const { title, messages, code }: CreateSessionRequest = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required and must be a non-empty string" });
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages is required and must be an array" });
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: "Code is required and must be a string" });
  }

  // Validate message structure
  for (const message of messages) {
    if (!message.id || !message.role || !message.content || !message.timestamp) {
      return res.status(400).json({ error: "Invalid message structure" });
    }
    
    if (!['user', 'assistant'].includes(message.role)) {
      return res.status(400).json({ error: "Message role must be 'user' or 'assistant'" });
    }
  }

  next();
};

export const validateUpdateSession = (req: Request, res: Response, next: NextFunction) => {
  const { title, messages, code }: UpdateSessionRequest = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  if (messages !== undefined && !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages must be an array" });
  }

  if (code !== undefined && typeof code !== 'string') {
    return res.status(400).json({ error: "Code must be a string" });
  }

  // Validate message structure if messages are provided
  if (messages) {
    for (const message of messages) {
      if (!message.id || !message.role || !message.content || !message.timestamp) {
        return res.status(400).json({ error: "Invalid message structure" });
      }
      
      if (!['user', 'assistant'].includes(message.role)) {
        return res.status(400).json({ error: "Message role must be 'user' or 'assistant'" });
      }
    }
  }

  next();
}; 