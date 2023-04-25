const userService = require("../services/user.service");
const tokenService = require("../services/token.service");
const authService = require("../services/auth.service");

const registerUser = async (req, res) => {
  // console.log(req.body);
  const user = await userService.createUser(req.body);

  await userService.createAccountWallet(req.body);

  console.log("user", user);

  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
};

const getUserData = async (userId) => {
  const user = await userService.getUserById(userId);

  return user;
};

module.exports = { registerUser, loginUser, getUserData };
