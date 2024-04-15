import React from 'react';

// material-ui
import { Grid, MenuItem, Select, Stack, TablePagination, Typography } from '@mui/material';

import MainCard from 'src/components/mainCard';
import { DueInvoicesTable } from '../component/dueInvoicesTable';

export const DashboardView = ({
  selectedDays,
  isLoadingDueInvoices,
  dueInvocies,
  handleSelectDueDays,
  headersDueInvoice,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sm={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Recent Due Invoices</Typography>
          <Select value={selectedDays} label="Days" onChange={handleSelectDueDays}>
            <MenuItem value={7}>Within 7 Days</MenuItem>
            <MenuItem value={10}>Within 10 Days</MenuItem>
            <MenuItem value={14}>Within 14 Days</MenuItem>
            <MenuItem value={30}>Within 30 Days</MenuItem>
          </Select>
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
          count={dueInvocies.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 20, 30]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
};
