const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //mongodb connection string
    const connection = await mongoose
      .connect("mongodb://127.0.0.1:27017/StyleGo")
      .then(() => {
        console.log(`connected`);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
