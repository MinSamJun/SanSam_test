// 레파지토리 레이어의 모듈을 인스턴트로 가져온다.
const PostRepository = require("../repositories/posts.repository");
// Posts 모델을 가져온다.
const { Posts } = require("../models");

// 클래스 정의
class PostService {
  // 인스턴트를 변수에 할당한다.
  postRepository = new PostRepository();

  // 매서드 정의
  findAllPost = async () => {
    // 레파지토리 레이어에서 가져온걸 변수에 할당한다.
    const allPost = await this.postRepository.findAllPost();
    // 가져온 건 있는데 첫 내용이 아무것도 없으면,
    // 경고를 내보낸다.
    if (allPost && !allPost[0]) {
      return {
        status: 200,
        message: "게시물이 없습니다. 첫 작성자가 되어 주세요.",
        allPost: null,
      };
      // 내용물이 있다면, 성공 메시지.
    } else if (allPost) {
      return { status: 200, message: "게시글 조회에 성공하였습니다.", allPost };
      // 아니면 실패 메시지
    } else {
      return {
        status: 400,
        message: "게시물 조회에 실패하였습니다.",
        allPost: null,
      };
    }
  };

  // 게시글 상세 조회 매서드 정의
  findOnePost = async (postId) => {
    // 가져오는데 성공하면,
    try {
      // 게시글 번호가 없으면, 경고 메시지
      if (!postId) {
        return {
          status: 400,
          post: null,
          message: "게시물 상세 조회에 실패하였습니다.",
        };
        // 있으면 조회 성공 메시지
      } else if (postId) {
        const post = await this.postRepository.findOnePost(postId);
        return {
          status: 200,
          post,
          message: "게시물 상세 조회에 성공하였습니다.",
        };
      }
      // 실패하면 실패 메시지
    } catch (err) {
      return { status: 400, message: "게시물 상세 조회에 실패하였습니다." };
    }
  };

  // 게시글 수정 매서드 정의, 레파지토리 레이어에서 받는다.
  editPost = async (title, content, postId, userId) => {
    try {
      // 값이 하나라도 없으면, 에러 메시지
      if (!title || !content || !postId || !userId) {
        return {
          status: 400,
          message: "미입력된 항목이 있습니다. 모든 항목을 입력해 주세요.",
        };
      }
      // 작성자와 게시글번호로 찾는다.
      const target = await Posts.findOne({ where: { postId, userId } });
      // 없으면 경고
      if (!target) {
        return { status: 400, message: "게시글 수정에 실패하였습니다." };
      }
      // 수정 명령을 보내고, post에 할당한다.
      const post = await this.postRepository.editPost(title, content, postId);

      // 할당 성공시 수정 성공 메시지
      if (post) {
        return { status: 200, message: "게시물 수정에 성공하였습니다." };
        // 할당 실패시 수정 실패 메시지
      } else {
        return { status: 400, message: "게시물 수정에 실패하였습니다." };
      }
      // 에러시 실패 메시지
    } catch (err) {
      return { status: 400, message: "게시물 수정에 실패하였습니다." };
    }
  };

  // 삭제 매서드 정의
  deletePost = async (postId, userId) => {
    // 게시글 번호가 없으면 에러 메시지
    if (!postId) {
      return {
        status: 400,
        message: "미입력된 항목이 있습니다. 모든 항목을 입력해 주세요.",
      };
    }
    // postId 와 userId 로 검색하고, target에 할당한다.
    const target = await Posts.findOne({ where: { postId, userId } });

    // 할당 실패시, 삭제 실패 메시지
    if (!target) {
      return { status: 400, message: "게시글 삭제에 실패하였습니다." };
    }
    // 레파지토리 레이어에 삭제 명령을 보낸다.
    const editPost = await this.postRepository.deletePost(postId);
    // 성공 실패시 각각 메시지 출력
    if (editPost) {
      return { status: 200, message: "게시물 삭제에 성공하였습니다." };
    } else {
      return { status: 400, message: "게시물 삭제에 실패하였습니다." };
    }
  };

  // 게시글 생성 매서드 정의
  createOnePost = async (title, content, userId) => {
    try {
      // 하나라도 값이 없으면, 에러 메시지 출력
      if (!title || !content || !userId) {
        return {
          status: 400,
          message: "미입력된 항목이 있습니다. 모두 입력하여 주세요.",
        };
      }

      // 생성 명령을 보내고 할당한다.
      const post = await this.postRepository.createOnePost(
        title,
        content,
        userId
      );
      // 성공, 실패 메시지
      if (post) {
        return { status: 200, message: "게시물 작성에 성공하였습니다." };
      }
      // 에러 메시지
    } catch (err) {
      return { status: 400, message: "게시물 작성에 실패하였습니다." };
    }
  };
}

// 모듈로 내보낸다.
module.exports = PostService;
