/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

module.exports = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    content = 'Comment Content',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, threadId, content, owner],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },
};
