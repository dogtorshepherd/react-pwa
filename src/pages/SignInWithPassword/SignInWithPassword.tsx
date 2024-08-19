import { Camera, CameraType } from '@/components/Camera';
import Loading from '@/components/Loading';
import FaceService from '@/services/FaceService';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

export default function SignInWithPassword() {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isButtonDisabled = !(employeeId && password);

  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setResponseMessage(null);
    setEmployeeId('');
    setPassword('');
  };

  useEffect(() => {
    if (employeeId && password && image) {
      const href = window.location.href;
      const urlObj = new URL(href);
      const magic = urlObj.searchParams.get("magic") ?? "";

      FaceService.detectFace(image)
        .then(async (response) => {
          if (response.data.Code !== 0) {
            setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
            await new Promise(resolve => setTimeout(resolve, 10000));
            window.location.reload();
          } else {
            FaceService.verifyFace(employeeId, password, image, href)
              .then(async (response) => {
                if (response.status === 200) {
                  const username = response.data.Id;
                  const password = response.data.Password;
                  const form = document.createElement('form');
                  form.method = 'post';
                  form.action = 'https://192.168.31.1:1000/fgtauth';

                  const usernameField = document.createElement('input');
                  usernameField.type = 'hidden';
                  usernameField.name = 'username';
                  usernameField.value = username;

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

                  form.appendChild(usernameField);
                  form.appendChild(passwordField);
                  form.appendChild(magicField);
                  form.appendChild(submitField);

                  document.body.appendChild(form);
                  form.submit();
                  // FaceService.loginFortinetWithPassword(magic, username, password).then(async (response) => {
                  //   if (response) {
                  //     setResponseMessage('ยืนยันตัวตนสำเร็จ');
                  //     await new Promise(resolve => setTimeout(resolve, 5000));

                  //     // Create and submit a hidden form programmatically
                  //     const form = document.createElement('form');
                  //     form.method = 'post';
                  //     form.action = 'https://192.168.31.1:1000/keepalive?';

                  //     const usernameField = document.createElement('input');
                  //     usernameField.type = 'hidden';
                  //     usernameField.name = 'username';
                  //     usernameField.value = username;

                  //     const passwordField = document.createElement('input');
                  //     passwordField.type = 'hidden';
                  //     passwordField.name = 'password';
                  //     passwordField.value = password;

                  //     const magicField = document.createElement('input');
                  //     magicField.type = 'hidden';
                  //     magicField.name = 'magic';
                  //     magicField.value = magic;

                  //     const submitField = document.createElement('input');
                  //     submitField.type = 'hidden';
                  //     submitField.name = 'Submit';
                  //     submitField.value = 'Login';

                  //     form.appendChild(usernameField);
                  //     form.appendChild(passwordField);
                  //     form.appendChild(magicField);
                  //     form.appendChild(submitField);

                  //     document.body.appendChild(form);
                  //     form.submit();
                  //   } else {
                  //     console.log('fgtauth : FAIL');
                  //     setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
                  //   }
                  // }).catch(async () => {
                  //   console.log('Login Fortinet : FAIL');
                  //   setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
                  // });
                }
              })
              .catch(async (error) => {
                setResponseMessage('เกิดข้อผิดพลาด\n' + error.response.data.Message);
                await new Promise(resolve => setTimeout(resolve, 10000));
                window.location.reload();
              });
          }
        })
        .catch(async (error) => {
          setResponseMessage('เกิดข้อผิดพลาด\n' + error.response.data.Message);
          await new Promise(resolve => setTimeout(resolve, 10000));
          window.location.reload();
        });
    }
  }, [image]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateImageState();
    setOpen(true);
  };

  const updateImageState = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
    }
  };

  const href = window.location.href;
  const path = href.substring(href.indexOf('?'));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In With Password
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  maxWidth: 200,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}>
                <Camera
                  ref={camera}
                  aspectRatio={3 / 4}
                  errorMessages={{
                    noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                    switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
                    canvas: 'Canvas is not supported.',
                  }} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="employeeId"
                label="Employee ID"
                name="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            disabled={isButtonDisabled}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In With Password
          </Button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={"/sign-in" + path} style={{ textAlign: 'center' }}>
              Sign In
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={"/sign-up" + path} style={{ textAlign: 'center' }}>
              Sign Up
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={"https://192.168.31.1:1000/logout?"} style={{ textAlign: 'center' }}>
              Logout
            </Link>
          </div>
        </Box>
        <Dialog
          open={open}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Prime Solution and Services"}
          </DialogTitle>
          {responseMessage ?
            <>
              <DialogContent>
                <DialogContentText>
                  {responseMessage}
                </DialogContentText>
              </DialogContent>
            </> :
            <Box
              sx={{
                minHeight: 100,
              }}
            >
              <Loading />
            </Box>}
        </Dialog>
      </Box>
    </Container>
  );
}
