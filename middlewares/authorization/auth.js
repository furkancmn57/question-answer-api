const jwt = require("jsonwebtoken");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/authorization/tokenHelpers");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

const getAccessToRoute = (req, res, next) => {
  const { ACCESS_TOKEN_SECRET } = process.env;

  if (!isTokenIncluded(req)) {
    return next(
      new CustomError("You are not authorized to access this route", 401)
    );
  }
  const accessToken = getAccessTokenFromHeader(req);
  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("You are not authorized to access this route", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (user.role !== "admin") {
    return next(new CustomError("Only admins can access this route", 403));
  }

  next();
});

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.questionId;

  const question = await Question.findById(questionId);

  if (question.user != userId) {
    return next(new CustomError("Only owner can handle this operation", 403));
  }

  next();
});

const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answerId;

  const answer = await Answer.findById(answerId);

  if (answer.user != userId) {
    return next(new CustomError("Only owner can handle this operation", 403));
  }

  next();
});

module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getQuestionOwnerAccess,
  getAnswerOwnerAccess,
};
