require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fileUpload = require("express-fileupload");
const db = require("./app/models");
const base = require("./app/helper/baseurl");

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

var admin = require("firebase-admin");

var serviceAccount = require("./app/config/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gawe-5dd57.firebaseio.com",
});

app.use(fileUpload({ createParentPath: true }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hey jude" });
});

app.get("/send", (req, res) => {
  var registrationToken =
    "cYEYhlh7Jxg:APA91bHysvoia1szMEmcmBOb0VdNFVHs5Os9uxIWgG1O1czSr5kOx9U5nDujqjxYLi3cAMDE3aFNmriHh0MhQ1tOiHayadXn5_NU8UhRh3zKpqIKOODHdaROHAzbWSKcQD3G8PeoS3AY";

  var message = {
    data: {
      score: "850",
      time: "2:45",
      message: "Ayana menyukai fotomu",
    },
    token: registrationToken,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      res.send("Jadi");
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.send(error);
    });
});

require("./app/routes/tutorial.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/post.routes")(app);
require("./app/routes/comment.routes")(app);
require("./app/routes/like.routes")(app);
app.use("/image", express.static("uploads"));
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
