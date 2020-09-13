"use strict";

require("./module/env");

var morgan = require("morgan");

var _require = require("graphql-yoga"),
    GraphQLServer = _require.GraphQLServer;

var _require2 = require("../generated/prisma-client"),
    prisma = _require2.prisma;

var cors = require("cors");

var schema = require("./schema");

var _require3 = require("./module/middleware"),
    isAuthenticated = _require3.isAuthenticated;

var _require4 = require("./module/multer"),
    uploadMiddleware = _require4.uploadMiddleware,
    uploadController = _require4.uploadController;

var _require5 = require("./passport"),
    authenticateJwt = _require5.authenticateJwt;
/**
 * GraphQLServer 생성
 */


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
var express = server.express;
/**
 * cors 설정
 */

express.use(cors({
  origin: true
}));
/**
 * passport 활성화
 */

express.use(authenticateJwt);
/**
 * 요청 로그 활성화
 */

express.use(morgan("dev"));
/**
 * 업로드 endpoint
 */

express.post("/api/upload", uploadMiddleware, uploadController);
/**
 * GraphQLServer 시작
 */

server.start({
  port: process.env.PORT || 4000,
  bodyParserOptions: {
    limit: "100mb",
    type: "application/json"
  }
}, function () {
  console.log("Server is running on http://localhost:".concat(process.env.PORT || 4000));
});