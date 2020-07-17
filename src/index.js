const morgan = require("morgan");
const dotenv = require("dotenv");
const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("../generated/prisma-client");
const cors = require("cors");
const schema = require("./schema");
const { authenticateJwt } = require("./passport");
const { isAuthenticated } = require("./module/middleware");
const { executeTranscode } = require("./module/schedule");
const { uploadMiddleware, uploadController } = require("./module/multer");

// init
dotenv.config();

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
// initialize loging
app.use(morgan("dev"));
// initialize passport-jwt
app.use(authenticateJwt);
// upload endpoint
app.post("/api/upload", uploadMiddleware, uploadController);

server.start({ port: process.env.PORT || 4000 }, () => {
  executeTranscode();
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 4000}`
  );
});
