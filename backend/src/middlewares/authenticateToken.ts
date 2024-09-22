import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token

  if (!token) return res.sendStatus(401);

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid; // userId now refers to `uid`
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.sendStatus(403);
  }
};
