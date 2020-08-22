"use strict";

var dotenv = require("dotenv");

var path = require("path");

if (process.env.NODE_ENV === "production") {
  dotenv.config({
    path: path.join(__dirname, "../../.env.production")
  });
} else {
  dotenv.config({
    path: path.join(__dirname, "../../.env.development")
  });
}