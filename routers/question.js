const express = require("express");
const answer = require("./answer");
const {
  getAccessToRoute,
  getQuestionOwnerAccess,
} = require("../middlewares/authorization/auth");
const {
  askNewQuestion,
  getAllQuestions,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
  getSingleQuestion,
} = require("../controllers/questionController");
const {
  checkQuestionExist,
} = require("../middlewares/database/databaseErrorHelpers");
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware");
const Question = require("../models/Question");
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware");

const router = express.Router();

router.get(
  "/",
  questionQueryMiddleware(Question, {
    population: {
      path: "user",
      select: "name profile_image",
    },
  }),
  getAllQuestions
);

router.get(
  "/:questionId",
  checkQuestionExist,
  answerQueryMiddleware(Question, {
    population: [
      {
        path: "user",
        select: "name profile_image",
      },
      {
        path: "answers",
        select: "content likeCount createdAt",
        populate: {
          path: "user",
          select: "name profile_image",
        },
      },
    ],
  }),
  getSingleQuestion
);


router.post("/ask", getAccessToRoute, askNewQuestion);
router.put(
  "/:questionId/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.delete(
  "/:questionId/delete",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);
router.get(
  "/:questionId/like",
  [getAccessToRoute, checkQuestionExist],
  likeQuestion
);
router.get(
  "/:questionId/undo-like",
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestion
);

router.use("/:questionId/answers", checkQuestionExist, answer);

module.exports = router;
