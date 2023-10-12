const pool = require('../../../database/postgres/pool');

const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../../tests/CommentTableTestHelper');
const LikeTableTestHelper = require('../../../../../tests/LikeTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  const dummyUser = {
    id: 'user-123',
    username: 'dicoding',
  };

  const dummyThread = {
    id: 'thread-123',
    title: '"Thread Title"',
    body: 'Thread Body',
    owner: 'user-123',
  };

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ ...dummyUser });
    await ThreadTableTestHelper.addThread({ ...dummyThread });
  });

  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('likeComment', () => {
    it('should persist like comment data', async () => {
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      const fakeIdGenerator = () => '123';

      const repository = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await repository.likeComment('comment-123', dummyUser.id);

      const like = await LikeTableTestHelper.verifyLike('like-123');

      expect(like).toHaveLength(1);
    });
  });

  describe('dislikeComment', () => {
    it('should persist dislike comment data', async () => {
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await LikeTableTestHelper.likeComment({ id: 'like-123' });

      const fakeIdGenerator = () => '123';

      const repository = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await repository.dislikeComment('comment-123', dummyUser.id);

      const like = await LikeTableTestHelper.verifyLike('like-123');

      expect(like).toHaveLength(0);
    });
  });

  describe('verifyLike', () => {
    it('should return null if not available', async () => {
      const repository = new LikeRepositoryPostgres(pool, {});

      return expect(repository.verifyLike('comment-123', dummyUser.id))
        .resolves.toEqual(null);
    });

    it('should return id if available', async () => {
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      await LikeTableTestHelper.likeComment({ id: 'like-123' });

      const repository = new LikeRepositoryPostgres(pool, {});

      return expect(repository.verifyLike('comment-123', dummyUser.id))
        .resolves.toEqual('like-123');
    });
  });
});
