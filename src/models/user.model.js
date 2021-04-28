const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100, select: false },
  email: { type: String, required: true, max: 100 },
  img: { type: String, required: false },
});

module.exports = mongoose.model("User", UserSchema);
