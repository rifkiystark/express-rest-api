const dbConfig = require("../db/config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js");
db.user = require("./user.model.js");

module.exports = db;
