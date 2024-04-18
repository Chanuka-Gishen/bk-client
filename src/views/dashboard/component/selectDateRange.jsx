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
} from '@mui/material';
import { FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

import { DatePicker } from '@mui/x-date-pickers';

export const SelectDateRange = ({ open, handleClose, formik, handleSubmit, isLoading }) => {
  const { touched, errors, values, setFieldValue } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Select Date Range</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="From*"
                value={values.dateFrom}
                onChange={(date) => setFieldValue('dateFrom', date)}
              />
              {touched.dateFrom && errors.dateFrom && (
                <FormHelperText error>{errors.dateFrom}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="To*"
                value={values.dateTo}
                onChange={(date) => setFieldValue('dateTo', date)}
              />
              {touched.dateTo && errors.dateTo && (
                <FormHelperText error>{errors.dateTo}</FormHelperText>
              )}
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
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

SelectDateRange.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
