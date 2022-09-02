class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Make a shallow copy of req.query object
    const queryObject = Object.assign({}, this.queryString);
    //define which fileds in the req.query should be ignored
    const excludedFields = ["page", "sort", "limit", "fields", "limitResults"];
    //delete the property from the queryObject if it has item from the excludedField
    excludedFields.forEach((el) => delete queryObject[el]);

    //mongo: { difficulty: 'easy', duration: {$gte: 5}}
    //req.query: { difficulty: { gte: 'easy' }}

    //filter gte, gt, lte, lt and add $ sign to query in the mongo
    let queryString = JSON.stringify(queryObject); //covert queryObj to String
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    //return the entire filter object inorder to be chained
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const reqQuery = this.queryString;
      this.query = this.query.select(reqQuery.fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  /**
   * Pagination
    page=2&limit=10 page 2 with 10 results per page
    page 1: 1-10, page 2: 11-20, page 3: 21-30
    default page
   * @returns paginate object
   */
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  //TODO
  limitResults() {
    const reqQuery = this.queryString;
    this.query = this.query.limit(Number(reqQuery.limitResults) || 5);

    return this;
  }
}

module.exports = APIFeatures;
