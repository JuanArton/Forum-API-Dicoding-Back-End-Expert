const pool = require('../../../database/postgres/pool');

const CommentTableTestHelper = require('../../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');

const AddReply = require('../../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');

describe('RepliesRepositoryPostgres', () => {
  const dummyUser = {
    id: 'user-123',
    username: 'dicoding',
  };

  const dummyUser2 = {
    id: 'user-abc',
    username: 'dicoding1',
  };

  const dummyThread = {
    id: 'thread-123',
    title: '"Thread Title"',
    body: 'Thread Body',
    owner: 'user-123',
  };

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ ...dummyUser });
    await UsersTableTestHelper.addUser({ ...dummyUser2 });
    await ThreadsTableTestHelper.addThread({ ...dummyThread });
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply', () => {
    it('should persist add reply and return added reply correctly', async () => {
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      const addReply = new AddReply({ content: 'Reply Content' });
      const fakeIdGenerator = () => '123';

      const repository = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      await repository.addReply('comment-123', addReply, dummyUser.id);

      const reply = await RepliesTableTestHelper.findReplyById('reply-123');

      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      const addReply = new AddReply({ content: 'Reply Content' });
      const fakeIdGenerator = () => '123';

      const repository = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await repository.addReply('comment-123', addReply, dummyUser.id);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: addReply.content,
        owner: dummyUser.id,
      }));
    });

    describe('verifyReplyOwner', () => {
      it('should throw NotFoundError if comment not found', async () => {
        const repository = new RepliesRepositoryPostgres(pool, {});

        expect(repository.verifyReplyOwner('comment-123', dummyUser.id)).rejects.toThrowError(NotFoundError);
      });

      it('should not throw error if Authorized', async () => {
        await CommentTableTestHelper.addComment({ id: 'comment-123' });

        await RepliesTableTestHelper.addReply({ id: 'reply-123' });

        const repository = new RepliesRepositoryPostgres(pool, {});

        await expect(repository.verifyReplyOwner('reply-123', dummyUser.id)).resolves.not.toThrowError(AuthorizationError);
      });

      it('should not throw error if not Authorized', async () => {
        await CommentTableTestHelper.addComment({ id: 'comment-123' });

        await RepliesTableTestHelper.addReply({ id: 'reply-123' });

        const repository = new RepliesRepositoryPostgres(pool, {});

        await expect(repository.verifyReplyOwner('reply-123', dummyUser2.id)).rejects.toThrowError(AuthorizationError);
      });
    });

    describe('softDeleteReply', () => {
      it('should throw AuthorizationError if forbidden', async () => {
        await CommentTableTestHelper.addComment({ id: 'comment-123' });

        await RepliesTableTestHelper.addReply({ id: 'reply-123' });

        const repository = new RepliesRepositoryPostgres(pool, {});

        await expect(repository.deleteReplyById('reply-123', dummyUser2.id))
          .rejects.toThrowError(AuthorizationError);
      });

      it('should soft delete comment corectly', async () => {
        await CommentTableTestHelper.addComment({ id: 'comment-123' });

        await RepliesTableTestHelper.addReply({ id: 'reply-123' });

        const repository = new RepliesRepositoryPostgres(pool, {});

        await repository.deleteReplyById('reply-123', dummyUser.id);

        const [reply] = await RepliesTableTestHelper.findReplyById('reply-123');

        expect(reply.is_deleted).toEqual(true);
      });
    });

    describe('getRepliesByThreadId', () => {
      it('should return empty array if there is no replies found', async () => {
        await CommentTableTestHelper.addComment({ id: 'comment-123' });

        const repository = new RepliesRepositoryPostgres(pool, {});

        const comments = await repository.getRepliesByCommentId(['comment-123']);

        expect(comments).toEqual([]);
      });

      it('should return array of replies with expected value', async () => {
        await CommentTableTestHelper.addComment({ id: 'comment-123' });

        const repo = new RepliesRepositoryPostgres(pool, {});

        await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: dummyUser.id });

        await RepliesTableTestHelper.addReply({ id: 'reply-124', owner: dummyUser2.id });

        await RepliesTableTestHelper.deleteReply('reply-124');

        const replies = await repo.getRepliesByCommentId(['comment-123']);

        expect(replies[0].id).toStrictEqual('reply-123');
        expect(replies[0].username).toStrictEqual(dummyUser.username);
        expect(replies[0].isDeleted).toStrictEqual(false);
        expect(replies[0].content).toStrictEqual('Reply Content');
        expect(replies[0].date.getDate()).toStrictEqual(new Date().getDate());

        expect(replies[1].id).toStrictEqual('reply-124');
        expect(replies[1].username).toStrictEqual(dummyUser2.username);
        expect(replies[1].content).toStrictEqual('Reply Content');
        expect(replies[1].isDeleted).toStrictEqual(true);
        expect(replies[1].date.getDate()).toStrictEqual(new Date().getDate());
      });
    });
  });
});
