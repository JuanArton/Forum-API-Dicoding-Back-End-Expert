const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const SoftDeleteCommentUseCase = require('../SoftDeleteCommentUseCase');

describe('SoftDeleteCommentUseCase', () => {
  it('should orchestracting the delete comment action correctly', async () => {
    const payload = {
      threadId: 'thread-xxx',
      commentId: 'comment-xxx',
      owner: 'user-xxx',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteComment = new SoftDeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteComment.execute(payload);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith(payload.commentId, payload.owner);
  });
});
