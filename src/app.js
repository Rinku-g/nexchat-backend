import express from "express";
import cors from "cors";
import authRoute from "./routes/index.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test routes
app.use("/api", authRoute);

export default app;
