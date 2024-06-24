import axios from 'axios';
import https from 'https';
import http from "../http-common";

const axiosInstance = axios.create({
  baseURL: 'https://192.168.3.1:1003',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    // Add other headers here
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const instance = axios.create({
  baseURL: 'http://ip.jsontest.com',
  timeout: 10000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const secret = "keykeykeykeykey"

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

const verifyFace = (employeeId: string, password: string, image: string, path: string): Promise<any> => {
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

// const loginFortinet = async (magic: string, username: string, password: string): Promise<any> => {
//   let formData = new FormData();
//   formData.append("magic", magic);
//   formData.append("username", username);
//   formData.append("password", password);
//   return http.post("https://192.168.3.1:1003/fgtauth", formData);
// };

const loginFortinet = async (magic: string, username: string, password: string): Promise<any> => {
  try {
    const fortiResult = await axios.post(
      'https://192.168.3.1:1003/fgtauth',
      new URLSearchParams({
        magic: magic,
        username: username,
        password: password,
      })
    );
    console.log('fortiResult:', fortiResult)
  } catch (fortiError) {
    console.error('fortiError:', fortiError);
  }

  const result = await fetchWithRetry("/");
  return result

};

const fetchWithRetry = async (url: string, retries = 3, delayMs = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await instance.get(url);
      return true;
      // if (response.status == 200) {
      //   return true;
      // }
    } catch (error) {
      if (i === retries - 1) {
        return false;
      }
    }
  }
};

const logoutFortinet = (): Promise<any> => {
  return http.get("https://192.168.3.1:1003/logout?");
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