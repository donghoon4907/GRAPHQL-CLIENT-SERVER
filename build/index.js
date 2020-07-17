"use strict";

var morgan = require("morgan");

var dotenv = require("dotenv");

var _require = require("graphql-yoga"),
    GraphQLServer = _require.GraphQLServer;

var _require2 = require("../generated/prisma-client"),
    prisma = _require2.prisma;

var cors = require("cors");

var schema = require("./schema");

var _require3 = require("./passport"),
    authenticateJwt = _require3.authenticateJwt;

var _require4 = require("./module/middleware"),
    isAuthenticated = _require4.isAuthenticated;

var _require5 = require("./module/schedule"),
    executeTranscode = _require5.executeTranscode;

var _require6 = require("./module/multer"),
    uploadMiddleware = _require6.uploadMiddleware,
    uploadController = _require6.uploadController; // init


dotenv.config(); // request: express의 request 객체

var server = new GraphQLServer({
  schema: schema,
  context: function context(_ref) {
    var request = _ref.request;
    return {
      request: request,
      isAuthenticated: isAuthenticated,
      prisma: prisma
    };
  } // context: resolver의 세 번째 파라미터와 연결

});
var app = server.express;
app.use(cors({
  origin: true
})); // initialize loging

app.use(morgan("dev")); // initialize passport-jwt

app.use(authenticateJwt); // upload endpoint

app.post("/api/upload", uploadMiddleware, uploadController);
server.start({
  port: process.env.PORT || 4000
}, function () {
  executeTranscode();
  console.log("Server is running on http://localhost:".concat(process.env.PORT || 4000));
});