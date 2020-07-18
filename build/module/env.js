"use strict";

var dotenv = require("dotenv");

var path = require("path");

if (process.env.NODE_ENV === "production") {
  dotenv.config({
    path: path.join(__dirname, "../../.env")
  });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({
    path: path.join(__dirname, "../../.env.development")
  });
} else {
  throw new Error("process.env.NODE_ENV is not defined");
}