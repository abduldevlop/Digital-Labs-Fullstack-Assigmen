import { Request, Response } from "express";
import admin from "firebase-admin";
import { prisma } from "../prismaClinent";
// Adjust path if necessary

export const login = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    if (!email) {
      throw new Error("Email is required");
    }

    // Check if user exists in the database
    let user = await prisma.user.findUnique({ where: { uid } });

    if (!user) {
      // Create a new user if not found
      user = await prisma.user.create({
        data: { uid, email, name },
      });
    }

    // Respond with the user data
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
};
