/**
 * Initializes and configures the Express application.
 *
 * - Connects to the MongoDB database using the `connectDB` function.
 * - Sets up middleware to parse JSON request bodies.
 * - Defines a root route that responds with a welcome message.
 * - Mounts the `/api/ast/rules` route for handling AST rule-related requests.
 * - Starts the server on the specified port (default is 5000).
 *
 * @file This file is the entry point for the AST Builder API server.
 * @module app
 *
 * @requires express
 * @requires ./utils/initialisers/mongoose
 * @requires express.Request
 * @requires express.Response
 * @requires ./routes/rules
 */
import express from "express";
import connectDB from "./utils/initialisers/mongoose";
import { Request, Response } from "express";
import router from "./routes/rules";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());

connectDB();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("AST Builder API");
});

app.use("/api/ast/rules", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
