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
  TextField,
} from '@mui/material';
import { FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';

import { CurrencyInput } from 'src/components/currency-input/currency-input';

export const AddPaymentDialog = ({ open, handleClose, formik, handleSubmit, isLoading }) => {
  const { touched, errors, getFieldProps, values, setFieldValue } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Add Payment</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Description*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('paymentDescription')}
                error={Boolean(touched.paymentDescription && errors.paymentDescription)}
                helperText={touched.paymentDescription && errors.paymentDescription}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('paymentAmount')}
                error={Boolean(touched.paymentAmount && errors.paymentAmount)}
                helperText={touched.paymentAmount && errors.paymentAmount}
                InputProps={{
                  inputComponent: CurrencyInput,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Payment Date*"
                value={values.paymentDate}
                onChange={(date) => setFieldValue('paymentDate', date)}
              />
              {touched.paymentDate && errors.paymentDate && (
                <FormHelperText error>{errors.paymentDate}</FormHelperText>
              )}
            </Grid>
          </Grid>
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

AddPaymentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
