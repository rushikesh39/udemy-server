const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(' ')[1];
    if (token) {
      const token = BearerToken.split(" ")[1];
      const validate = jwt.verify(token, process.env.SECRET_KEY);
      if (validate) {
        req.user = validate;
        next();
      } else {
        console.log("User not authorized!");
      }
    }
    else {
      console.log("User not allowed!");
    }
  } catch (error) {
    console.log("Error verifying token:", error.message);
    console.log("User not authorized!");
  }
};

module.exports = { isAuthenticated };
