const searchHelper = (searchKey, query, req) => {
  if (req.query.search) {
    const searchObject = {};

    const regex = new RegExp(req.query.search, "i");
    searchObject[searchKey] = regex;
    return query.where(searchObject);
  }
  return query;
};

const populateHelper = (query, population) => {
  if (population) {
    return query.populate(population);
  }
  return query;
};

const questionSortHelper = (query, req) => {
  const sortKey = req.query.sortBy;

  if (sortKey === "most-answered") {
    return query.sort("-answerCount");
  }
  if (sortKey === "most-liked") {
    return query.sort("-likeCount");
  }
  return query.sort("-createdAt");
};

const userSortHelper = (query) => {
  return query.sort("-createdAt");
};

const answerSortHelper = (answers) => {
  return answers.sort((a, b) => {
    if (b.likeCount === a.likeCount) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.likeCount - a.likeCount;
  });
};

const paginationHelper = (totalDocuments, query, req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagination = {};

  const total = totalDocuments;

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  return {
    query:
      query === undefined ? undefined : query.skip(startIndex).limit(limit),
    pagination: pagination,
    startIndex,
    limit,
  };
};

module.exports = {
  searchHelper,
  populateHelper,
  questionSortHelper,
  userSortHelper,
  paginationHelper,
  answerSortHelper,
};
