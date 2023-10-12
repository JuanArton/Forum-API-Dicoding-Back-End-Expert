const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const LikesRepository = require('../../../../Domains/likes/LikesRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
  it('should orchestrating like action correctly', async () => {
    const payload = {
      threadId: 'thread-xxx',
      commentId: 'comment-xxx',
      owner: 'user-xxx',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikesRepository = new LikesRepository();

    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockLikesRepository.verifyLike = jest.fn(() => Promise.resolve(false));
    mockLikesRepository.likeComment = jest.fn(() => Promise.resolve());
    mockLikesRepository.dislikeComment = jest.fn(() => Promise.resolve());

    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikesRepository,
    });

    await likeUseCase.execute(payload);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyCommentExist)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(mockLikesRepository.verifyLike).toBeCalledWith(payload.commentId, payload.owner);
    expect(mockLikesRepository.likeComment).toBeCalledWith(payload.commentId, payload.owner);
    expect(mockLikesRepository.dislikeComment).toBeCalledTimes(0);
  });

  it('should orchestrating dislike action correctly', async () => {
    const payload = {
      threadId: 'thread-xxx',
      commentId: 'comment-xxx',
      owner: 'user-xxx',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikesRepository = new LikesRepository();

    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockLikesRepository.verifyLike = jest.fn(() => Promise.resolve(true));
    mockLikesRepository.likeComment = jest.fn(() => Promise.resolve());
    mockLikesRepository.dislikeComment = jest.fn(() => Promise.resolve());

    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikesRepository,
    });

    await likeUseCase.execute(payload);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyCommentExist)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(mockLikesRepository.verifyLike).toBeCalledWith(payload.commentId, payload.owner);
    expect(mockLikesRepository.likeComment).toBeCalledTimes(0);
    expect(mockLikesRepository.dislikeComment).toBeCalledWith(payload.commentId, payload.owner);
  });
});
