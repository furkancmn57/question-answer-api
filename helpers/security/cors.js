const CustomError = require("../error/CustomError");

const whitelist = ["http://localhost:5555"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new CustomError("Not allowed by CORS", 403));
    }
  },
};

module.exports = corsOptions;
