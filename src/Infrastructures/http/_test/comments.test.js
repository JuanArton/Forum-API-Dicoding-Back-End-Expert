const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and added comment', async () => {
      const payload = {
        content: 'Comment Content',
      };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 401 if missing authentication', async () => {
      const payload = {
        content: 'Comment Content',
      };

      const server = await createServer(container);

      const { userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toBeDefined();
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const payload = {};
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat membuat komentar, data tidak lengkap');
    });

    it('should response 400 when data type not match specification', async () => {
      const payload = { content: 123 };
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat membuat komentar, tipe data tidak valid');
    });

    it('should response 404 when thread not exists', async () => {
      const payload = {
        content: 'Comment Content',
      };
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-456/comments',
        payload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 if comment deleted successfuly', async () => {
      const payload = {
        content: 'Comment Content',
      };
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const { data: comment } = JSON.parse(commentResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/${comment.addedComment.id}`,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      const [deletedComment] = await CommentTableTestHelper
        .findCommentById(comment.addedComment.id);
      expect(deletedComment.is_deleted).toEqual(true);
    });

    it('should response 404 when comment not exist', async () => {
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });

    it('should response 404 when thread id not exist', async () => {
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-456/comments/comment-123',
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 403 if forbidden', async () => {
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-xxx', username: 'dicoding2' });

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-xxx' });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak memiliki akses untuk mengakses komentar ini');
    });
  });
});
