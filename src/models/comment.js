import mongoose,{ Schema, model } from 'mongoose';

const commentSchema = new Schema({
  content: {
    type: String,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
},{
    timestamps:true
});

const Comment = model('Comment', commentSchema);

export default Comment;
