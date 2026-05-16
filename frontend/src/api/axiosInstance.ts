import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 10000,
    headers: {
    'Content-Type': 'application/json',
  },
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // server wylaczony
      toast.error('Błąd sieci: Serwer nie odpowiada.');
    }
    return Promise.reject(error);
  }
);