import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CloseCircleFilled } from '@ant-design/icons';

export const AddInvoicesFileDialog = ({
  open,
  file,
  setFile,
  handleClose,
  handleSubmit,
  isLoading,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Add File</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={12}>
            <input
              accept=".xlsx"
              style={{ display: 'none' }}
              id="excel-upload-input"
              type="file"
              disabled={file}
              onChange={(event) => setFile(event.target.files[0])}
            />
            <label htmlFor="excel-upload-input">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Upload File
              </Button>
            </label>
          </Grid>
          {file && (
            <Grid item xs={12} sm={12}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body1">
                  {file
                    ? `Selected file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
                    : 'No file selected'}
                </Typography>
                <IconButton onClick={() => setFile(null)}>
                  <CloseCircleFilled />
                </IconButton>
              </Stack>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          color="inherit"
          disabled={!file || isLoading}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

AddInvoicesFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
