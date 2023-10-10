class SoftDeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const { threadId, commentId, owner } = payload;

    await this._threadRepository.verifyThreadExist(threadId);

    await this._commentRepository.deleteCommentById(commentId, owner);
  }
}

module.exports = SoftDeleteCommentUseCase;
