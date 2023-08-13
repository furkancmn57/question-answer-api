const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../../helpers/error/CustomError");

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename);
    cb(null, path.join(rootDir, "/public/uploads"));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    req.savedImage = uuidv4() + extension;
    cb(null, req.savedImage);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new CustomError("Please provide a valid image file", 400), false);
  }

  return cb(null, true);
};

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const uploadImage = multer({ storage, fileFilter, limits });

module.exports = uploadImage;
