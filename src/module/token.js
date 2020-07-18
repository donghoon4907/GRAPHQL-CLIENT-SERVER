const jwt = require("jsonwebtoken");
require("./module/env");

module.exports = ({ id }) => jwt.sign({ id }, process.env.JWT_SECRET);
