const User = require("../models/auth.mongo");
const { ErrorHandler } = require("../utils/error");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ErrorHandler(500, "Email already taken");
  }
  console.log(userBody);
  return User.create(userBody);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserById = (userId) => {
  return User.findById(userId);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
