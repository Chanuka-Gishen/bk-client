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

import { CurrencyInput } from 'src/components/currency-input/currency-input';
import { DatePicker } from '@mui/x-date-pickers';

export const OpeningBalanceAdd = ({ open, handleClose, formik, handleSubmit, isLoading }) => {
  const { touched, errors, values, getFieldProps, setFieldValue } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Add Opening Balance</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date*"
                value={values.cashBalanceDate}
                maxDate={new Date()}
                onChange={(date) => setFieldValue('cashBalanceDate', date)}
              />
              {touched.cashBalanceDate && errors.cashBalanceDate && (
                <FormHelperText error>{errors.cashBalanceDate}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Opening Balance*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('openingBalance')}
                error={Boolean(touched.openingBalance && errors.openingBalance)}
                helperText={touched.openingBalance && errors.openingBalance}
                InputProps={{
                  inputComponent: CurrencyInput,
                }}
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

OpeningBalanceAdd.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
