const answerService = require('../services/answer.service');

async function submitAnswer(req, res, next) {
  try {
    const result = await answerService.submitAnswer(
      req.params.code,
      req.user.user_id,
      req.body.question_id,
      req.body.choice_id
    );

    return res.status(201).json({
      message: 'Answer submitted successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitAnswer,
};