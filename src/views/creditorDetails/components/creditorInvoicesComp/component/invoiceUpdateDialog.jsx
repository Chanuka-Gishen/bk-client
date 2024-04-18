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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { CurrencyInput } from 'src/components/currency-input/currency-input';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';

export const InvoiceUpdateDialog = ({ open, handleClose, formik, handleSubmit, isLoading }) => {
  const { values, touched, errors, getFieldProps, setFieldValue } = formik;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Update Invoice</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice No*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('credInvoiceNo')}
                error={Boolean(touched.credInvoiceNo && errors.credInvoiceNo)}
                helperText={touched.credInvoiceNo && errors.credInvoiceNo}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cost*"
                fullWidth
                autoComplete="off"
                variant="outlined"
                {...getFieldProps('credInvoiceAmount')}
                error={Boolean(touched.credInvoiceAmount && errors.credInvoiceAmount)}
                helperText={touched.credInvoiceAmount && errors.credInvoiceAmount}
                InputProps={{
                  inputComponent: CurrencyInput,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Invoiced Date*"
                value={values.credInvoiceDate}
                onChange={(date) => setFieldValue('credInvoiceDate', date)}
              />
              {touched.credInvoiceDate && errors.credInvoiceDate && (
                <FormHelperText error>{errors.credInvoiceDate}</FormHelperText>
              )}
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Status*</InputLabel>
                <Select id="select" label="Payment Status" {...getFieldProps('credInvoiceStatus')}>
                  <MenuItem value={PAYMENT_STATUS.PAID}>{PAYMENT_STATUS.PAID}</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.NOTPAID}>{PAYMENT_STATUS.NOTPAID}</MenuItem>
                </Select>
                {Boolean(touched.credInvoiceStatus && errors.credInvoiceStatus) && (
                  <FormHelperText error>
                    {touched.credInvoiceStatus && errors.credInvoiceStatus}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}
            {values.credInvoiceStatus === PAYMENT_STATUS.PAID && (
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Invoice Paid Date*"
                  value={values.credInvoicePaidDate}
                  onChange={(date) => setFieldValue('credInvoicePaidDate', date)}
                />
                {touched.credInvoicePaidDate && errors.credInvoicePaidDate && (
                  <FormHelperText error>{errors.credInvoicePaidDate}</FormHelperText>
                )}
              </Grid>
            )}
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

InvoiceUpdateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
