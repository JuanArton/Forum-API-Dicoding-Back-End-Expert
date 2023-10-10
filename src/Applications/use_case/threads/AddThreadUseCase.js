const AddThread = require('../../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const thread = new AddThread(payload);

    return this._threadRepository.addThread(thread);
  }
}

module.exports = AddThreadUseCase;
