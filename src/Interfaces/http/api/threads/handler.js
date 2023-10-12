const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/threads/GetDetailThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const SoftDeleteCommentUseCase = require('../../../../Applications/use_case/comments/SoftDeleteCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const SoftDeleteReplyUseCase = require('../../../../Applications/use_case/replies/SoftDeleteReplyUseCase');
const LikeUseCase = require('../../../../Applications/use_case/likes/LikeUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const { title, body } = request.payload;
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ title, body, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const getThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const thread = await getThreadUseCase.execute(request.params.threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async postThreadCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({
      ...request.payload, threadId, owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(SoftDeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ threadId, commentId, owner });

    return {
      status: 'success',
    };
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addReplyUseCase = await this._container.getInstance(AddReplyUseCase.name);

    const addedReply = await addReplyUseCase.execute({
      content: request.payload.content, threadId, commentId, owner,
    });

    const response = h.response({
      status: 'success',
      data: { addedReply },
    });

    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    const softDeleteReplyUseCase = this._container.getInstance(SoftDeleteReplyUseCase.name);

    await softDeleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      owner,
    });

    return { status: 'success' };
  }

  async likeOrDislikeCommentHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const likeUseCase = this._container.getInstance(LikeUseCase.name);

    await likeUseCase.execute({ threadId, commentId, owner });

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
