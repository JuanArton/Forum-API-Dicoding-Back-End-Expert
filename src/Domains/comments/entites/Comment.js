class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      username,
      date,
      content,
      likeCount,
      isDeleted,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.likeCount = likeCount;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload(
    {
      id,
      username,
      date,
      content,
      likeCount,
      isDeleted,
    },
  ) {
    if (!id || !username || !date || !content || typeof likeCount === 'undefined' || typeof isDeleted === 'undefined') {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || !(date instanceof Date)
        || typeof content !== 'string' || typeof likeCount !== 'number' || typeof isDeleted !== 'boolean') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
