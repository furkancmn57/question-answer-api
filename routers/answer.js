const express = require("express");
const {
  getAccessToRoute,
  getAnswerOwnerAccess,
} = require("../middlewares/authorization/auth");
const {
  addNewAnswerToQuestion,
  getAllAnswersByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer,
} = require("../controllers/answerController");
const {
  checkQuestionAndAnswerExist,
} = require("../middlewares/database/databaseErrorHelpers");

const router = express.Router({ mergeParams: true });

router.post("/", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswersByQuestion);
router.get("/:answerId", checkQuestionAndAnswerExist, getSingleAnswer);
router.put(
  "/:answerId/edit",
  [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  editAnswer
);
router.delete(
  "/:answerId/delete",
  [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  deleteAnswer
);
router.get(
  "/:answerId/like",
  [checkQuestionAndAnswerExist, getAccessToRoute],
  likeAnswer
);
router.get(
  "/:answerId/undo-like",
  [checkQuestionAndAnswerExist, getAccessToRoute],
  undoLikeAnswer
);

module.exports = router;
