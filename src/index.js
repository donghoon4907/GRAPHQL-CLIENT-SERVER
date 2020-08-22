require("./module/env");
const morgan = require("morgan");
const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("../generated/prisma-client");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const schema = require("./schema");
const { authenticateJwt } = require("./passport");
const { isAuthenticated } = require("./module/middleware");
//const { executeTranscode } = require("./module/schedule");
const { uploadMiddleware, uploadController } = require("./module/multer");

// request: express의 request 객체
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated, prisma }) // context: resolver의 세 번째 파라미터와 연결
});

const { express: app } = server;

app.use(
  cors({
    origin: true
  })
);

// app.use(
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
app.use(morgan("dev"));
// initialize passport-jwt
app.use(authenticateJwt);
// upload endpoint
app.post("/api/upload", uploadMiddleware, uploadController);
// refresh token endpoint
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

server.start({ port: process.env.PORT || 4000 }, () => {
  //executeTranscode();
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 4000}`
  );
});
