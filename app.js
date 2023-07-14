// app.js = 앱의 시발점

//  라이브러리 호출
// 프레임 워크 호출, 웹 개발을 위한 뼈대
const express = require("express");
// 미들웨어 호출, 쿠키를 파싱한다
const cookieParser = require("cookie-parser");

// 라우터와 연결하기
const usersRouter = require("./0routes/users.route");
const postsRouter = require("./0routes/posts.route");
const likesRouter = require("./0routes/likes.route");
const commentsRouter = require("./0routes/comments.route");

// express 앱 생성
const app = express();
// 포트 번호 설정
const port = 3000;

// JSON 파싱
app.use(express.json());
// /api 경로로 오는 요청을 특정 라우터로 보낸다
app.use("/api", [usersRouter, postsRouter, likesRouter, commentsRouter]);
// 쿠키 파싱
app.use(cookieParser());

// 앱을 port 번에서 실행한다.
app.listen(port, () => {
  console.log(port, "포트로 서버가 연결되었습니다.");
});
