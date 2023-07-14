// express 프레임 워크 호출
const express = require("express");
// 라우터 객체 생성
const router = express.Router();

// 인증 미들웨어 호출
const authmiddleware = require("../middlewares/auth-middleware.js");
// 컨트롤러 레이어에서 모듈 호출
const PostsController = require("../1controllers/posts.controller.js");
// 모듈을 클래스로 선언
const postsController = new PostsController();

// 모듈안의 매서드들을 각각 api로 보낸다
router.get("/posts", postsController.viewpostslist);
router.get("/posts/:postId", postsController.viewonepost);
router.post("/posts", authmiddleware, postsController.createPost);
router.patch("/posts/:postId", authmiddleware, postsController.editPost);
router.delete("/posts/:postId", authmiddleware, postsController.deletePost);

// router 객체를 모듈로 내보낸다.
module.exports = router;
