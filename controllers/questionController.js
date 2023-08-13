const asyncErrorWrapper = require("express-async-handler");
const Question = require("../models/Question.js");
const CustomError = require("../helpers/error/CustomError.js");

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { title, content } = req.body;

  const question = await Question.create({
    title,
    content,
    user: req.user.id,
  });

  return res.status(200).json({
    success: true,
    data: question,
  });
});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { title, content } = req.body;
  const questionId = req.params.questionId;

  const question = await Question.findById(questionId);

  question.title = title;
  question.content = content;

  await question.save();

  return res.status(200).json({
    success: true,
    message: "Question updated successfully",
  });
});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const questionId = req.params.questionId;

  await Question.findByIdAndDelete(questionId);

  return res.status(200).json({
    success: true,
    message: "Question deleted successfully",
  });
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.questionId;

  const question = await Question.findById(questionId);

  if (question.likes.includes(userId)) {
    return next(new CustomError("You already liked this question", 400));
  }

  question.likes.push(userId);
  question.likeCount = question.likes.length;

  await question.save();

  return res.status(200).json({
    success: true,
    data: question,
  });
});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.questionId;

  const question = await Question.findById(questionId);

  if (!question.likes.includes(userId)) {
    return next(
      new CustomError("You can not undo like operation for this question", 400)
    );
  }

  const index = question.likes.indexOf(userId);

  question.likes.splice(index, 1);
  question.likeCount = question.likes.length;

  await question.save();

  return res.status(200).json({
    success: true,
    data: question,
  });
});

module.exports = {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
};
