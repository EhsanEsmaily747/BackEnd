import Comment from "../models/comment.js";
import User from "../models/user.js"
import { catchAsync } from "../middlewares.js";


export const getAll = catchAsync(async (req, res) => {

  let filter = {}
  if (req.query.id) filter.postId = req.query.id 
  
  let comments = await Comment.find(filter).populate('author');

  res.status(200).json({ message: "", comments: comments });
});





export const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);
    console.log(comment);

    if (comment) {
      comment.deleteOne()
      return res.status(200).json({ message: "Comment Deleted", comment: comment })
    }
    res.status(404).json({ message: "Comment doesn't exist" })
  } catch (err) {
    res.status(500).json({ message: "Invalid Operation" })
  }
});





export const createComment = catchAsync(async (req, res) => {
  const { newCmt } = req.body;

  const user = await User.find({ author: newCmt.author });

  if (user) {
    const newComment = await Comment.create({
      content: newCmt.content,
      author: newCmt.author,
      postId: newCmt.postId
    });
    return res.status(200).json({ message: "Comment Added", comment: newComment })
  }
  return res.status(200).json({ message: "Invalid inputs" })
});