const asyncErrorWrapper = require("express-async-handler");

const {
  searchHelper,
  paginationHelper,
  userSortHelper,
} = require("./queryMiddlewareHelpers");

const userQueryMiddleware = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    let query = model.find({}, { __v: 0 });

    // Search
    query = searchHelper("name", query, req);

    // Sort
    query = userSortHelper(query);

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

module.exports = userQueryMiddleware;
