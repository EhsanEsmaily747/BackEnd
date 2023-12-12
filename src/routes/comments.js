import express from "express";
import {getAll , createComment, deleteComment} from "../controllers/comments.js";

const router=express.Router()

router.route('/').post(createComment).get(getAll);
router.route('/:id').delete(deleteComment);


export default router;