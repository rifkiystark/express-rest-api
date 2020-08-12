require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fileUpload = require("express-fileupload");
const db = require("./app/models");
const base = require("./app/helper/baseurl");
const cors = require("cors");
const { authRoutes } = require("./app/routes/auth.routes");
const { postRoutes } = require("./app/routes/post.routes");
const { commentRoutes } = require("./app/routes/comment.routes");
const { likeRoutes } = require("./app/routes/like.routes");
const { firebaseRoutes } = require("./app/routes/firebaseToken.routes");

console.log(base.databaseurl);
db.mongoose
  .connect(base.databaseurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.use(fileUpload({ createParentPath: true }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hey jude" });
});

app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(likeRoutes);
app.use(firebaseRoutes);

app.use("/image", express.static("uploads"));

app.use("*", function (req, res) {
  res.status(404).send({ status: false, message: "Url not found" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
