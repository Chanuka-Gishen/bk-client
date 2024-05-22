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
import { INVOICE_TYPES } from 'src/constants/invoiceTypeConstants';

export const AddUpdateInvoiceDialog = ({
  isAdd,
  bookType,
  open,
  handleClose,
  formik,
  handleSubmit,
  isLoading,
}) => {
  const { touched, errors, getFieldProps, values, setFieldValue } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>{isAdd ? 'Create' : 'Update'} Invoice</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {bookType === INVOICE_TYPES.RANGE ? (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Invoice No From*"
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    type="number"
                    {...getFieldProps('invoiceNoFrom')}
                    error={Boolean(touched.invoiceNoFrom && errors.invoiceNoFrom)}
                    helperText={touched.invoiceNoFrom && errors.invoiceNoFrom}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Invoice No To*"
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    type="number"
                    {...getFieldProps('invoiceNoTo')}
                    error={Boolean(touched.invoiceNoTo && errors.invoiceNoTo)}
                    helperText={touched.invoiceNoTo && errors.invoiceNoTo}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Invoice No*"
                  fullWidth
                  autoComplete="off"
                  variant="outlined"
                  type="number"
                  {...getFieldProps('invoiceNo')}
                  error={Boolean(touched.invoiceNo && errors.invoiceNo)}
                  helperText={touched.invoiceNo && errors.invoiceNo}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('invoiceDescription')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Invoiced Created At*"
                value={values.invoiceCreatedAt}
                onChange={(date) => setFieldValue('invoiceCreatedAt', date)}
              />
              {touched.invoiceCreatedAt && errors.invoiceCreatedAt && (
                <FormHelperText error>{errors.invoiceCreatedAt}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('invoiceAmount')}
                error={Boolean(touched.invoiceAmount && errors.invoiceAmount)}
                helperText={touched.invoiceAmount && errors.invoiceAmount}
                InputProps={{
                  inputComponent: CurrencyInput,
                }}
              />
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

AddUpdateInvoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
