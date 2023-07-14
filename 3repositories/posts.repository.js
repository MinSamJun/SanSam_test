const { Posts } = require("../models");
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

class PostRepository {
  findAllPost = async () => {
    const allPosts = await sequelize.query(
      `SELECT u.nickname, p.title, p.content, p.createdAt, COUNT(l.postId) AS likesCount
        FROM Posts AS p
          LEFT JOIN Users as u on p.userId = u.userId 
          LEFT JOIN Likes as l on p.postId = l.postId
              GROUP BY p.postId
              ORDER BY p.createdAt DESC`,
      { type: QueryTypes.SELECT }
    );
    return allPosts;
  };
  findOnePost = async (postId) => {
    const post = await sequelize.query(
      `SELECT u.nickname, p.title, p.content, p.createdAt, COUNT(l.postId) AS likesCount
        FROM Posts AS p
          LEFT JOIN Users as u on p.userId = u.userId 
          LEFT JOIN Likes as l on p.postId = l.postId
              WHERE p.postId = ${postId}`,
      { type: QueryTypes.SELECT }
    );
    return post;
  };

  createOnePost = async (title, content, userId) => {
    const post = await Posts.create({
      title,
      content,
      userId,
    });
    return post;
  };
  editPost = async (title, content, postId) => {
    const post = await Posts.update(
      {
        title,
        content,
      },
      { where: { postId } }
    );
    return post;
  };
  deletePost = async (postId) => {
    const post = await Posts.destroy({ where: { postId } });
    return post;
  };
}

module.exports = PostRepository;
