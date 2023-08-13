const Answer = require("../models/Answer");
const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const addNewAnswerToQuestion = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.questionId;

  const { content } = req.body;

  const answer = await Answer.create({
    content,
    question: questionId,
    user: userId,
  });

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const getAllAnswersByQuestion = asyncErrorWrapper(async (req, res, next) => {
  const questionId = req.params.questionId;

  const question = await Question.findById(questionId).populate("answers");

  const answers = question.answers;

  return res.status(200).json({
    success: true,
    count: answers.length,
    answers,
  });
});

const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {
  const answerId = req.params.answerId;

  const answer = await Answer.findById(answerId)
    .populate({
      path: "question",
      select: "title",
    })
    .populate({
      path: "user",
      select: "name profile_image",
    });

  return res.status(200).json({
    success: true,
    answer,
  });
});

const editAnswer = asyncErrorWrapper(async (req, res, next) => {
  const { content } = req.body;
  const answerId = req.params.answerId;

  const answer = await Answer.findById(answerId);

  answer.content = content;

  await answer.save();

  return res.status(200).json({
    success: true,
    answer,
  });
});

const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {
  const answerId = req.params.answerId;
  const questionId = req.params.questionId;

  await Answer.findByIdAndRemove(answerId);

  const question = await Question.findById(questionId);

  const index = question.answers.indexOf(answerId);
  question.answers.splice(index, 1);
  question.answerCount = question.answers.length;

  await question.save();

  return res.status(200).json({
    success: true,
    message: "Answer deleted successfully",
  });
});

const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answerId;

  const answer = await Answer.findById(answerId);

  if (answer.likes.includes(userId)) {
    return next(new CustomError("You already liked this answer", 400));
  }

  answer.likes.push(userId);
  answer.likeCount = answer.likes.length;

  await answer.save();

  return res.status(200).json({
    success: true,
    answer,
  });
});

const undoLikeAnswer = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answerId;

  const answer = await Answer.findById(answerId);

  if (!answer.likes.includes(userId)) {
    return next(
      new CustomError("You can not undo like operation for this answer", 400)
    );
  }

  const index = answer.likes.indexOf(userId);

  answer.likes.splice(index, 1);
  answer.likeCount = answer.likes.length;

  await answer.save();

  return res.status(200).json({
    success: true,
    answer,
  });
});

module.exports = {
  addNewAnswerToQuestion,
  getAllAnswersByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer,
};
