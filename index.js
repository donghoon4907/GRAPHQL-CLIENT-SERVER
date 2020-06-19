const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const { GraphQLServer } = require("graphql-yoga");
const { authenticateJwt, initializePassport } = require("./passport");
const schema = require("./schema");
const { isAuthenticated } = require("./module/middleware");

// init
dotenv.config();
initializePassport();

// request: express의 request 객체
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated }) // context: resolver의 세 번째 파라미터와 연결
});

const { express: app } = server;

// 모든 요청 로그 활성화.
app.use(morgan("dev"));
// public 폴더를 루트주소로 다루고, 하위의 파일들에 자유롭게 접근할 수 있음.
// app.use(express.static("public"));
// CORS
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// passport 활성화
app.use(authenticateJwt);
// 파일 업로드 활성화
app.use(fileUpload());

server.start({ port: process.env.PORT || 4000 }, () =>
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 4000}`
  )
);
