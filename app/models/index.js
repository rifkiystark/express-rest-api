const dbConfig = require("../db/config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;
db.urlProd = dbConfig.urlProd;
db.tutorials = require("./tutorial.model.js");
db.user = require("./user.model.js");
db.sessionToken = require("./sessionToken.model.js");
db.post = require("./post.model.js");
db.comment = require("./comment.model");
db.like = require("./like.model");

module.exports = db;
