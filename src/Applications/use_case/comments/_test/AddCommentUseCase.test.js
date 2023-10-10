const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddComment = require('../../../../Domains/comments/entites/AddComment');
const AddedComment = require('../../../../Domains/comments/entites/AddedComment');
const CommentsRepository = require('../../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    const payload = {
      threadId: 'thread-xxx',
      content: 'Comment Content',
      owner: 'user-xxx',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-xxx',
      content: payload.content,
      owner: payload.owner,
    });

    const mockCommentRepository = new CommentsRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(payload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith('thread-xxx');
    expect(mockCommentRepository.addComment)
      .toBeCalledWith('thread-xxx', new AddComment(payload), expectedAddedComment.owner);
  });
});
