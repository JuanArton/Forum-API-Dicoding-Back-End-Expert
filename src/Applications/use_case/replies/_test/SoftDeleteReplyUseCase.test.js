const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../../Domains/replies/RepliesRepository');
const SoftDeleteReplyUseCase = require('../SoftDeleteReplyUseCase');

describe('SoftDeleteReplyUseCase', () => {
  it('should orchestracting the delete reply action correctly', async () => {
    const payload = {
      threadId: 'thread-xxx',
      commentId: 'comment-xxx',
      replyId: 'reply-xxx',
      owner: 'user-xxx',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const usecase = new SoftDeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    await usecase.execute(payload);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyCommentExist)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(mockRepliesRepository.deleteReplyById).toBeCalledWith(payload.replyId, payload.owner);
  });
});
