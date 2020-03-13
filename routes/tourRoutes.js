const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router(); //creating our own router

router.route('/top-5-best').get(tourController.alias, tourController.getAllTours); //tourController.alias is middleware

router //efficient method
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.addTour);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
// /tours-within?distance=233&center=34.063846, -118.269071,&unit=mi
// /tours-within/233/center/34.063846, -118.269071/unit/mi

router //efficient method
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

//NESTED ROUTE to create a review
// router
//   .route('/:tourId/reviews')
//   .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
