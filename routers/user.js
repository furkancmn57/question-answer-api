const express = require("express");
const uploadImage = require("../middlewares/libraries/uploadImage");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const {
  uploadProfileImage,
  profile,
  deleteProfileImage,
  changePassword,
  forgotPassword,
  resetPassword,
  getSingleUser,
  getAllUsers,
  editDetails,
} = require("../controllers/userController");
const {
  checkUserExist,
} = require("../middlewares/database/databaseErrorHelpers");
const userQueryMiddleware = require("../middlewares/query/userQueryMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", getAccessToRoute, profile);

router.post(
  "/upload-profile-image",
  [getAccessToRoute, uploadImage.single("profile_image")],
  uploadProfileImage
);
router.put("/delete-profile-image", getAccessToRoute, deleteProfileImage);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.put("/change-password", getAccessToRoute, changePassword);

router.put("/edit-details", getAccessToRoute, editDetails);

router.get("/", userQueryMiddleware(User), getAllUsers);
router.get("/:userId", checkUserExist, getSingleUser);

module.exports = router;
