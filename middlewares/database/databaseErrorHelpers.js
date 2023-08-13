const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user) {
    return next(new CustomError("There is no such user with that id", 400));
  }

  next();
});

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
  const questionId = req.params.questionId;

  const question = await Question.findById(questionId);

  if (!question) {
    return next(new CustomError("There is no such question with that id", 400));
  }

  next();
});

const checkQuestionAndAnswerExist = asyncErrorWrapper(
  async (req, res, next) => {
    const questionId = req.params.questionId;
    const answerId = req.params.answerId;

    const answer = await Answer.findOne({
      _id: answerId,
      question: questionId,
    });

    if (!answer) {
      return next(
        new CustomError(
          "There is no answer with that id associated with question id",
          400
        )
      );
    }

    next();
  }
);

module.exports = {
  checkUserExist,
  checkQuestionExist,
  checkQuestionAndAnswerExist,
};
