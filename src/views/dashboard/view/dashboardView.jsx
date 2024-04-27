import React from 'react';

// material-ui
import { Button, Grid, Stack, TablePagination, TextField, Typography } from '@mui/material';

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import MainCard from 'src/components/mainCard';
import { DueInvoicesTable } from '../component/dueInvoicesTable';
import { OpeningBalanceTable } from '../component/openingBalance/components/openingBalanceTable';
import { fDate } from 'src/utils/format-time';
import { SelectDateRange } from '../component/selectDateRange';
import { OpeningBalance } from '../component/openingBalance';

export const DashboardView = ({
  isLoadingDueInvoices,
  dueInvocies,
  headersDueInvoice,
  formikDateRange,
  openSelectDate,
  handleOpenSelectDateRange,
  handleCloseSelectDateRange,
  handleSubmitFilterDate,
  page,
  documentCount,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Recent Due Invoices</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }}>
              <TextField
                variant="outlined"
                name="filterDate"
                label="Date Range"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={`${fDate(formikDateRange.values.dateFrom)}  -  ${fDate(formikDateRange.values.dateTo)}`}
              />

              <Button
                startIcon={<FilterAltIcon />}
                variant="contained"
                onClick={handleOpenSelectDateRange}
              >
                Filter
              </Button>
            </Stack>
          </Stack>
          <MainCard sx={{ mt: 2 }} content={false}>
            <DueInvoicesTable
              headers={headersDueInvoice}
              isLoading={isLoadingDueInvoices}
              invoices={dueInvocies}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </MainCard>
          <TablePagination
            page={page}
            component="div"
            count={documentCount}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[10, 20, 30]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <OpeningBalance />
        </Grid>
      </Grid>
      {openSelectDate && (
        <SelectDateRange
          open={openSelectDate}
          formik={formikDateRange}
          handleClose={handleCloseSelectDateRange}
          handleSubmit={handleSubmitFilterDate}
          isLoading={isLoadingDueInvoices}
        />
      )}
    </>
  );
};
