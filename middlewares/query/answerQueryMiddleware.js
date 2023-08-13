const asyncErrorWrapper = require("express-async-handler");

const {
  paginationHelper,
  populateHelper,
  answerSortHelper,
} = require("./queryMiddlewareHelpers");

const answerQueryMiddleware = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    const { questionId } = req.params;

    const arrayName = "answers";

    const total = (await model.findById(questionId))["answerCount"];

    // Pagination
    const paginationResult = paginationHelper(total, undefined, req);

    const startIndex = paginationResult.startIndex;

    const limit = paginationResult.limit;

    let queryObject = {};

    queryObject[arrayName] = { $slice: [startIndex, limit] };

    let query = model.find({ _id: questionId }, queryObject);

    // Populate
    query = populateHelper(query, options.population);

    const queryResults = await query;

    // Sort
    answerSortHelper(queryResults[0].answers);

    res.queryResults = {
      success: true,
      pagination: paginationResult.pagination,
      data: queryResults,
    };

    next();
  });
};

module.exports = answerQueryMiddleware;
