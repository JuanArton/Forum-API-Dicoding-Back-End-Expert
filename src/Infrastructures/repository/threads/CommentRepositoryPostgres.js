const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const CommentRepository = require('../../../Domains/comments/CommentRepository');

const AddedComment = require('../../../Domains/comments/entites/AddedComment');
const Comment = require('../../../Domains/comments/entites/Comment');

class ThreadCommentsRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, { content }, owner) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const { rows } = await this._pool.query(query);

    return new AddedComment({ ...rows[0] });
  }

  async verifyCommentOwner(id, userId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('Komentar tidak ditemukan');

    if (rows[0].owner !== userId) throw new AuthorizationError('Anda tidak memiliki akses untuk mengakses komentar ini');
  }

  async deleteCommentById(commentId, userId) {
    await this.verifyCommentOwner(commentId, userId);

    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1 RETURNING id',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentByThreadId(id) {
    const query = {
      text: `SELECT c.id, users.username, c.date, c.content, c.is_deleted AS "isDeleted" FROM comments AS c
        LEFT JOIN users ON c.owner = users.id
        WHERE thread_id = $1
        GROUP BY c.id, users.username
        ORDER BY date`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) return [];

    return rows.map((it) => new Comment(it));
  }

  async verifyCommentExist(commentId, threadId) {
    const query = {
      text: 'SELECT thread_id AS "threadId" FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('Komentar tidak ditemukan');

    if (rows[0].threadId !== threadId) throw new NotFoundError('Komentar tidak ditemukan pada thread');
  }
}

module.exports = ThreadCommentsRepositoryPostgres;
