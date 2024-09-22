"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const authenticateToken_1 = require("../middlewares/authenticateToken"); // Middleware for authentication
const router = (0, express_1.Router)();
// Route to create an event (POST /events)
router.post("/events", authenticateToken_1.authenticateToken, eventController_1.createEvent);
// // Route to get all events
router.get("/all-events", eventController_1.getAllEvents);
// // Route to get all events for authenticated user (GET /events)
// router.get("/events", authenticateToken, getEvents);
// Route to update an event (PUT /events/:id)
router.put("/events/:id", authenticateToken_1.authenticateToken, eventController_1.updateEvent);
// // Route to delete an event (DELETE /events/:id)
router.delete("/events/:id", authenticateToken_1.authenticateToken, eventController_1.deleteEvent);
exports.default = router;
