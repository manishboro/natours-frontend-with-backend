import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { forgotPassword, resetPassword } from './forgotPassword';
import { bookTour } from './stripe';
import { deleteAccount } from './deleteAccount';

//DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const deleteAccountForm = document.querySelector('.form--deleteAccount');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour-0');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const resetPasswordForm = document.querySelector('.form--resetPassword');

if (deleteAccountForm)
  deleteAccountForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btnVerify').textContent = 'deleting...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await deleteAccount(email, password);
    document.querySelector('.btnVerify').textContent = 'delete';
  });

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.signup-btn').textContent = 'Signing up...';
    const name = document.getElementById('name-signup').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const passwordConfirm = document.getElementById('passwordConfirm-signup').value;
    await signup(name, email, password, passwordConfirm);
    document.querySelector('.signup-btn').textContent = 'Sign up';
  });

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--saveSettings').textContent = 'Saving settings...';
    const form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');
    document.querySelector('.btn--saveSettings').textContent = 'Save settings';
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--savePassword').textContent = 'saving...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password'); //'updateSettings' function returns a promise

    document.querySelector('.btn--savePassword').textContent = 'save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--forgotPassword').textContent = 'sending...';
    const email = document.getElementById('email-forgotPassword').value;
    await forgotPassword(email);
    document.querySelector('.btn--forgotPassword').textContent = 'send';
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const params = window.location.pathname;
    document.querySelector('.btn--resetPassword').textContent = 'Changing password...';
    const password = document.getElementById('password-resetPassword').value;
    const passwordConfirm = document.getElementById('passwordConfirm-resetPassword').value;
    await resetPassword(password, passwordConfirm, params);
    document.querySelector('.btn--resetPassword').textContent = 'Changing password';
  });
}
