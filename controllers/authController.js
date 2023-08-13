const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/User.js");
const CustomError = require("../helpers/error/CustomError.js");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers.js");
const { validateUserInput, comparePassword } = require("../helpers/input/inputHelpers.js");

const register = asyncErrorWrapper(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !comparePassword(password, user.password)) {
    return next(new CustomError("Please check your credentials", 400));
  }

  sendJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout successfull",
    });
});

module.exports = {
  register,
  login,
  logout,
};
