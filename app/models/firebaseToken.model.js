const mongoose = require("mongoose");

const FirebaseToken = mongoose.model(
  "firebasetoken",
  mongoose.Schema(
    {
      token: { type: String, required: true },
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
  )
);

module.exports = FirebaseToken;
