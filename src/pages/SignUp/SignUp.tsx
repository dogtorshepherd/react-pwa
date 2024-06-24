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

export default function SignUp() {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isButtonDisabled = !(employeeId && name);

  const href = window.location.href;
  const urlObj = new URL(href);
  const magic = urlObj.searchParams.get("magic") ?? "";
  const path = href.substring(href.indexOf('?'));

  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setResponseMessage(null);
    setEmployeeId('');
    setName('');
  };

  useEffect(() => {
    if (employeeId && name && image) {
      FaceService.detectFace(image)
        .then(async (response) => {
          if (response.data.Code !== 0) {
            setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
            await new Promise(resolve => setTimeout(resolve, 10000));
            window.location.reload();
          } else {
            FaceService.registerFace(employeeId, name, image)
              .then(async (response) => {
                if (response.data.Code != 0) {
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
                            if (isMobile) {
                              window.open("https://www.google.com/", "_blank");
                              window.location.href = "https://192.168.3.1:1003/keepalive?";
                            } else {
                              window.open("https://192.168.3.1:1003/keepalive?", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=800,height=600");
                              window.location.href = "https://www.google.com/";
                            }
                          } else {
                            setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
                            await new Promise(resolve => setTimeout(resolve, 10000));
                            window.location.reload();
                          }
                        }))
                      } else {
                        setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        window.location.reload();
                      }
                    })
                    .catch(async (error) => {
                      setResponseMessage('เกิดข้อผิดพลาด\n' + error.response.data.Message);
                      await new Promise(resolve => setTimeout(resolve, 10000));
                      window.location.reload();
                    });
                  setResponseMessage('ลงทะเบียนใบหน้าสำเร็จ');
                  await new Promise(resolve => setTimeout(resolve, 3000));
                  if (isMobile) {
                    window.open("https://www.google.com/", "_blank");
                    window.location.href = "https://192.168.3.1:1003/keepalive?";
                  } else {
                    window.open("https://192.168.3.1:1003/keepalive?", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=800,height=600");
                    window.location.href = "https://www.google.com/";
                  }
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
          Sign up
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
                id="name"
                label="Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            Sign Up
          </Button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={"/sign-in" + path} style={{ textAlign: 'center' }}>
              Sign In
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={"/sign-in-with-password" + path} style={{ textAlign: 'center' }}>
              Sign In with Password
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
              {/* <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  OK
                </Button>
              </DialogActions> */}
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