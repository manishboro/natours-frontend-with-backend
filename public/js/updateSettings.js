import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:8501/api/v1/users/updateMyPassword'
        : 'http://localhost:8501/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    // if (err.response.data.message === 'Your current password is wrong!') {
    //   return showAlert('error', err.response.data.message);
    // }
    showAlert('error', err.response.data.message.split(':')[2]);
  }
};
