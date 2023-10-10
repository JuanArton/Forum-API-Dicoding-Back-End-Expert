const DetailThread = require('../../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const Comment = require('../../../../Domains/comments/entites/Comment');
const GetThreadUseCase = require('../GetDetailThreadUseCase');
const Reply = require('../../../../Domains/replies/entities/Reply');
const RepliesRepository = require('../../../../Domains/replies/RepliesRepository');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const expectedGetDetailThread = new DetailThread({
      id: 'thread-xxx',
      title: 'Thread Title',
      body: 'Thread Body',
      date: new Date(),
      username: 'dicoding',
    });

    const expectedGetComments = [
      new Comment({
        id: 'comment-123',
        username: 'dicoding',
        date: new Date(),
        content: 'Comment Content',
        isDeleted: false,
      }),
      new Comment({
        id: 'comment-456',
        username: 'dicoding2',
        date: new Date(),
        content: 'Comment Content',
        isDeleted: false,
      }),
    ];

    const expectedGetReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: new Date(),
        content: 'Reply Content',
        isDeleted: false,
        commentId: 'comment-123',
      },
      {
        id: 'reply-456',
        username: 'dicoding2',
        date: new Date(),
        content: 'Reply Content',
        isDeleted: false,
        commentId: 'comment-456',
      },
      {
        id: 'reply-789',
        username: 'dicoding3',
        date: new Date(),
        content: 'Reply Content',
        isDeleted: true,
        commentId: 'comment-123',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetDetailThread));

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetComments));

    mockRepliesRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    const thread = await getThreadUseCase.execute(expectedGetDetailThread.id);

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: expectedGetComments[0].date,
        content: 'Comment Content',
        replies: [
          new Reply({
            id: 'reply-123',
            username: 'dicoding',
            date: expectedGetReplies[0].date,
            content: 'Reply Content',
            isDeleted: false,
            commentId: 'comment-123',
          }),
          new Reply({
            id: 'reply-789',
            username: 'dicoding3',
            date: expectedGetReplies[2].date,
            content: 'Reply Content',
            isDeleted: true,
            commentId: 'comment-123',
          }),
        ],
      },
      {
        id: 'comment-456',
        username: 'dicoding2',
        date: expectedGetComments[1].date,
        content: 'Comment Content',
        replies: [
          new Reply({
            id: 'reply-456',
            username: 'dicoding2',
            date: expectedGetReplies[1].date,
            content: 'Reply Content',
            isDeleted: false,
            commentId: 'comment-456',
          }),
        ],
      },
    ];

    const expectedDetailThread = {
      ...expectedGetDetailThread,
      comments: expectedComment,
    };

    expect(thread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(expectedGetDetailThread.id);
    expect(mockCommentRepository.getCommentByThreadId)
      .toBeCalledWith(expectedGetDetailThread.id);
    expect(mockRepliesRepository.getRepliesByCommentId).toBeCalledWith(['comment-123', 'comment-456']);
  });
});
