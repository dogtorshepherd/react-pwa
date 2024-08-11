import React, { useState } from 'react';
import './Form.css';
import FaceService from '@/services/FaceService';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

interface FormValues {
  employeeId: string;
  password: string;
  image: File | null;
}

const Form: React.FC = () => {
  const [values, setValues] = useState<FormValues>({ employeeId: '', password: '', image: null });
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setValues({ ...values, image: files[0] });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { employeeId, password } = values;
    if (employeeId && password) {
      const href = window.location.href;
      const urlObj = new URL(href);
      const magic = urlObj.searchParams.get("magic") ?? "";
      FaceService.loginFortinetWithPassword(magic, employeeId, password)
        .then(async (loginResponse) => {
          if (loginResponse) {
            setResponseMessage('ยืนยันตัวตนสำเร็จ');
            await new Promise(resolve => setTimeout(resolve, 3000));
            if (isMobile) {
              window.open("https://www.google.com/", "_blank");
              window.location.href = "https://192.168.31.1:1003/keepalive?";
            } else {
              window.open("https://192.168.31.1:1003/keepalive?", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=800,height=600");
              window.location.href = "https://www.google.com/";
            }
          } else {
            console.log('fgtauth : FAIL');
            setResponseMessage('เกิดข้อผิดพลาด\n' + loginResponse.data.Message);
          }
        })
        .catch(async () => {
          console.log('Login Fortinet : FAIL');
          setResponseMessage('เกิดข้อผิดพลาด');
        });
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="employeeId">Employee ID:</label>
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={values.employeeId}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          required
        />
      </div>
      {/* <div className="form-group">
        <label htmlFor="image">Upload Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
        />
      </div> */}
      <div className="form-group">
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Processing...' : 'Submit'}
        </button>
      </div>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to={"https://192.168.31.1:1003/logout?"} style={{ textAlign: 'center' }}>
          Logout
        </Link>
      </div>
    </form>
  );
};

export default Form;
