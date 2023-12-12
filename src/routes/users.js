import express from 'express';
import { getAll,createUser , updateUser ,deleteUser , singUp , login} from '../controllers/users.js';

const router = express.Router();

router.route('/').post(createUser).get(getAll);
router.route('/:id').delete(deleteUser).put(updateUser);
router.route('/login').post(login);
router.route('/signUp').post(singUp);
export default router;
