const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://igus:marina2207@templarios-app-cluster.ewrjn.mongodb.net/templarios-database?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na Ligação ao MongoDB"));
