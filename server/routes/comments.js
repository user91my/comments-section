import express from "express";
import {
  createComment,
  getComments,
  deleteComment,
  updateComment,
} from "../controllers/comments.js";

const router = express.Router();

// CREATE
router.post("/", createComment);

// READ
router.get("/", getComments);

// UPDATE
router.patch("/", updateComment);

// DELETE
router.delete("/", deleteComment);

export default router;
