const ThreadCommentRepository = require('../CommentRepository');

describe('ThreadCommentRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const threadCommentRepository = new ThreadCommentRepository();

    await expect(threadCommentRepository.addComment('', { content: '' }, ''))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadCommentRepository.verifyCommentOwner('', ''))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadCommentRepository.getCommentByThreadId('', ''))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadCommentRepository.deleteCommentById('', ''))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadCommentRepository.verifyCommentExist('', ''))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
