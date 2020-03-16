import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8501/api/v1/users/forgotPassword',
      data: {
        email
      }
    });
    // console.log('email', email);
    // console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Please check your email for the reset link!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm, params) => {
  try {
    console.log(params);
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:8501/api/v1/users${params}`,
      data: {
        password,
        passwordConfirm
      }
    });
    // console.log('email', email);
    console.log('resetpassword', res);
    if (res.data.status === 'success') {
      showAlert('success', 'Password changed successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  }
};
