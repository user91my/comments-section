import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 150,
    },
    email: {
      type: String,
      required: true,
      match:
        /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    location: {
      type: String,
      // enum: ["location", "location-1", "location-2"],
      required: true,
    },
    comments: {
      type: String,
      required: true,
      maxlength: 1500,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
