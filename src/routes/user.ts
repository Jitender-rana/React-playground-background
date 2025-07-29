import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateJWT, AuthRequest } from "../middlewares/Auth";
import { CreateSessionRequest, UpdateSessionRequest } from "../types";
import { validateCreateSession, validateUpdateSession } from "../middlewares/validation";

const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.get("/profile", authenticateJWT, async (req: AuthRequest, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

userRouter.post("/session", authenticateJWT, validateCreateSession, async (req: AuthRequest, res) => {
  const { title, messages, code }: CreateSessionRequest = req.body;
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID missing in token" });
  }

  if (!title || !messages || !code) {
    return res.status(400).json({ error: "title, messages, and code are required" });
  }

  try {
    const session = await prisma.session.create({
      data: {
        title,
        messages: messages as any, // Prisma will handle JSON serialization
        code,
        userId,
      },
    });

    res.json({ message: "Session saved", session });
  } catch (err) {
    console.error("Session save failed:", err);
    res.status(500).json({ error: "Could not save session" });
  }
});
userRouter.get("/sessions", authenticateJWT, async (req: AuthRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ sessions });
  } catch (err) {
    console.error("Failed to fetch sessions:", err);
    res.status(500).json({ error: "Could not fetch sessions" });
  }
});

userRouter.get("/session/:id", authenticateJWT, async (req: AuthRequest, res) => {
  const sessionId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const session = await prisma.session.findFirst({
      where: { 
        id: sessionId,
        userId: userId 
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ session });
  } catch (err) {
    console.error("Failed to fetch session:", err);
    res.status(500).json({ error: "Could not fetch session" });
  }
});


userRouter.put("/session/:id", authenticateJWT, validateUpdateSession, async (req: AuthRequest, res) => {
  const sessionId = req.params.id;
  const userId = req.user?.id;
  const { title, messages, code } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Check if session belongs to the user
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      return res.status(403).json({ error: "Not allowed to update this session" });
    }

    // Update the session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        title: title || session.title,
        messages: messages || session.messages,
        code: code || session.code,
      },
    });

    res.json({ message: "Session updated", session: updatedSession });
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ error: "Failed to update session" });
  }
});

userRouter.delete("/session/:id", authenticateJWT, async (req: AuthRequest, res) => {
  const sessionId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Check if session belongs to the user
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      return res.status(403).json({ error: "Not allowed to delete this session" });
    }

    // Delete the session
    await prisma.session.delete({
      where: { id: sessionId },
    });

    res.json({ success: true, message: "Session deleted successfully" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ error: "Failed to delete session" });
  }
});

export { userRouter };
