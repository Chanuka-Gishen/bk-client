import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

import { CurrencyInput } from 'src/components/currency-input/currency-input';

export const OpeningBalanceUpdate = ({ open, handleClose, formik, handleSubmit, isLoading }) => {
  const { touched, errors, getFieldProps } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Update Opening Balance</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="center">
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
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

OpeningBalanceUpdate.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
