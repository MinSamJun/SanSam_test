// express 호출
const express = require("express");
// 라우터 객체 생성
const router = express.Router();
// 쿠키파서 호출
const cookieParser = require("cookie-parser");

// 라우터 객체에서 쿠키 파서 사용
router.use(cookieParser());

// 컨트롤러에서 내보낸 모듈을 호출
const UsersController = require("../1controllers/users.controller.js");
// 그걸 다시 클래스 선언
const usersController = new UsersController();

// 모듈안의 함수들을 각각의 api 경로로 보낸다.
router.post("/signup", usersController.signupUser);
router.post("/login", usersController.loginUser);

// router 객체를 모듈로 내보낸다.
module.exports = router;
