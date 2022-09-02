class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Make a shallow copy of req.query object
    const queryObject = Object.assign({}, this.queryString);
    //define which fileds in the req.query should be ignored
    const excludedFields = ["page", "sort", "limit", "fields"];
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
}

module.exports = APIFeatures;
