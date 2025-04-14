import Comment from "../models/Comment.js";

// CREATE
export const createComment = async (req, res) => {
  try {
    const { name, age, email, location, comments } = req.body;
    const newComment = new Comment({
      name,
      age,
      email,
      location,
      comments,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
};

// READ
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({ ERROR: error.message });
  }
};

// UPDATE
export const updateComment = async (req, res) => {
  try {
    const { _id, comments } = req.body;
    await Comment.findOneAndUpdate({ _id }, { $set: { comments } });

    const updatedComment = await Comment.findById(_id);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
};

// DELETE
export const deleteComment = async (req, res) => {
  try {
    const { _id } = req.body;

    const comment = await Comment.findById(_id);

    if (!comment) {
      return res.status(404).json({ ERROR: "Comment ID doesn't exist" });
    }

    await Comment.deleteOne(comment);
    res.status(200).json({ SUCCESS: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).json({ ERROR: error.message });
  }
};
