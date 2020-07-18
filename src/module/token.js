const jwt = require("jsonwebtoken");
require("./env");

module.exports = ({ id }) => jwt.sign({ id }, process.env.JWT_SECRET);
