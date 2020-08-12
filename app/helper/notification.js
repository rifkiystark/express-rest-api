var admin = require("firebase-admin");

var serviceAccount = require("../config/serviceAccount.json");

const sendNotification = (tokens, message) => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gawe-5dd57.firebaseio.com",
  });

  //console.log(tokens);

  var message = {
    data: {
      message: message,
    },
    tokens: tokens,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .sendMulticast(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

module.exports = { sendNotification };
