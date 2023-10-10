const RepliesRepository = require('../RepliesRepository');

describe('RepliesRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const repliesRepository = new RepliesRepository();

    await expect(repliesRepository.addReply('', { content: '' }, ''))
      .rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(repliesRepository.verifyReplyOwner('', ''))
      .rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(repliesRepository.deleteReplyById('', ''))
      .rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(repliesRepository.getRepliesByCommentId(''))
      .rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
