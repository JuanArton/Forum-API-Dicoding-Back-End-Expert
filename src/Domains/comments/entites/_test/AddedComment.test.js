const AddedComment = require('../AddedComment');

describe('an AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = { id: 111, content: 'dicoding', owner: 111 };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    const payload = { id: 'comment-xxx', content: 'dicoding', owner: 'user-111' };

    const addComment = new AddedComment(payload);

    expect(addComment.id).toStrictEqual(payload.id);
    expect(addComment.content).toStrictEqual(payload.content);
    expect(addComment.owner).toStrictEqual(payload.owner);
  });
});
