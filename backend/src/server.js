import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB} from "./lib/db.js";
import {ENV} from "./lib/env.js";
import { app, server } from "./lib/socket.js";




connectDB();

const __dirname = path.resolve();


const PORT = ENV.PORT || 3000;


app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://chatapp-vert-pi.vercel.app"],
  credentials: true
}));

app.use(express.json({limit: "5mb"}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


// make ready for deployment
if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}
server.listen(PORT, () => {
    console.log("Server is running on port: "+ PORT);
});
