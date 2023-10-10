const Reply = require('../../../Domains/replies/entities/Reply');

class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(payload) {
    const threadId = payload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(threadId);

    const commentIds = comments.map((it) => it.id);

    const reply = await this._repliesRepository.getRepliesByCommentId(commentIds);

    const commentsWithReplies = comments.map((it) => {
      const rawReplies = reply.filter((re) => re.commentId === it.id);
      const replies = rawReplies.map((re) => new Reply(re));

      return { ...it, replies };
    });

    return { ...thread, comments: commentsWithReplies };
  }
}

module.exports = GetThreadDetailsUseCase;
