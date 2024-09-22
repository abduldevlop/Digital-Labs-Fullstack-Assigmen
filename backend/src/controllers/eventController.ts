import { Response } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthRequest } from "../middlewares/authenticateToken";
const prisma = new PrismaClient();

// Create an event
export const createEvent = async (req: AuthRequest, res: Response) => {
  const { title, description, dateTime } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        dateTime: new Date(dateTime),
        userId: req.userId!, // now using `uid`
      },
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Error creating event" });
  }
};

// // View all events
export const getAllEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany(); // Fetch all events
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error); // Log the error for debugging
    res.status(500).json({ error: "Error fetching events" });
  }
};

// // View all events for the authenticated user
// export const getEvents = async (req: AuthRequest, res: Response) => {
//   try {
//     const events = await prisma.event.findMany({
//       where: { userId: req.userId! }, // now using `uid`
//     });
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching events" });
//   }
// };

// Update an event
export const updateEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, dateTime } = req.body;

  try {
    const event = await prisma.event.updateMany({
      where: { id: Number(id), userId: req.userId! }, // now using `uid`
      data: { title, description, dateTime: new Date(dateTime) },
    });

    if (event.count === 0)
      return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event updated" });
  } catch (error) {
    console.error("Error updating event:", error); // Log the error for debugging
    res.status(500).json({ error: "Error updating event", details: error });
  }
};

// Delete an event
export const deleteEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const eventExists = await prisma.event.findUnique({
      where: { id: Number(id), userId: req.userId },
    });

    if (!eventExists) {
      res
        .status(404)
        .json({ error: "Event not found or does not belong to user" });
      return;
    }

    // Delete the event
    await prisma.event.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting event", details: error });
  }
};
