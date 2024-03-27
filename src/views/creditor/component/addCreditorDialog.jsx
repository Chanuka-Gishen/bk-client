import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import { MobileNumberInput } from 'src/components/mobile-number-input/mobile-number-input';

export const AddCreditorDialog = ({
  isUpdate,
  open,
  handleClose,
  formik,
  handleSubmit,
  isLoading,
}) => {
  const { touched, errors, getFieldProps } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>{isUpdate ? 'Update' : 'Add'} Creditor</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Creditor Name*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('creditorName')}
                error={Boolean(touched.creditorName && errors.creditorName)}
                helperText={touched.creditorName && errors.creditorName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Town / City*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('creditorCity')}
                error={Boolean(touched.creditorCity && errors.creditorCity)}
                helperText={touched.creditorCity && errors.creditorCity}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MobileNumberInput
                name="creditorMobilePrimary"
                label="Mobile number (Primary)*"
                {...getFieldProps('creditorMobilePrimary')}
                error={Boolean(touched.creditorMobilePrimary && errors.creditorMobilePrimary)}
                helperText={touched.creditorMobilePrimary && errors.creditorMobilePrimary}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MobileNumberInput
                name="creditorMobileSecondary"
                label="Mobile number (Secondary)"
                {...getFieldProps('creditorMobileSecondary')}
                error={Boolean(touched.creditorMobileSecondary && errors.creditorMobileSecondary)}
                helperText={touched.creditorMobileSecondary && errors.creditorMobileSecondary}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Credit Period*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                type="number"
                InputProps={{
                  min: 0,
                  endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                }}
                {...getFieldProps('creditorCreditPeriod')}
                error={Boolean(touched.creditorCreditPeriod && errors.creditorCreditPeriod)}
                helperText={touched.creditorCreditPeriod && errors.creditorCreditPeriod}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Organization Name"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('creditorOrganization')}
              />
            </Grid>
          </Grid>
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(null)}>Cancel</Button>
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

AddCreditorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
