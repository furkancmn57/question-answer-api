const asyncErrorWrapper = require("express-async-handler");
const {
  searchHelper,
  populateHelper,
  questionSortHelper,
  paginationHelper,
} = require("./queryMiddlewareHelpers");

const questionQueryMiddleware = function (model, options) {
  return asyncErrorWrapper(async function(req, res, next) {
    let query = model.find({},{__v:0});

    // Search
    query = searchHelper("title", query, req);

    // Populate
    if (options && options.population) {
      query = populateHelper(query, options.population);
    }

    // Sort
    query = questionSortHelper(query, req);

    // Pagination

    const total = await model.countDocuments();

    const paginationResult = paginationHelper(total, query, req);

    query = paginationResult.query;
    pagination = paginationResult.pagination;

    const queryResults = await query;

    res.queryResults = {
      success: true,
      count: queryResults.length,
      pagination: pagination,
      data: queryResults,
    };

    next();
  });
};

module.exports = questionQueryMiddleware;
