const mongooose = require("mongoose");

const connectDatabase = () => {
  mongooose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Connection Successful");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
