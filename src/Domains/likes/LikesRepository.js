class LikesRepository {
  async likeComment (commentId, user) {
    throw new Error('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async dislikeComment (commentId, user) {
    throw new Error('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLike (commentId, user) {
    throw new Error('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikesRepository;
