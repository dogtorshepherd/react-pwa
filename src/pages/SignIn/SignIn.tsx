import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Camera, CameraType } from '@/components/Camera';
import { useEffect, useRef, useState } from 'react';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FaceService from '@/services/FaceService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { DialogProps } from "@mui/material";
import axios from 'axios';
import Loading from '@/components/Loading';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const camera = useRef<CameraType>(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isButtonDisabled = !(employeeId);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setResponseMessage(null);
    setEmployeeId('');
    // navigate('/welcome');
  };

  useEffect(() => {
    if (employeeId && image) {
<<<<<<< HEAD
      FaceService.detectFace(image)
        .then(() => {
          FaceService.verifyFace(employeeId, "", image)
            .then(async (response) => {
              if (response.status == 200) {
                setResponseMessage('ยืนยันตัวตนสำเร็จ');
                const username = response.data.Id;
                const url = "http://192.168.3.1:1000";
                const password = response.data.Password;
                try {
                  const location = useLocation();
                  const searchParams = new URLSearchParams(location.search);
                  const magic = searchParams.get('magic');
                  const data = {
                    magic: magic,
                    username: username,
                    password: password
                  };
                  const response = await fetch(url, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                  });
              
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
              
                  const responseData = await response.json();
                  // Do something with the response data
                  console.log(responseData);
                } catch (error) {
                  // Handle errors
                  console.error("Fortinet Error:", error);
                }
              } else {
                setResponseMessage('เกิดข้อผิดพลาด');
              }
            })
            .catch((error) => {
              // if (error.response) {
              //   // The request was made and the server responded with a status code
              //   // that falls out of the range of 2xx
              //   console.log(error.response.data);
              //   console.log(error.response.status);
              //   console.log(error.response.headers);
              // } else if (error.request) {
              //   // The request was made but no response was received
              //   // `error.request` is an instance of XMLHttpRequest in the browser 
              //   // and an instance of http.ClientRequest in node.js
              //   console.log(error.request);
              // } else {
              //   // Something happened in setting up the request that triggered an Error
              //   console.log('Error', error.message);
              // }
              // setResponseMessage('Error: ' + error.message);
              setResponseMessage('เกิดข้อผิดพลาด');
            });
        })
        .catch((error) => {
          // if (error.response) {
          //   // The request was made and the server responded with a status code
          //   // that falls out of the range of 2xx
          //   console.log(error.response.data);
          //   console.log(error.response.status);
          //   console.log(error.response.headers);
          // } else if (error.request) {
          //   // The request was made but no response was received
          //   // `error.request` is an instance of XMLHttpRequest in the browser 
          //   // and an instance of http.ClientRequest in node.js
          //   console.log(error.request);
          // } else {
          //   // Something happened in setting up the request that triggered an Error
          //   console.log('Error', error.message);
          // }
          // setResponseMessage('Error: ' + error.message);
          setResponseMessage('เกิดข้อผิดพลาด');
        });
=======
      const href = window.location.href;
      const urlObj = new URL(href);
      const magic = urlObj.searchParams.get("magic") ?? "";
      const path = href.substring(href.indexOf('?'));
      if (employeeId == '99') {
        window.open("https://192.168.3.1:1003/keepalive?", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=800,height=600");
        window.location.href = "https://www.google.com/";
      } else {
        FaceService.detectFace(image)
          .then(async (response) => {
            if (response.data.Code !== 0) {
              setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
              await new Promise(resolve => setTimeout(resolve, 10000));
              window.location.reload();
            } else {
              FaceService.verifyFace(employeeId, "", image, path)
                .then(async (response) => {
                  if (response.status == 200) {
                    const username = response.data.Id;
                    const password = response.data.Password;
                    FaceService.loginFortinet(magic, username, password).then((async (response) => {
                      if (response) {
                        setResponseMessage('ยืนยันตัวตนสำเร็จ');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        window.open("https://192.168.3.1:1003/keepalive?", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=800,height=600");
                        window.location.href = "https://www.google.com/";
                      } else {
                        setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        window.location.reload();
                      }
                    }))
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
>>>>>>> from_no_internet
    }
  }, [image]);

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const selectedFile = event.target.files[0];
  //     setSelectedImage(selectedFile);

  //     // Create a data URL for image preview
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImagePreview(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(selectedFile);
  //   }
  // };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateImageState();
    setOpen(true);
  };

  const updateImageState = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo)
    }
  };

  const href = window.location.href;
  const urlObj = new URL(href);
  const magic = urlObj.searchParams.get("magic") ?? "";
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
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Selected Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: 20 }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose Image
                  </Button>
                </label>
              </Box> */}
              <Box
                sx={{
                  maxWidth: 200,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}>
                <Camera
                  ref={camera}
                  numberOfCamerasCallback={setNumberOfCameras}
                  aspectRatio={3 / 4}
                  errorMessages={{
                    noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                    switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
                    canvas: 'Canvas is not supported.',
                  }} />
                {/* <button
                  style={{
                    backgroundColor: 'blue',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    alignItems: 'center'
                  }}
                  hidden={numberOfCameras <= 1}
                  onClick={() => {
                    if (camera.current != null) {
                      camera.current.switchCamera();
                      setOpen(false);
                    }
                  }}
                >
                  Switch Camera
                </button> */}
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
          </Grid>
          <Button
            disabled={isButtonDisabled}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={"/sign-in-with-password" + path} style={{ textAlign: 'center' }}>
              Sign In with Password
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={"/sign-up" + path} style={{ textAlign: 'center' }}>
              Sign Up
            </Link>
          </div>
        </Box>
        <Dialog
          // fullScreen={fullScreen}
          open={open}
          // onClose={handleClose}
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
                // minWidth: 200,
                minHeight: 100,
              }}
            >
              <Loading />
            </Box>}
        </Dialog>
      </Box>
    </Container >
  );
}