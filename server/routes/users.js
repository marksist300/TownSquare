const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getFollowingList,
} = require("../controllers/user");
//Get user
router.get("/", getUser);

//Delete user
router.delete("/delete/:id", deleteUser);

//Update user
router.put("/update/:id", updateUser);

//Follow user
router.put("/follow/:id", followUser);

//Unfollow user
router.put("/unfollow/:id", unfollowUser);

//Get Followers list
router.get("/followers/:id", getFollowingList);

module.exports = router;
