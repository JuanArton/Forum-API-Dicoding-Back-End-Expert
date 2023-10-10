const AddedReply = require('../AddedReply');

describe('an AddedReply entties', () => {
  it('should create addReply object correctly', () => {
    const payload = {
      id: 'reply-xxx',
      content: 'ReplyContent',
      owner: 'user-xxx',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toStrictEqual(payload.id);
    expect(addedReply.content).toStrictEqual(payload.content);
    expect(addedReply.owner).toStrictEqual(payload.owner);
  });

  it('should throw error if payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload did not meet data type spcification', () => {
    const payload = {
      id: 'user-xxx',
      content: 123,
      owner: 'user-xxx',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
