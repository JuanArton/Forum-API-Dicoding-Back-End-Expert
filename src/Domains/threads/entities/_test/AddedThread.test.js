const AddedThread = require('../AddedThread');

describe('an AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'Thread Title',
      owner: 'user',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'Thread Title',
      owner: 'user',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    const payload = {
      id: 'user-xxx',
      title: 'Thread Title',
      owner: 'user-xxx',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toStrictEqual(payload.id);
    expect(addedThread.title).toStrictEqual(payload.title);
    expect(addedThread.owner).toStrictEqual(payload.owner);
  });
});
