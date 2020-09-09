require("./module/env");
const morgan = require("morgan");
const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("../generated/prisma-client");
const cors = require("cors");
const schema = require("./schema");
const { isAuthenticated } = require("./module/middleware");
const { uploadMiddleware, uploadController } = require("./module/multer");
const { authenticateJwt } = require("./passport");
/**
 * GraphQLServer 생성
 */
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated, prisma }) // context: resolver의 세 번째 파라미터와 연결
});

const { express } = server;

/**
 * cors 설정
 */
express.use(
  cors({
    origin: true
  })
);

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
server.start({ port: process.env.PORT || 4000 }, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 4000}`
  );
});
