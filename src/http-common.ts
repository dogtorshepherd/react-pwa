import axios from "axios";

export default axios.create({
  baseURL: "https://172.16.0.102/api",
  headers: {
    "Content-type": "application/json",
  },
});