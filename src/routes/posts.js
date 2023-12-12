import express from "express";
import { getAll , deletePost , createPost , updatePost } from "../controllers/posts.js";

const router = express.Router();

router.route('/').post(createPost).get(getAll);
router.route('/:id').delete(deletePost).put(updatePost);


export default router;