import http from "../http-common";

const secret = "keykeykeykeykey"
const path = "http://172.16.0.102:5173/sign-in?login&post=http://192.168.3.1:1000/fgtauth&magic=06000584b997c9c0&usermac=58:6c:25:8c:ea:92&apmac=00:00:00:00:00:00&apip=192.168.3.1&userip=192.168.3.105&ssid=metsakuur&apname=FGT6HD3917801056&bssid=00:00:00:00:00:00&device_type=windows-pc"

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

const verifyFace = (employeeId: string, image: string): Promise<any> => {
  let formData = new FormData();

  formData.append("Path", path);
  formData.append("Id", employeeId);
  formData.append("Face", image.split(',')[1]);

  return http.post("/verify", formData);
};

const FaceService = {
  registerFace,
  deleteFace,
  detectFace,
  verifyFace,
};

export default FaceService;