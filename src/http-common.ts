import axios from "axios";

export default axios.create({
  // baseURL: "http://172.16.0.102:9000/api",
  baseURL: "https://8032-210-86-174-170.ngrok-free.app/api",
  headers: {
    "Content-type": "application/json",
  },
});