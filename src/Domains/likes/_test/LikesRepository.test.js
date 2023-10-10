const LikesRepository = require('../LikesRepository');

describe('LikesRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const repository = new LikesRepository();

    await expect(repository.likeComment('', ''))
      .rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(repository.dislikeComment('', ''))
      .rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(repository.verifyLike('', ''))
      .rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
