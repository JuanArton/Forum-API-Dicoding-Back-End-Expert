class LikeUseCase {
  constructor({
    threadRepository,
    commentRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(payload) {
    const { threadId, commentId, owner } = payload;

    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId, threadId);

    const isLiked = await this._likeRepository.verifyLike(commentId, owner);

    if (!isLiked) {
      this._likeRepository.likeComment(commentId, owner);

      return;
    }

    this._likeRepository.dislikeComment(commentId, owner);
  }
}

module.exports = LikeUseCase;
