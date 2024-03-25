import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

export const CreateBookDialog = ({ open, handleClose, formik, handleSubmit, isLoading }) => {
  const { touched, errors, getFieldProps } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Create Sales Book</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <TextField
            label="Sales Book Name*"
            fullWidth
            autoComplete="off"
            variant="outlined"
            {...getFieldProps('bookName')}
            error={Boolean(touched.bookName && errors.bookName)}
            helperText={touched.bookName && errors.bookName}
            sx={{ mt: 2 }}
          />
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          color="inherit"
          disabled={isLoading}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

CreateBookDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
