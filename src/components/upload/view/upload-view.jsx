import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  Paper,
  Typography,
  useTheme,
  colors,
  Stack,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  useMediaQuery,
  Container,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { CloseRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

//------------------------------------------------------

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const UploadView = ({
  getRootProps,
  getInputProps,
  selectedFiles,
  handleRemove,
  open,
  handleClose,
  handleSubmit,
  isLoading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            disabled={isLoading}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Close
          </Typography>
          <LoadingButton
            autoFocus
            color="inherit"
            variant="h6"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            <Typography variant="h6">
              Save {selectedFiles.length > 0 && `${selectedFiles.length} images`}
            </Typography>
          </LoadingButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth={'xl'} sx={{ mt: 4 }}>
        <Stack direction={'column'} spacing={2} alignItems={'center'}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              textAlign: 'center',
              width: isMobile ? '100%' : '50%',
            }}
          >
            <div
              className={{
                border: `1px dashed ${theme.palette.divider}`,
                padding: theme.spacing(6),
                outline: 'none',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: colors.grey[50],
                  opacity: 0.5,
                  cursor: 'pointer',
                },
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              <Stack direction={'column'} spacing={2} alignItems={'center'}>
                <CloudUploadIcon fontSize="large" />
                <Typography color="textSecondary" variant="body1">
                  Upload Images
                </Typography>
              </Stack>
            </div>
          </Paper>
          {selectedFiles.length > 0 && (
            <>
              <ImageList cols={isMobile ? 4 : 8} gap={2}>
                {selectedFiles.map((item, index) => (
                  <ImageListItem key={index}>
                    <img src={URL.createObjectURL(item.image)} alt={'images'} loading="lazy" />
                    <ImageListItemBar
                      position="top"
                      actionIcon={
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                          aria-label={`info about ${item.image.name}`}
                          onClick={() => handleRemove(index)}
                        >
                          <CloseRounded />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          )}
        </Stack>
      </Container>
    </Dialog>
  );
};

UploadView.propTypes = {
  getRootProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  selectedFiles: PropTypes.array.isRequired,
  handleRemove: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
