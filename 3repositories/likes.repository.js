const { Likes, Posts, Users } = require("../models");
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

class LikeRepository {
  liker = async (postId, userId) => {
    const target = await Likes.findOne({
      where: { postId, userId },
    });
    if (!target) {
      const like = await Likes.create({ postId, userId });
      return like;
    } else {
      const like = await Likes.destroy({
        where: { postId, userId },
      });
      return like;
    }
  };

  likeslist = async (userId) => {
    const allPosts = await sequelize.query(
      `SELECT u.nickname, p.title, p.content, p.createdAt, COUNT(l.postId) AS likesCount
        FROM Posts AS p
          LEFT JOIN Users as u on p.userId = u.userId 
          LEFT JOIN Likes as l on p.postId = l.postId
              WHERE u.userId = ${userId}
              GROUP BY p.postId
              ORDER BY likesCount DESC`,
      { type: QueryTypes.SELECT }
    );
    return allPosts;
  };
}
module.exports = LikeRepository;
