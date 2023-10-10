const AddComment = require('../../../Domains/comments/entites/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { content } = payload;
    const addComment = new AddComment({ content });
    await this._threadRepository.verifyThreadExist(payload.threadId);

    return this._commentRepository.addComment(payload.threadId, addComment, payload.owner);
  }
}

module.exports = AddCommentUseCase;
