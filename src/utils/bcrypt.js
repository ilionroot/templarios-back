const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPassword = async (password) => {
  return password.trim() && (await bcrypt.hash(password, saltRounds));
};

exports.comparePasswords = async (password, hash) => {
  return (
    password.trim() && hash.trim() && (await bcrypt.compare(password, hash))
  );
};
