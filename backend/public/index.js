"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
// Load environment variables from .env file
(0, dotenv_1.config)();
// Initialize Express app and Prisma client
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    credentials: true,
}));
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Default route
app.get("/", (req, res) => {
    res.send("Sarayu Digital Labs - Fullstack Assignment");
});
// Parse the JSON string from the environment variable
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
// Initialize Firebase Admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebaseConfig),
});
// routes
app.use("/api", authRoutes_1.default);
app.use("/api", eventRoutes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
