const { getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, deleteFriend } = require('../../controllers/userController');
const router = require('express').Router();

router.route('/').get(getUsers).post(createUser);
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);
router.route('/:userId/friend/:friendId').post(addFriend).delete(deleteFriend);

module.exports=router;
