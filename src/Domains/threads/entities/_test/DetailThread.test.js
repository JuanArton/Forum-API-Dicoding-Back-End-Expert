const DetailThread = require('../DetailThread');

describe('an DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'Thread Title',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-xxx',
      title: 'Thread title',
      body: 'Thread body',
      date: 123123,
      username: 'kiw kiw',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    const payload = {
      id: 'thread-xxx',
      title: 'Thread title',
      body: 'Thread body',
      date: new Date(),
      username: 'kiw kiw',
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toStrictEqual(payload.id);
    expect(detailThread.title).toStrictEqual(payload.title);
    expect(detailThread.owner).toStrictEqual(payload.owner);
  });
});
