const AddReply = require('../../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
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
    const { content } = payload;
    const addReply = new AddReply({ content });

    await this._threadRepository.verifyThreadExist(payload.threadId);
    await this._commentRepository.verifyCommentExist(payload.commentId, payload.threadId);

    return this._repliesRepository.addReply(payload.commentId, addReply, payload.owner);
  }
}

module.exports = AddReplyUseCase;
