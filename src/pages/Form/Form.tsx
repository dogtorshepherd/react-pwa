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
      const form = document.createElement('form');
      form.method = 'post';
      form.action = 'https://192.168.31.1:1000/fgtauth';

      const nameField = document.createElement('input');
      nameField.type = 'hidden';
      nameField.name = 'username';
      nameField.value = employeeId;

      const passwordField = document.createElement('input');
      passwordField.type = 'hidden';
      passwordField.name = 'password';
      passwordField.value = password;

      const magicField = document.createElement('input');
      magicField.type = 'hidden';
      magicField.name = 'magic';
      magicField.value = magic;

      const submitField = document.createElement('input');
      submitField.type = 'hidden';
      submitField.name = 'Submit';
      submitField.value = 'Login';

      form.appendChild(nameField);
      form.appendChild(passwordField);
      form.appendChild(magicField);
      form.appendChild(submitField);

      document.body.appendChild(form);
      form.submit();
      // FaceService.loginFortinetWithPassword(magic, employeeId, password)
      //   .then(async (loginResponse) => {
      //     if (loginResponse) {
      //       setResponseMessage('ยืนยันตัวตนสำเร็จ');
      //       await new Promise(resolve => setTimeout(resolve, 3000));

      //       // Create and submit a hidden form programmatically
      //       const form = document.createElement('form');
      //       form.method = 'post';
      //       form.action = 'https://192.168.31.1:1000/keepalive?';

      //       const nameField = document.createElement('input');
      //       nameField.type = 'hidden';
      //       nameField.name = 'username';
      //       nameField.value = employeeId;

      //       const passwordField = document.createElement('input');
      //       passwordField.type = 'hidden';
      //       passwordField.name = 'password';
      //       passwordField.value = password;

      //       const magicField = document.createElement('input');
      //       magicField.type = 'hidden';
      //       magicField.name = 'magic';
      //       magicField.value = magic;

      //       const submitField = document.createElement('input');
      //       submitField.type = 'hidden';
      //       submitField.name = 'Submit';
      //       submitField.value = 'Login';

      //       form.appendChild(nameField);
      //       form.appendChild(passwordField);
      //       form.appendChild(magicField);
      //       form.appendChild(submitField);

      //       document.body.appendChild(form);
      //       form.submit();
      //     } else {
      //       console.log('fgtauth : FAIL');
      //       setResponseMessage('เกิดข้อผิดพลาด\n' + loginResponse.data.Message);
      //     }
      //   })
      //   .catch(async () => {
      //     console.log('Login Fortinet : FAIL');
      //     setResponseMessage('เกิดข้อผิดพลาด');
      //   });
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
        <Link to={"https://192.168.31.1:1000/logout?"} style={{ textAlign: 'center' }}>
          Logout
        </Link>
      </div>
    </form>
  );
};

export default Form;
