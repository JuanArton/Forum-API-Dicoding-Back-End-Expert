/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

module.exports = {
  async likeComment({
    id = 'like-123',
    commentId = 'comment-123',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async dislikeComment({
    commentId = 'comment-123',
    owner = 'user-123',
  }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await pool.query(query);
  },

  async verifyLike(id) {
    const query = {
      text: 'SELECT comment_id AS "commentId", owner FROM likes WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes');
  },
};
