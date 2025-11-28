import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB} from "./lib/db.js";
import {ENV} from "./lib/env.js"




connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;
app.use(express.json()); // req.body
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// make ready for deployment
if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}
app.listen(PORT, () => {
    console.log("Server is running on port: "+ PORT);
});
