import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import commentsRoutes from "./routes/comments.js";

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet()); // secures express app with various HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); // HTTP request logger middleware for nodejs

// ROUTES
app.get("/", (req, res) => res.json({ success: "Hello World!" }));
app.use("/comments", commentsRoutes);

// HANDLING UNDEFINED ROUTES
app.get("/error", (req, res) => {
  res.status(404).send("Oops! Page not found :(");
});
app.all("*", (req, res) => {
  res.redirect("/error"); // Alternatively, res.status(404).json({ message: "Route not found"})
});

// MONGOOSE SETUP
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`ERROR: ${err}`);
  });
