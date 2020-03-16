const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res) => {
  //1) Get tour data from collection
  const tours = await Tour.find();

  //2) Build template
  //3) Render that template using tour data from (1)
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  //2) Build template
  //3) Render template using data from (1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create an account'
  });
};

exports.getPasswordForgotForm = (req, res) => {
  res.status(200).render('forgot-password-form', {
    title: 'Reset your password'
  });
};

exports.getPasswordResetForm = (req, res) => {
  res.status(200).render('password-reset-form', {
    title: 'Reset your password'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2) Find tours with the returned ids
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } }); //it means all finding all tours whose id is in the tourIds array
  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};
