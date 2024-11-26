import axios from 'axios';


axios.defaults.withCredentials = true;



// axios.defaults.baseURL = 'http://localhost:8000/api/v1/users';

// Update baseURL to the deployed backend URL
axios.defaults.baseURL = 'https://cineverse-fnr5.onrender.com/api/v1/users';

export default axios;
