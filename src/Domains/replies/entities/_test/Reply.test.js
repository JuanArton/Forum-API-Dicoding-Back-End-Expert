const Reply = require('../Reply');

describe('a ReplyEntity', () => {
  it('should create reply object correctly', () => {
    const payload = {
      id: 'reply-xxx',
      username: 'dicoding',
      date: new Date(),
      content: 'Reply Content',
      isDeleted: false,
    };

    const reply = new Reply(payload);

    expect(reply.id).toStrictEqual(payload.id);
    expect(reply.username).toStrictEqual(payload.username);
    expect(reply.date).toStrictEqual(payload.date);
    expect(reply.content).toStrictEqual(payload.content);
  });

  it('should create reply object correctly when reply isDeleted', () => {
    const payload = {
      id: 'reply-xxx',
      username: 'dicoding',
      date: new Date(),
      content: 'Reply Content',
      isDeleted: true,
    };

    const reply = new Reply(payload);

    expect(reply.id).toStrictEqual(payload.id);
    expect(reply.username).toStrictEqual(payload.username);
    expect(reply.date).toStrictEqual(payload.date);
    expect(reply.content).toStrictEqual('**balasan telah dihapus**');
  });

  it('should throw error when payload did not contain needed property', () => {
    expect(() => new Reply({})).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      date: new Date(),
      content: 'Reply Content',
      isDeleted: false,
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
