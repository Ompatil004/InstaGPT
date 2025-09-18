import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Vite's default port
  credentials: true
}));

app.use("/api", chatRoutes);

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
    }
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on ${PORT}`);
    });
});
