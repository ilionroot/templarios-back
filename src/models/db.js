const mongoose = require("mongoose");

const url =
  "mongodb+srv://igus:marina2207@templarios-app-cluster.ewrjn.mongodb.net/templarios-database?retryWrites=true&w=majority";
// const url =
//   "mongodb://localhost:27017/templarios-app?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na Ligação ao MongoDB"));
