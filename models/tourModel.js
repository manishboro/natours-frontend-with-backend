const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('../models/userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    // creating the schema or structure
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //to display an error message if the name of the tour is not specified
      unique: true,
      trim: true,
      minlength: [10, 'A name must be greater or equal to 10 characters'],
      maxlength: [40, 'A name must be less or equal to 40 characters']
      // validate: [validator.isAlpha, 'A tour must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'minimum rating must be 0'],
      max: [5, 'maximum rating must be 5'],
      set: val => Math.round(val * 10) / 10 //Math.round rounds a value to an integer so val is multiplied by 10 and divided by 10 to get the correct rounded value
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        //this only works on CREATE and SAVE!!
        validator: function(val) {
          return val < this.price; //checks if price discount is less than price and returns true if it satisfies
        },
        message: 'price discount must be less than price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    // guide: Array
    //CHILD REFERENCING
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1 }); // 1 = sorting in ascending order and -1 = sorting in descending order
tourSchema.index({ price: 1, ratingsAverage: -1 }); //compound index
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); //2dsphere is geospatial index

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7; //a normal function is used because 'this' keyword is not available in arrow function
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true }); //this points to current document
  next();
});

//EMBEDDING DOCUMENTS
// tourSchema.pre('save', async function(next) {
//   const guidePromises = this.guide.map(async id => await User.findById(id));
//   this.guide = await Promise.all(guidePromises);
//   next();
// });

// tourSchema.pre('save', function(next) { //WE CAN USE MULTIPLE MIDDLEWARES
//   console.log('will save document');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE |  /^find/ -> regular expression
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } }); //'this' points to current query
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

//VIRTUAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //adding $match at the beginning
//   // console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema); //creating the model

module.exports = Tour;
