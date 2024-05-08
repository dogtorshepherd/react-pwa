import { useLocation } from "react-router-dom";
import http from "../http-common";

const secret = "keykeykeykeykey"
// const path = "?login&post=http://192.168.3.1:1000/fgtauth&magic=06000584b997c9c0&usermac=58:6c:25:8c:ea:92&apmac=00:00:00:00:00:00&apip=192.168.3.1&userip=192.168.3.105&ssid=metsakuur&apname=FGT6HD3917801056&bssid=00:00:00:00:00:00&device_type=windows-pc"
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const magic = searchParams.get('magic');
const path = `?login&post=http://192.168.3.1:1000/fgtauth&magic=${magic}`

const registerFace = (employeeId: string, name: string, image: string): Promise<any> => {
  let formData = new FormData();

  formData.append("Secret", secret);
  formData.append("Id", employeeId);
  formData.append("Name", name);
  formData.append("Face", image.split(',')[1]);

  return http.post("/register", formData);
};

const deleteFace = (employeeId: string): Promise<any> => {
  let formData = new FormData();

  formData.append("Secret", secret);
  formData.append("Id", employeeId);

  return http.post("/delete", formData);
};

const detectFace = (image: string): Promise<any> => {
  let formData = new FormData();

  formData.append("Face", image.split(',')[1]);

  return http.post("/detect", formData);
};

const verifyFace = (employeeId: string, password: string, image: string): Promise<any> => {
  let formData = new FormData();

  if (password) {
    formData.append("Path", "http://172.16.0.102/sign-in-with-password" + path);
  } else {
    formData.append("Path", "http://172.16.0.102/sign-in" + path);
  }

  formData.append("Id", employeeId);
  formData.append("Password", password);
  formData.append("Face", image.split(',')[1]);

  return http.post("/verify", formData);
};

const loginFortinet = async (employeeId: string, password: string): Promise<any> => {
  const data = {
    magic: magic,
    username: employeeId,
    password: password
  };
  return http.post("https://192.168.3.1:1000/fgtauth", data);
};

const logoutFortinet = async (employeeId: string, password: string): Promise<any> => {
  const data = {
    magic: magic,
    username: employeeId,
    password: password
  };
  return http.post("https://192.168.3.1:1000/logout", data);
};

const FaceService = {
  registerFace,
  deleteFace,
  detectFace,
  verifyFace,
  loginFortinet,
  logoutFortinet,
};

export default FaceService;