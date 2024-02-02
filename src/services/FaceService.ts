import http from "../http-common";

const secret = "keykeykeykeykey"
const path = "https://192.168.1.204/guest/fortigate_cp.php?login&post=http://172.16.2.1:1000/fgtauth&magic=030d0d90d699c5a8&usermac=74:da:38:9f:cb:93&apmac=70:4c:a5:5e:3f:24&apip=172.16.2.1&userip=172.16.2.10&ssid=Captive%20portal&apname=FGT51E3U17001115&bssid=00:00:00:00:00:00&_browser=1"

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