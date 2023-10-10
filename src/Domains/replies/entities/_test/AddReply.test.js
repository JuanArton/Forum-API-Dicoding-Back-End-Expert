const AddReply = require('../AddReply');

describe('an AddReply entites', () => {
  it('should create addReply object correctly', () => {
    const payload = {
      content: 'Reply Content',
    };

    const addReply = new AddReply(payload);

    expect(addReply.content).toEqual(payload.content);
  });

  it('should throw error if payload did not meet data type specification', () => {
    const payload = { content: 123 };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});
