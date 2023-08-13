const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/User.js");
const CustomError = require("../helpers/error/CustomError.js");
const Question = require("../models/Question.js");

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.params.userId;

    if (userId === req.user.id) {
        return next(new CustomError("You can not delete yourself", 400));
    }

    await User.findByIdAndRemove(userId);

    return res.status(200).json({
        success: true,
        message: "Delete operation successfull",
    });
});


const totalUserCount = asyncErrorWrapper(async (req, res, next) => {
    const totalUser = await User.countDocuments();

    return res.status(200).json({
        success: true,
        totalUser,
    });
});

const totalQuestionCount = asyncErrorWrapper(async (req, res, next) => {
    const totalQuestion = await Question.countDocuments();

    return res.status(200).json({
        success: true,
        totalQuestion,
    });
});

module.exports = {
    totalUserCount,
    totalQuestionCount,
    deleteUser,
};