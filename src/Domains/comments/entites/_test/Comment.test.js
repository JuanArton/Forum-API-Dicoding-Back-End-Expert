const Comment = require('../Comment');

describe('a Comment Entities', () => {
  it('should thrown error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 111,
      username: 'dicoding',
      date: new Date(),
      content: 'Comment Content',
      likeCount: 0,
      isDeleted: false,
    };

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    const payload = {
      id: 'comment-xxx',
      username: 'dicoding',
      date: new Date(),
      content: 'Comment Content',
      likeCount: 0,
      isDeleted: false,
    };

    const result = new Comment(payload);

    expect(result.id).toStrictEqual(payload.id);
    expect(result.username).toStrictEqual(payload.username);
    expect(result.date).toStrictEqual(payload.date);
    expect(result.content).toStrictEqual(payload.content);
  });

  it('should create Comment object correctly when comment isDeleted', () => {
    const payload = {
      id: 'comment-xxx',
      username: 'dicoding',
      date: new Date(),
      content: 'Comment Content',
      likeCount: 0,
      isDeleted: true,
    };

    const result = new Comment(payload);

    expect(result.id).toStrictEqual(payload.id);
    expect(result.username).toStrictEqual(payload.username);
    expect(result.date).toStrictEqual(payload.date);
    expect(result.content).toStrictEqual('**komentar telah dihapus**');
  });
});
