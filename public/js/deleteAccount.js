import axios from 'axios';
import { showAlert } from './alerts';

export const deleteAccount = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/verifyBeforeDelete',
      data: {
        email,
        password
      }
    });
    // console.log(res);

    if (res.data.status === 'success') {
      await axios({
        method: 'DELETE',
        url: '/api/v1/users/deleteMe'
      });
      showAlert('success', 'Account successfully deleted!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    window.setTimeout(() => {
      location.assign('/delete-account');
    }, 1500);
  }
};
