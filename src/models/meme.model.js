const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MemeSchema = new Schema({
  src: { type: String, required: true, max: 100 },
  id_user: { type: String, required: true, max: 100 },
  user: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 250 },
  userImg: { type: String, required: false, max: 100 },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Meme", MemeSchema);
