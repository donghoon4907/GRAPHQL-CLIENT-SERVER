"use strict";

var jwt = require("jsonwebtoken");

var dotenv = require("dotenv");

var path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

module.exports = function (_ref) {
  var id = _ref.id;
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET);
};