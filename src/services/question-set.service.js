const questionSetRepository = require('../repositories/question-set.repository');
const { forbidden, notFound, badRequest } = require('../errors/app-error');

// List question sets belonging to the logged-in host.
async function listQuestionSets(hostId) {
  return questionSetRepository.findAllByHost(hostId);
}

// Find a question set and check its ownership.
async function getQuestionSet(questionSetId, hostId) {
  const questionSet = await questionSetRepository.findById(questionSetId);

  if (!questionSet) {
    throw notFound(
      'QUESTION_SET_NOT_FOUND',
      'Question set not found.'
    );
  }

  if (Number(questionSet.hostId) !== Number(hostId)) {
    throw forbidden('You cannot access another host’s question set.');
  }

  return questionSet;
}

// Create a question set for the logged-in host.
async function createQuestionSet(data, hostId) {
  if (!data.title || !data.title.trim()) {
    throw badRequest('VALIDATION_ERROR', 'title is required.');
  }

  if (!data.subject || !data.subject.trim()) {
    throw badRequest('VALIDATION_ERROR', 'subject is required.');
  }

  return questionSetRepository.create({
    title: data.title.trim(),
    subject: data.subject.trim(),
    hostId,
  });
}

// Update a question set owned by the logged-in host.
async function updateQuestionSet(questionSetId, data, hostId) {
  const questionSet = await getQuestionSet(questionSetId, hostId);

  const changes = {};

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || !data.title.trim()) {
      throw badRequest('VALIDATION_ERROR', 'title must be a non-empty string.');
    }

    changes.title = data.title.trim();
  }

  if (data.subject !== undefined) {
    if (typeof data.subject !== 'string' || !data.subject.trim()) {
      throw badRequest('VALIDATION_ERROR', 'subject must be a non-empty string.');
    }

    changes.subject = data.subject.trim();
  }

  if (Object.keys(changes).length === 0) {
    throw badRequest(
      'VALIDATION_ERROR',
      'Provide at least one field to update: title or subject.'
    );
  }

  return questionSetRepository.update(questionSet, changes);
}

// Delete a question set owned by the logged-in host.
async function deleteQuestionSet(questionSetId, hostId) {
  const questionSet = await getQuestionSet(questionSetId, hostId);
  await questionSetRepository.remove(questionSet);
}

module.exports = {
  listQuestionSets,
  getQuestionSet,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
};