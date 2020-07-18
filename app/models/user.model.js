const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const User = mongoose.model(
  "user",
  mongoose
    .Schema(
      {
        username: { type: String, required: true, unique: true },
        email: { type: String, index: true, unique: true, required: true },
        password: { type: String, required: true },
        isVerified: Boolean,
      },
      { timestamps: true }
    )
    .plugin(uniqueValidator, {
      message: "Error, expected {PATH} to be unique.",
    })
);

module.exports = User;
