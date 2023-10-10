const ThreadsRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const Thread = require('../../../Domains/threads/entities/DetailThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

class ThreadsRepositoryPostgres extends ThreadsRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const { rows } = await this._pool.query(query);

    return new AddedThread({ ...rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `
        SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads 
        LEFT JOIN users ON threads.owner = users.id
        WHERE threads.id = $1`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('Thread tidak ditemukan');

    return new Thread({ ...rows[0] });
  }

  async verifyThreadExist(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('Thread tidak ditemukan');
  }
}

module.exports = ThreadsRepositoryPostgres;
