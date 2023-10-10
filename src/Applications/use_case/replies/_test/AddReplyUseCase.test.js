const AddReply = require('../../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../../Domains/replies/RepliesRepository');

describe('AddReplyToCommentUseCase', () => {
  it('should orchestracting the add reply action correctly', async () => {
    const payload = {
      threadId: 'thread-xxx',
      replyId: 'repy-xxx',
      commentId: 'comment-xxx',
      content: 'Reply Content',
      owner: 'user-xxx',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-xxx',
      content: payload.content,
      owner: payload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentsRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentsRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockRepliesRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentsRepository,
      repliesRepository: mockRepliesRepository,
    });

    const addedReply = await addReplyUseCase.execute(payload);

    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-xxx', content: payload.content, owner: payload.owner,
    }));
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith('thread-xxx');
    expect(mockCommentsRepository.verifyCommentExist).toBeCalledWith('comment-xxx', 'thread-xxx');
    expect(mockRepliesRepository.addReply).toBeCalledWith('comment-xxx', new AddReply(payload), payload.owner);
  });
});
