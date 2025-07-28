// src/services/api.js
import axios from 'axios';

export  const api = axios.create({
  baseURL: 'http://localhost:5000',
});
export  const omdb = axios.create({
  baseURL:'http://www.omdbapi.com/?apikey=77e30a1d&'
})
// export const setAuthToken = (token) => {
//   if (token) {
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common['Authorization'];
//   }
// };

export default {api, omdb}
