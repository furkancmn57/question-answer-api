const mongoose = require("mongoose");
const Question = require("./Question");

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  content: {
    type: String,
    required: [true, "Please provide a content"],
    minlength: [10, "Please provide a content at least 10 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  question: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Question",
  },
});

AnswerSchema.pre("save", async function (next) {
  if (!this.isModified("user")) {
    return next();
  }

  try {
    const question = await Question.findById(this.question);

    question.answers.push(this._id);
    question.answerCount = question.answers.length;

    await question.save();

    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("Answer", AnswerSchema);
