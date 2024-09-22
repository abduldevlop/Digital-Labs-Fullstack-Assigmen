"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getAllEvents = exports.createEvent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create an event
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, dateTime } = req.body;
    try {
        const event = yield prisma.event.create({
            data: {
                title,
                description,
                dateTime: new Date(dateTime),
                userId: req.userId, // now using `uid`
            },
        });
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ error: "Error creating event" });
    }
});
exports.createEvent = createEvent;
// // View all events
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany(); // Fetch all events
        res.json(events);
    }
    catch (error) {
        console.error("Error fetching events:", error); // Log the error for debugging
        res.status(500).json({ error: "Error fetching events" });
    }
});
exports.getAllEvents = getAllEvents;
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
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, dateTime } = req.body;
    try {
        const event = yield prisma.event.updateMany({
            where: { id: Number(id), userId: req.userId }, // now using `uid`
            data: { title, description, dateTime: new Date(dateTime) },
        });
        if (event.count === 0)
            return res.status(404).json({ error: "Event not found" });
        res.json({ message: "Event updated" });
    }
    catch (error) {
        console.error("Error updating event:", error); // Log the error for debugging
        res.status(500).json({ error: "Error updating event", details: error });
    }
});
exports.updateEvent = updateEvent;
// Delete an event
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const eventExists = yield prisma.event.findUnique({
            where: { id: Number(id), userId: req.userId },
        });
        if (!eventExists) {
            res
                .status(404)
                .json({ error: "Event not found or does not belong to user" });
            return;
        }
        // Delete the event
        yield prisma.event.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Event deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting event", details: error });
    }
});
exports.deleteEvent = deleteEvent;
