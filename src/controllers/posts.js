import Post from "../models/post.js";
import { catchAsync } from "../middlewares.js";


export const getAll = catchAsync(async (req, res) => {
  let filter = {}
  let sorts = {}
  // console.log(req.query);
  if (req.query) {
    if (req.query.id) filter._id = req.query.id
    if (req.query.category) filter.category = req.query.category
    if (req.query.name) filter.author = req.query.name
    if (req.query.latest) sorts = {createdAt: -1} 
    
    if (req.query.searchTerm) {
      let regex = new RegExp(req.query.searchTerm, "i");
      filter.$or = [{ title: regex }];
    }
    let posts = await Post
      .find(filter)
      .sort(sorts)
      .limit(10)
      .populate("category")
      .populate("author")
      .exec();
  
    // console.log(posts);
    res.status(200).json({ message: "", posts: posts });
  }else{
    let posts = await Post.find()

    res.status('200').json({message:'',posts:posts.length})
  }


});




export const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    // console.log(Post);
    if (post) {
      post.deleteOne();
      return res.status(200).json({ message: "Post Deleted", post: post });
    }
    res.status(404).json({ message: "Post not Found" });


  } catch (err) {
    res.status(500).json({ message: "Invalid Operation" });
  }
});




export const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { updatedPost } = req.body;
  let filter = { _id : id}
  try {
    const post = await Post.find(filter);
    console.log(updatedPost);
    if (!post) {
      return res.status(404).json({ message: "Post doesn't exits" });
    }
    post[0].title = updatedPost.title;
    post[0].content = updatedPost.content;
    post[0].picture = updatedPost.picture;
    post[0].category = updatedPost.category;
    post[0].save();

    res.status(200).json({ message: "user updated", post: post });
  } catch (err) {
    res.status(500).json({ message: "Invalid User Info", error: err.message });
  }
});










export const createPost = catchAsync(async (req, res) => {
  const { newPost } = req.body;
  try {
  
    // Create the new post
    const post = new Post({
      title: newPost.title,
      subtitle: newPost.subtitle,
      content: newPost.content,
      likes: [],
      comments:[],
      picture: newPost.picture,
      author: newPost.author,
      category: newPost.category,
    });
    await post.save();
    res
      .status(201)
      .json({ post: post, message: "New post created successfully" });
  } catch (error) {
    console.log(error);
  }


});
