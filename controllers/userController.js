const fs = require("fs");
const path = require("path");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/User.js");
const CustomError = require("../helpers/error/CustomError.js");
const { comparePassword } = require("../helpers/input/inputHelpers.js");
const sendEmail = require("../helpers/libraries/sendEmail.js");

const profile = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId,{__v:0});

  return res.status(200).json({
    success: true,
    data: user,
  });
});

const uploadProfileImage = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!req.savedImage) {
    return next(new CustomError("Please select an image", 400));
  }

  if (!user.profile_image.includes("default.jpg")) {
    if (fs.existsSync(`./public/uploads/${user.profile_image}`)) {
      fs.unlinkSync(`./public/uploads/${user.profile_image}`);
    }
  }

  user.profile_image = req.savedImage;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile image upload successfull",
  });
});

const deleteProfileImage = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (user.profile_image.includes("default.jpg")) {
    return next(new CustomError("This image can not be deleted", 400));
  }

  if (fs.existsSync(`./public/uploads/${user.profile_image}`)) {
    fs.unlinkSync(`./public/uploads/${user.profile_image}`);
  }

  user.profile_image = "default.jpg";

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile image delete successfull",
  });
});

const changePassword = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const { password, newPassword } = req.body;

  const user = await User.findById(userId).select("+password");

  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Wrong Password", 400));
  } else if (password === newPassword) {
    return next(
      new CustomError("New password can not be same old password", 400)
    );
  }

  user.password = newPassword;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "your password has been successfully changed",
  });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;

  const user = await User.findOne({ email: resetEmail });

  if (!user) {
    return next(new CustomError("There is no user with that email", 400));
  }

  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPasswordUrl = `http://localhost:${process.env.PORT}/api/users/reset-password?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour</p>
    `;

  await sendEmail({
    from: process.env.SMTP_USER,
    to: resetEmail,
    subject: "Reset Your Password",
    html: emailTemplate,
  })
    .then(() => {
      return res.status(200).json({
        success: true,
        message: "Token Send To Your Email",
      });
    })
    .catch(async () => {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new CustomError("Email Could Not Be Sent", 500));
    });
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("Please provide a valid token", 400));
  }

  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Invalid token or session expired", 404));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Reset password process successfull",
  });
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const { title, place, website, about } = req.body;

  const user = await User.findById(userId);

  user.title = title;
  user.place = place;
  user.website = website;
  user.about = about;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Your details has been successfully changed",
  });
});

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  return res.status(200).json({
    success: true,
    user,
  });
});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});

module.exports = {
  profile,
  uploadProfileImage,
  deleteProfileImage,
  changePassword,
  forgotPassword,
  resetPassword,
  getSingleUser,
  getAllUsers,
  editDetails,
};
