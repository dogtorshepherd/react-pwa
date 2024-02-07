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

export default function SignIn() {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isButtonDisabled = !(employeeId);

  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setResponseMessage(null);
    setEmployeeId('');
  };

  useEffect(() => {
    if (employeeId && image) {
      FaceService.detectFace(image)
        .then(() => {
          FaceService.verifyFace(employeeId, "", image)
            .then((response) => {
              // setResponseMessage('Request successful! Response: ' + response.data);
              setResponseMessage('Succeed');
            })
            .catch((error) => {
              // setResponseMessage('Error: ' + error.message);
              setResponseMessage('Fail');
            });
        })
        .catch((error) => {
          // setResponseMessage('Error: ' + error.message);
          setResponseMessage('Fail');
        });
    }
  },[image]);

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
        </Box>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          // onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Metsakuur"}
          </DialogTitle>
          {responseMessage ?
            <>
              <DialogContent>
                <DialogContentText>
                  {responseMessage}
                </DialogContentText>
              </DialogContent><DialogActions>
                <Button onClick={handleClose} autoFocus>
                  OK
                </Button>
              </DialogActions>
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