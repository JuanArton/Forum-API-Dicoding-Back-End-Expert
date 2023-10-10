class SoftDeleteReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    repliesRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(payload) {
    await this._threadRepository.verifyThreadExist(payload.threadId);
    await this._commentRepository.verifyCommentExist(payload.commentId, payload.threadId);

    await this._repliesRepository.deleteReplyById(payload.replyId, payload.owner);
  }
}

module.exports = SoftDeleteReplyUseCase;
