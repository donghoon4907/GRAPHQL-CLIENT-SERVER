const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

module.exports = ({
  id
}) => jwt.sign({
  id
}, process.env.JWT_SECRET);