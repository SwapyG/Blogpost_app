const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 * @param {String} id - User ID
 * @returns {String} JWT token
 */
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

/**
 * Set token cookie
 * @param {Object} res - Express response object
 * @param {String} token - JWT token
 */
exports.setTokenCookie = (res, token) => {
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("token", token, options);
};
