"use strict";

var jwt = require("jsonwebtoken");

module.exports = function (_ref) {
  var id = _ref.id;
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET);
};