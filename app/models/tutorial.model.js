const mongoose = require("mongoose");

const Tutorial = mongoose.model(
  "tutorial",
  mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean,
    },
    { timestamps: true }
  )
);

module.exports = Tutorial;
