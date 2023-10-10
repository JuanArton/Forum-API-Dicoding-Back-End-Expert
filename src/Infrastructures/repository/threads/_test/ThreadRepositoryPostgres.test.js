const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../../tests/ThreadTableTestHelper');
const pool = require('../../../database/postgres/pool');
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should presist thread and return added thread correctly', async () => {
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread Body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(addThread);

      const threads = await ThreadTableTestHelper.findThreadById('thread-123');

      expect(threads).toHaveLength(1);
    });

    it('should return AddedThread correctly', async () => {
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread Body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({});

      const threadsRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadsRepoPostgres.addThread(addThread);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: addThread.owner,
      }));
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError if thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return thread detail correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const addThread = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        owner: 'user-123',
      };

      await ThreadTableTestHelper.addThread(addThread);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(thread.id).toEqual(addThread.id);
      expect(thread.title).toEqual(addThread.title);
      expect(thread.body).toEqual(addThread.body);
      expect(thread.date.getMinutes()).toEqual(new Date().getMinutes());
      expect(thread.username).toEqual('dicoding');
    });
  });

  describe('verifyThread', () => {
    it('should throw NotFoundError if thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExist('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExist('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
