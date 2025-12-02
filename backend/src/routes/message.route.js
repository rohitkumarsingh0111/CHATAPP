import express from "express";
import { getAllContacts, getMessagesByUserId, getChatPartners, sendMessage } from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// this middleware executes in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unautheticated requests get blocked by rate limiting before hitting the auth middleware.
router.use( arcjetProtection, protectRoute);

router.get("/contacts",  getAllContacts);
router.get("/chats",  getChatPartners); // MUST COME BEFORE :id
router.get("/:id",  getMessagesByUserId);

router.post("/send/:id",  sendMessage);



export default router;