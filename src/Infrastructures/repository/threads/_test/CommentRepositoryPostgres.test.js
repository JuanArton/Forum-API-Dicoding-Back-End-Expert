const pool = require('../../../database/postgres/pool');

const AuthorizationError = require('../../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../../Domains/comments/entites/AddedComment');
const AddComment = require('../../../../Domains/comments/entites/AddComment');

const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../../tests/CommentTableTestHelper');

describe('CommentsRepositoryPostgres', () => {
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
    await ThreadTableTestHelper.addThread({ ...dummyThread });
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment', () => {
    it('should presist AddComment and return added comment correctly', async () => {
      const addComment = new AddComment({ content: 'Comment Content' });
      const fakeIdGenerator = () => '123';

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepository.addComment(dummyThread.id, addComment, dummyUser.id);

      const comments = await CommentTableTestHelper.findCommentById('comment-123');

      expect(comments).toHaveLength(1);
    });

    it('should return AddedComment correctly', async () => {
      const addComment = new AddComment({ content: 'Comment Content' });
      const fakeIdGenerator = () => '123';

      const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await repository
        .addComment(dummyThread.id, addComment, dummyUser.id);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: dummyUser.id,
      }));
    });
  });

  describe('verifyCommentOwner ', () => {
    it('should throw NotFoundError if comment is not found', async () => {
      const repository = new CommentRepositoryPostgres(pool, {});

      await expect(repository.verifyCommentOwner('comment-123', dummyUser.id))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when forbidden', async () => {
      const repository = new CommentRepositoryPostgres(pool, {});

      await CommentTableTestHelper.addComment({ id: 'comment-123', owner: dummyUser.id });

      await expect(repository.verifyCommentOwner('comment-123', dummyUser2.id))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw ClientError if not forbidden', async () => {
      const repository = new CommentRepositoryPostgres(pool, {});

      await CommentTableTestHelper.addComment({ id: 'comment-123', owner: dummyUser.id });

      await expect(repository.verifyCommentOwner('comment-123', dummyUser.id))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should throw AuthorizationError if forbidden', async () => {
      await CommentTableTestHelper.addComment({ id: 'comment-123', owner: dummyUser.id });

      const repository = new CommentRepositoryPostgres(pool, {});

      await expect(repository.deleteCommentById('comment-123', dummyUser2.id))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should soft delete comment corectly', async () => {
      const repository = new CommentRepositoryPostgres(pool, {});

      await CommentTableTestHelper.addComment({ id: 'comment-123', owner: dummyUser.id });

      await repository.deleteCommentById('comment-123', dummyUser.id);

      const [comment] = await CommentTableTestHelper.findCommentById('comment-123');

      expect(comment.is_deleted).toEqual(true);
    });
  });

  describe('getCommentByThreadId', () => {
    it('should return empty array if there is no comment found', async () => {
      const repository = new CommentRepositoryPostgres(pool, {});

      const comments = await repository.getCommentByThreadId(dummyThread.id);

      expect(comments).toEqual([]);
    });

    it('should return array of comments with expected comment value', async () => {
      const repo = new CommentRepositoryPostgres(pool, {});

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'Comment Content',
        owner: dummyUser.id,
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-abc',
        content: 'Comment Content',
        owner: dummyUser2.id,
      });

      await CommentTableTestHelper.deleteComment('comment-abc');

      const comment = await repo.getCommentByThreadId(dummyThread.id);

      expect(comment[0].id).toStrictEqual('comment-123');
      expect(comment[0].username).toStrictEqual(dummyUser.username);
      expect(comment[0].content).toStrictEqual('Comment Content');
      expect(comment[0].date.getDate()).toStrictEqual(new Date().getDate());

      expect(comment[1].id).toStrictEqual('comment-abc');
      expect(comment[1].username).toStrictEqual(dummyUser2.username);
      expect(comment[1].content).toStrictEqual('**komentar telah dihapus**');
      expect(comment[1].date.getDate()).toStrictEqual(new Date().getDate());
    });
  });

  describe('verifyCommentExist method', () => {
    const repo = new CommentRepositoryPostgres(pool, {});

    it('should throw NotFoundError if comment is not found', async () => {
      await expect(repo.verifyCommentExist('comment-123', dummyThread.id))
        .rejects.toThrowError(new NotFoundError('Komentar tidak ditemukan'));
    });

    it('should throw NotFoundError if comment is invalid', async () => {
      await CommentTableTestHelper.addComment({});

      await expect(repo.verifyCommentExist('comment-123', 'thread-xyz'))
        .rejects.toThrowError(new NotFoundError('Komentar tidak ditemukan pada thread'));
    });

    it('should not throw NotFoundError if the comment is valid', async () => {
      await CommentTableTestHelper.addComment({});

      await expect(repo.verifyCommentExist('comment-123', dummyThread.id))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
