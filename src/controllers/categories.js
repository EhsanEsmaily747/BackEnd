import Category from "../models/category.js";
import { catchAsync } from "../middlewares.js";
import Post from "../models/post.js"




export const getAll = catchAsync(async (req, res) => {

  const categories = await Category.find()

  res.status(200).json({ message: "", list: categories })
});







export const createCategory = catchAsync(async (req, res) => {

  const { name } = req.body;

  const existCategory = await Category.find({ name: name });

  console.log(existCategory)
  if (existCategory.length > 0) {
    return res.status(500).json({ message: "Category already exist" });
  }
  const newCategory = await Category.create({
    name: name
  });

  return res.status(200).json({ category: newCategory });
});







export const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const existCategory = await Category.findById(id);

  if (existCategory.length > 0) {
    return res.status(500).json({ message: "Category doesn't exist" })
  }
  existCategory.deleteOne();

  const filter={category:id}

  const posts = await Post.find(filter)

  for (let index = 0; index < posts.length; index++) {
    posts[index].category='65576fedfbdf37c88b835229'
    posts[index].save()  
  }

  return res.status(200).json({ message: "Category Deleted ", category: existCategory })

});
