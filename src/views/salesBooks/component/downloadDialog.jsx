import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { FormikProvider } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';

import { Download } from '@mui/icons-material';

export const DownloadDialog = ({
  open,
  handleChange,
  downloadDate,
  handleClose,
  handleSubmit,
  isLoading,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth sx={{ px: 2 }}>
      <DialogTitle>Download Reports</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          sx={{ mt: 2 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} sm={5}>
            <DatePicker
              label="Selected Date*"
              value={downloadDate}
              onChange={(date) => handleChange(date)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              startIcon={<Download />}
            >
              Invoice Summary
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

DownloadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
