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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const prismaClinent_1 = require("../prismaClinent");
// Adjust path if necessary
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        // Verify the Firebase ID token
        const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(token);
        const { uid, email, name } = decodedToken;
        if (!email) {
            throw new Error("Email is required");
        }
        // Check if user exists in the database
        let user = yield prismaClinent_1.prisma.user.findUnique({ where: { uid } });
        if (!user) {
            // Create a new user if not found
            user = yield prismaClinent_1.prisma.user.create({
                data: { uid, email, name },
            });
        }
        // Respond with the user data
        res.json({ message: "Login successful", user });
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized", error });
    }
});
exports.login = login;
