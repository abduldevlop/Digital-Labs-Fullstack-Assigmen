import express, { Request, Response } from "express";
import { config as configDotenv } from "dotenv";
import admin from "firebase-admin";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";

// Load environment variables from .env file
configDotenv();

// Initialize Express app and Prisma client
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("Sarayu Digital Labs - Fullstack Assignment");
});

// Parse the JSON string from the environment variable
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

// routes
app.use("/api", authRoutes);
app.use("/api", eventRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
