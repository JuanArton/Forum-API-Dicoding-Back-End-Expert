const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(commentId, { content }, owner) {
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, content, owner],
    };

    const { rows } = await this._pool.query(query);

    return new AddedReply({ ...rows[0] });
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('Balasan tidak ditemukan');

    if (rows[0].owner !== owner) throw new AuthorizationError('Anda tidak memiliki akses untuk mengakses balasan ini');
  }

  async deleteReplyById(id, userId) {
    await this.verifyReplyOwner(id, userId);

    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1 RETURNING id',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(id) {
    const query = {
      text: `SELECT r.id, users.username, r.date, r.content, r.is_deleted AS "isDeleted", r.comment_id AS "commentId"
        FROM replies AS r LEFT JOIN users ON r.owner = users.id WHERE comment_id = ANY($1::TEXT[])
        GROUP BY r.id, users.username ORDER BY date`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) return [];

    return rows;
  }
}

module.exports = RepliesRepositoryPostgres;
