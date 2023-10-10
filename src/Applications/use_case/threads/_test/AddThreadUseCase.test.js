const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const payload = {
      title: 'Thread Title',
      body: 'Thread Body',
      owner: 'user-xxx',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-xxx',
      title: payload.title,
      owner: payload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(payload);

    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(payload));
  });
});
