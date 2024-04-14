import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import { INVOICE_TYPES } from 'src/constants/invoiceTypeConstants';

export const CreateBookDialog = ({ open, handleClose, formik, handleSubmit, isLoading }) => {
  const { touched, errors, getFieldProps } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Create Sales Book</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Stack spacing={2} sx={{ mt: 1 }}>
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
            <FormControl>
              <InputLabel id="select-label">Book Invoice Type*</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                label="Invoice Type*"
                {...getFieldProps('bookType')}
              >
                <MenuItem value={INVOICE_TYPES.RANGE}>Range</MenuItem>
                <MenuItem value={INVOICE_TYPES.SINGLE}>Single</MenuItem>
              </Select>
              {Boolean(touched.bookType && errors.bookType) && (
                <FormHelperText error>{touched.bookType && errors.bookType}</FormHelperText>
              )}
            </FormControl>
          </Stack>
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
