const express = require('express');
const router = express.Router(); //creating our own router
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

//PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.post('/verifyBeforeDelete', userController.verifyBeforeDelete);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

//ONLY ADMIN CAN PERFORM ALL THE BELOW ACTIONS
router.use(authController.restrictTo('admin'));
router //efficient method
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
