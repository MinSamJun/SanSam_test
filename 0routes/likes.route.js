// express 프레임워크 호출
const express = require("express");
// 라우터 객체 생성
const router = express.Router();

// 인증 미들웨어 호출
const authmiddleware = require("../middlewares/auth-middleware.js");
// 모듈 호출
const LikesController = require("../1controllers/likes.controller.js");
// 인스턴트화 해서 객체에 선언
const likesController = new LikesController();

// 모듈안의 매서드들을 API에 할당한다.
router.post("/posts/:postId/like", authmiddleware, likesController.liker);
router.get("/likes", authmiddleware, likesController.likeslist);

// 모듈로 내보낸다.
module.exports = router;
