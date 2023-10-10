const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      const payload = {
        title: 'Test Thread',
        body: 'Test new thread',
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when bad payload', async () => {
      const payload = {
        title: 'Title Thread',
        body: 111,
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Gagal membuat tread, tipe data tidak valid');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const payload = {
        title: 'Title Thread',
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: { authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Gagal membuat tread, data tidak lengkap');
    });

    it('should respond 401 status code when user not authenticated', async () => {
      const payload = {
        title: 'Test Thread',
        body: 'Test new thread',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toBeDefined();
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should return 200 and thread details', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding2' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.body).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
    });

    it('should return 404 when thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });
});
