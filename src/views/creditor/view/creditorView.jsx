import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  Grid,
  InputAdornment,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { AddCreditorDialog } from '../component/addCreditorDialog';
import { CustomTableHead } from 'src/components/custom-table/custom-table-head';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import { CreditorRow } from '../component/creditorRow';

export const CreditorView = ({
  headerLabels,
  isLoading,
  creditors,
  searchTerm,
  handleSearchInputChange,
  filteredData,
  handleOnClickRow,
  isOpenCreditorAdd,
  formik,
  handleOpenCloseCreditorAdd,
  isLoadingCreditorAdd,
  handleAddCreditor,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={4}>
        <Grid item xs={12} sm={12}>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Manage Creditors</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenCloseCreditorAdd(null)}
            >
              Add Creditor
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <Toolbar
              sx={{
                height: 96,
                display: 'flex',
                justifyContent: 'space-between',
                p: (theme) => theme.spacing(0, 1, 0, 3),
              }}
            >
              <OutlinedInput
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search customer name..."
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                }
              />
            </Toolbar>
            <TableContainer sx={{ overflow: matchDownMD ? 'scroll' : 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <CustomTableHead enableAction={false} headLabel={headerLabels} />
                <TableBody>
                  {isLoading ? (
                    <TableLoadingRow colSpan={headerLabels.length + 1} />
                  ) : (
                    <>
                      {creditors.length > 0 ? (
                        <>
                          {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((item, index) => (
                              <CreditorRow
                                key={index}
                                creditor={item}
                                handleOnClickRow={handleOnClickRow}
                              />
                            ))}
                          {filteredData.length === 0 && creditors.length != 0 && (
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={headerLabels.length + 1}
                              >{`No results found for "${searchTerm}"`}</TableCell>
                            </TableRow>
                          )}
                        </>
                      ) : (
                        <TableEmptyRow colSpan={headerLabels.length + 1} />
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              page={page}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 20, 30]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
      {isOpenCreditorAdd && (
        <AddCreditorDialog
          open={isOpenCreditorAdd}
          formik={formik}
          handleClose={handleOpenCloseCreditorAdd}
          handleSubmit={handleAddCreditor}
          isLoading={isLoadingCreditorAdd}
        />
      )}
    </>
  );
};

CreditorView.propTypes = {
  isOpenCreditorAdd: PropTypes.bool.isRequired,
  creditors: PropTypes.array,
  setSelectedCreditor: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  handleSearchInputChange: PropTypes.func.isRequired,
  filteredData: PropTypes.array,
  formik: PropTypes.object.isRequired,
  handleOpenCloseCreditorAdd: PropTypes.func.isRequired,
  isLoadingCreditorAdd: PropTypes.bool.isRequired,
  handleAddCreditor: PropTypes.func.isRequired,
  isUpdate: PropTypes.bool.isRequired,
  isLoadingCreditorUpdate: PropTypes.bool.isRequired,
  handleUpdateCreditor: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  isOpenAddInvoice: PropTypes.bool.isRequired,
  formikInvoice: PropTypes.object.isRequired,
  isLoadingAddInvoice: PropTypes.bool.isRequired,
  handleOpenCloseInvoiceDialog: PropTypes.func.isRequired,
  handleSubmitAddInvoice: PropTypes.func.isRequired,
};
