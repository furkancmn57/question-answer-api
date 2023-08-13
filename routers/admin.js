const express = require("express");
const {
  getAccessToRoute,
  getAdminAccess,
} = require("../middlewares/authorization/auth");
const {
  checkUserExist,
} = require("../middlewares/database/databaseErrorHelpers");
const {
  totalUserCount,
  deleteUser,
  totalQuestionCount,
} = require("../controllers/adminController");

const router = express.Router();

router.use([getAccessToRoute, getAdminAccess]);

router.get("/total-user-count", totalUserCount);
router.get("/total-question-count", totalQuestionCount);
router.delete("/:userId", checkUserExist, deleteUser);

module.exports = router;
