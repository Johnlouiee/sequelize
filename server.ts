import "rootpath";
import express, { Application } from "express";
import cors from "cors";
import errorHandler from "./_middleware/error-handler";
import userRoutes from "./users/user.controller";
import dotenv from "dotenv";


const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/users", userRoutes);

// Global Error Handler
app.use(errorHandler);

// Set Port
const port = process.env.PORT || 4000; 

app.listen(port, () => console.log(`Server listening on port ${port}`));

