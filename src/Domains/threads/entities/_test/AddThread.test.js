const AddThread = require('../AddThread');

describe('an AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'Thread Title',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 'Thread title',
      body: 111,
      owner: 'user-xxx',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly', () => {
    const payload = {
      title: 'Thread title',
      body: 'Thread body',
      owner: 'user-xxx',
    };

    const addThread = new AddThread(payload);

    expect(addThread.id).toStrictEqual(payload.id);
    expect(addThread.title).toStrictEqual(payload.title);
    expect(addThread.owner).toStrictEqual(payload.owner);
  });
});
