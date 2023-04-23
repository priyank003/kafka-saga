const { ErrorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "jnsjkvndjkfnvdjkfvndjkndfjknggger98tg90er8t90";

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization:'BearerToken'
    console.log("token", token);
    if (!token) {
      throw new ErrorHandler(401, "Authentication failed");
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);

    req.userData = { user_id: decodedToken.user_id };
    next();
  } catch (err) {
    console.log(err);
    const error = new ErrorHandler(401, "Authentication failed");
    return next(error);
  }
};
