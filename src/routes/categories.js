import express from "express";
import { getAll , deleteCategory , createCategory } from "../controllers/categories.js";

const router = express.Router();

router.route('/').post(createCategory).get(getAll);
router.route('/:id').delete(deleteCategory);


export default router;