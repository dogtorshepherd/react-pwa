import axios from "axios";
import https from 'https';

const axiosInstance = axios.create({
  baseURL: "https://172.16.0.102/api",
  headers: {
    "Content-type": "application/json",
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

export default axiosInstance;