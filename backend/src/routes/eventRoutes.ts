import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../controllers/eventController";
import { authenticateToken } from "../middlewares/authenticateToken"; // Middleware for authentication

const router = Router();

// Route to create an event (POST /events)
router.post("/events", authenticateToken, createEvent);

// // Route to get all events
router.get("/all-events", getAllEvents);

// // Route to get all events for authenticated user (GET /events)
// router.get("/events", authenticateToken, getEvents);

// Route to update an event (PUT /events/:id)
router.put("/events/:id", authenticateToken, updateEvent);

// // Route to delete an event (DELETE /events/:id)
router.delete("/events/:id", authenticateToken, deleteEvent);

export default router;
