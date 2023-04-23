const { ErrorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");
const { getUserData } = require("../controllers/auth.controller");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization:'BearerToken'
    console.log(token);
    if (!token) {
      throw new ErrorHandler(401, "Authentication failed");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserData(decodedToken.sub);

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    const error = new ErrorHandler(401, "Authentication failed");
    return next(error);
  }
};
