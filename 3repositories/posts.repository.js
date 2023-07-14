// 포스트 모델 호출
const { Posts } = require("../models");
// index.js에서 시퀼라이즈  가져오기
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

// 클래스 정의
class PostRepository {
  // 모든 게시글 찾기 매서드 정의
  findAllPost = async () => {
    // 쿼리 문법을 직접 입력해서 검색 및 정렬
    const allPosts = await sequelize.query(
      `SELECT u.nickname, p.title, p.content, p.createdAt, COUNT(l.postId) AS likesCount
        FROM Posts AS p
          LEFT JOIN Users as u on p.userId = u.userId 
          LEFT JOIN Likes as l on p.postId = l.postId
              GROUP BY p.postId
              ORDER BY p.createdAt DESC`,
      { type: QueryTypes.SELECT }
    );
    // 내보낸다.
    return allPosts;
  };

  // 게시글 하나만 보기
  findOnePost = async (postId) => {
    // 쿼리 문법을 직접 입력해서 가져온다.
    const post = await sequelize.query(
      `SELECT u.nickname, p.title, p.content, p.createdAt, COUNT(l.postId) AS likesCount
        FROM Posts AS p
          LEFT JOIN Users as u on p.userId = u.userId 
          LEFT JOIN Likes as l on p.postId = l.postId
              WHERE p.postId = ${postId}`,
      { type: QueryTypes.SELECT }
    );
    // 내보낸다.
    return post;
  };

  // 게시글 생성 매서드
  createOnePost = async (title, content, userId) => {
    // 입력 받은 값 세개로 게시글을 만든다.
    const post = await Posts.create({
      title,
      content,
      userId,
    });
    // 내보낸다.
    return post;
  };

  // 게시글 수정 매서드
  editPost = async (title, content, postId) => {
    // postId 필드에서 찾은 뒤 제목과 내용을 수정한다.
    const post = await Posts.update(
      {
        title,
        content,
      },
      { where: { postId } }
    );
    // 내보낸다.
    return post;
  };

  // 게시글 삭제
  deletePost = async (postId) => {
    // postId 필드에서 찾아서 삭제한다.
    const post = await Posts.destroy({ where: { postId } });
    return post;
  };
}

// 모듈로 내보낸다
module.exports = PostRepository;
