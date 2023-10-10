/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

module.exports = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'Reply Content',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4)',
      values: [id, commentId, content, owner],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies');
  },
};
