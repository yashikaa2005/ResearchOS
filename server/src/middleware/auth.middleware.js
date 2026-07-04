const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1]; //get the jwt token after bearer

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //checks if token signed by secret and extracts payload

    const user = await User.findById(decoded.id).select("-password"); // return everything except pw

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = user; //after logging in, this user use

    next(); //continue to controller
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;