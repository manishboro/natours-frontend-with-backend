class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; //storing the copy of req.copy object in query variable using destructuring
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj); //converting 'queryObj' into a string and storing it in 'queryStr'
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr)); //converting 'queryStr' string into a javascript object and sstoring the query in 'query' variable

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //splitting the query object by comma and adding a space instead of comma
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const selectBy = this.queryString.fields.split(',').join(' '); //splitting the query object by comma and adding a space instead of comma
      this.query = this.query.select(selectBy);
    } else {
      this.query = this.query.select('-__v'); //displaying all the fields except the '__v'
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; //converting a string to an integer
    const limit = this.queryString.limit * 1 || 100; //converting a string to an integer
    const skip = (page - 1) * limit; //formula derived from below explanation

    this.query = this.query.skip(skip).limit(limit); //page3 and limit=10 : page1 - 1 to 10, page2 - 11 to 20, page3 - 21 to 30 and so on

    return this;
  }
}

module.exports = APIFeatures;

//-- doing the above code without class --//

// // 1A) FILTERING , build query
// console.log(req.query);
// const queryObj = { ...req.query }; //storing the copy of req.copy object in query variable using destructuring
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(el => delete queryObj[el]);

// // 1B) ADVANCED FILTERING
// let queryStr = JSON.stringify(queryObj); //converting 'queryObj' into a string and storing it in 'queryStr'
// queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);
// let query = Tour.find(JSON.parse(queryStr)); //converting 'queryStr' string into a javascript object and sstoring the query in 'query' variable

// // 2) SORTING
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' '); //splitting the query object by comma and adding a space instead of comma
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

// // 3) FIELD LIMITING
// if (req.query.fields) {
//   const selectBy = req.query.fields.split(',').join(' '); //splitting the query object by comma and adding a space instead of comma
//   query = query.select(selectBy);
// } else {
//   query = query.select('-__v'); //displaying all the fields except the '__v'
// }

// // 4) PAGINATION
// const page = req.query.page * 1 || 1; //converting a string to an integer
// const limit = req.query.limit * 1 || 100; //converting a string to an integer
// const skip = (page - 1) * limit; //formula derived from below explanation

// query = query.skip(skip).limit(limit); //page3 and limit=10 : page1 - 1 to 10, page2 - 11 to 20, page3 - 21 to 30 and so on
// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('this page does not exist');
// }
