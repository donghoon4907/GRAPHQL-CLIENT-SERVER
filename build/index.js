"use strict";

require("./module/env");

var morgan = require("morgan");

var _require = require("graphql-yoga"),
    GraphQLServer = _require.GraphQLServer;

var _require2 = require("../generated/prisma-client"),
    prisma = _require2.prisma;

var cors = require("cors");

var _require3 = require("jsonwebtoken"),
    verify = _require3.verify;

var schema = require("./schema");

var _require4 = require("./passport"),
    authenticateJwt = _require4.authenticateJwt;

var _require5 = require("./module/middleware"),
    isAuthenticated = _require5.isAuthenticated; //const { executeTranscode } = require("./module/schedule");


var _require6 = require("./module/multer"),
    uploadMiddleware = _require6.uploadMiddleware,
    uploadController = _require6.uploadController; // request: express의 request 객체


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
})); // app.use(
//   session({
//     name: "qid",
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
//     }
//   })
// );
// initialize loging

app.use(morgan("dev")); // initialize passport-jwt

app.use(authenticateJwt); // upload endpoint

app.post("/api/upload", uploadMiddleware, uploadController); // refresh token endpoint
// app.post("/refresh_token", async (req, res) => {
//   let token;
//   if (req.headers.authorization) {
//     const splitToken = req.headers.authorization.split(" ");
//     if (splitToken[0] === "Bearer") {
//       token = splitToken[1];
//     }
//   } else {
//     return res.send({ success: false, message: "access token is not defined" });
//   }
//   let payload;
//   try {
//     payload = verify(token, process.env.TOKEN_SECRET);
//   } catch (err) {
//     console.log(err);
//     return res.send({ success: false, message: "fail to verify token" });
//   }
//   // token is valid and
//   // we can send back an access token
//   const user = await prisma.user({ id: payload.id });
//   if (!user) {
//     return res.send({ success: false, message: "fail to match user" });
//   }
//   if (user.tokenVersion !== payload.tokenVersion) {
//     return res.send({ ok: false, accessToken: "" });
//   }
//   sendRefreshToken(res, createRefreshToken(user));
//   return res.send({ ok: true, accessToken: createAccessToken(user) });
// });

server.start({
  port: process.env.PORT || 4000
}, function () {
  //executeTranscode();
  console.log("Server is running on http://localhost:".concat(process.env.PORT || 4000));
});