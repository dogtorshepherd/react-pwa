import axios from "axios";

export default axios.create({
  baseURL: "http://172.16.0.102:9000/api",
  headers: {
    "Content-type": "application/json",
  },
});