const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and added reply', async () => {
      const commentPayload = {
        content: 'Comment Content',
      };

      const replyPayload = {
        content: 'Reply Content',
      };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: commentPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies`,
        payload: replyPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 401 if missing authentication', async () => {
      const commentPayload = {
        content: 'Comment Content',
      };

      const replyPayload = {
        content: 'Reply Content',
      };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: commentPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies`,
        payload: replyPayload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toBeDefined();
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const commentPayload = {
        content: 'Comment Content',
      };

      const replyPayload = { };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: commentPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies`,
        payload: replyPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat membuat balasan, data tidak lengkap');
    });

    it('should response 400 when data type not match specification', async () => {
      const commentPayload = {
        content: 'Comment Content',
      };

      const replyPayload = {
        content: 123,
      };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: commentPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies`,
        payload: replyPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat membuat balasan, tipe data tidak valid');
    });

    it('should response 404 when thread not exists', async () => {
      const replyPayload = {
        content: 'Reply Content',
      };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-456/comments/comment-123/replies',
        payload: replyPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 404 when comment not exists', async () => {
      const replyPayload = {
        content: 'Reply Content',
      };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: replyPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 reply successfully deleted', async () => {
      const commentPayload = {
        content: 'Comment Content',
      };

      const replyPayload = {
        content: 'Reply Content',
      };

      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: commentPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies`,
        payload: replyPayload,
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { data: reply } = JSON.parse(replyResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies/${reply.addedReply.id}`,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      const [deletedReply] = await RepliesTableTestHelper
        .findReplyById(reply.addedReply.id);
      expect(deletedReply.is_deleted).toEqual(true);
    });

    it('should response 404 when thread not exists', async () => {
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-456/comments/comment-123/replies/replies-123',
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 404 when comment not exists', async () => {
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/replies-123',
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });

    it('should response 403 if forbidden', async () => {
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-xxx', username: 'dicoding2' });

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenAndUserIdHelper({ server });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-xxx' });

      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-xxx' });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak memiliki akses untuk mengakses balasan ini');
    });
  });
});
