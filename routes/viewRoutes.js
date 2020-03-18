const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/forgot-password', authController.isLoggedIn, viewsController.getPasswordForgotForm);
router.get('/reset-password/:resetToken', authController.isLoggedIn, viewsController.getPasswordResetForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get('/manage-tours', authController.protect, viewsController.displayError);
router.get('/manage-users', authController.protect, viewsController.displayError);
router.get('/manage-reviews', authController.protect, viewsController.displayError);
router.get('/manage-bookings', authController.protect, viewsController.displayError);
router.get('/my-reviews', authController.protect, viewsController.displayError);
router.get('/billing', authController.protect, viewsController.displayError);

module.exports = router;
