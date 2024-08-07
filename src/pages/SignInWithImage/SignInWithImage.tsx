import Loading from '@/components/Loading';
import FaceService from '@/services/FaceService';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';

export default function SignInWithImage() {
  // const camera = useRef<CameraType>(null);
  // const [image, setImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isButtonDisabled = !(employeeId && password);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    setResponseMessage(null);
    setEmployeeId('');
    setPassword('');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setSelectedImage(selectedFile);

      // Create a data URL for image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(true);
    if (employeeId && password && imagePreview) {
      const href = window.location.href;
      const urlObj = new URL(href);
      const magic = urlObj.searchParams.get("magic") ?? "";
      const path = href.substring(href.indexOf('?'));
      FaceService.detectFace(imagePreview)
        .then(async (response) => {
          if (response.data.Code !== 0) {
            setResponseMessage('เกิดข้อผิดพลาด\n' + response.data.Message);
            await new Promise(resolve => setTimeout(resolve, 10000));
            window.location.reload();
          } else {
            FaceService.verifyFace(employeeId, password, imagePreview, path)
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
                        window.location.href = "https://192.168.3.1/keepalive?";
                      } else {
                        window.open("https://192.168.3.1/keepalive?", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=800,height=600");
                        window.location.href = "https://www.google.com/";
                      }
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
          Sign In With Password
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
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