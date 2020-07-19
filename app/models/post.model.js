const mongoose = require("mongoose");

const Post = mongoose.model(
  "post",
  mongoose.Schema(
    {
      imgsrc: { type: String, required: true },
      caption: { type: String, default: "" },
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
  )
);

module.exports = Post;
