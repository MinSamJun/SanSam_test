// 서비스 레이어에서 모듈 가져오기
const PostService = require("../services/posts.service");

// 클래스 선언
class PostsController {
  // 인스턴트를 객체에 할당
  postService = new PostService();

  // 게시글 목록 보기 매서드 정의
  viewpostslist = async (req, res) => {
    // 서비스 레이어에서 상태, 메시지, 게시글을 객체분해할당해온다.
    const { status, message, allPost } = await this.postService.findAllPost();
    // 응답 값으로 내보낸다.
    return res.status(status).json({ message, allPost });
  };

  // 게시글 상세 조회 매서드 정의
  viewonepost = async (req, res) => {
    // 요청 값에서 postId를 가져온다.
    const { postId } = req.params;
    // postId를 기반으로 서비스 레이어에서 내용물을 가져온다.
    const { post, message, status } = await this.postService.findOnePost(
      postId
    );
    // 내보낸다.
    return res.status(status).json({ message, post });
  };

  // 게시글 생성 매서드 정의
  createPost = async (req, res) => {
    // 클라이언트에 제목과 내용을 받는다.
    const { title, content } = req.body;
    // 로컬에서 userId를 받는다.
    const { userId } = res.locals;
    // 서비스 레이어에서 위의 입력값들을 기반으로 응답을 받는다.
    const { status, message } = await this.postService.createOnePost(
      title,
      content,
      userId
    );
    // 응답값으로 내보낸다.
    return res.status(status).json({ message });
  };

  // 게시글을 수정하는 매서드를 정의한다.
  editPost = async (req, res) => {
    // 클라이언트에서 게시글 제목과 내용을 입력받는다.
    const { title, content } = req.body;
    // 요청 값에서 게시글 id를 가져온다.
    const { postId } = req.params;
    // 로컬에서 유저 id를 가져온다.
    const { userId } = res.locals;
    // 위의 네 값을 기반으로, 서비스레이어에서 상태값과 메시지를 가져온다.
    const { status, message } = await this.postService.editPost(
      title,
      content,
      postId,
      userId
    );
    // 출력한다.
    return res.status(status).json({ message });
  };

  // 삭제 매서드 정의
  deletePost = async (req, res) => {
    // 요청 값에서 postId를 얻는다.
    const { postId } = req.params;
    // 로컬 값에서 userId를 던는다.
    const { userId } = res.locals;
    // 서비스 레이어에서 보낸 상태, 메시지 값
    const { status, message } = await this.postService.deletePost(
      postId,
      userId
    );
    // 출력한다.
    res.status(status).json({ message });
  };
}

module.exports = PostsController;
