import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { CustomTableHead } from 'src/components/custom-table/custom-table-head';
import { AddEmployeeDialog } from '../component/addEmployeeDialog';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import { EmpRow } from '../component/empRow';
import { UpdateEmployeeDialog } from '../component/updateEmployeeDialog';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';

export const UsersView = ({
  headerLables,
  setSelectedEmp,
  isLoading,
  employees,
  isOpenAdd,
  handleOpenCloseAddDialog,
  formik,
  handleAddUser,
  isLoadingAddUser,
  isOpenUpdate,
  updateFormik,
  handleOpenCloseUpdateDialog,
  isLoadingUpdateUser,
  handleUpdateUser,
  isOpenResetPwd,
  handleOpenCloseResetDialog,
  isLoadingResetPwd,
  handleResetPwd,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12}>
          <Stack direction={'row'} alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">Manage Employees</Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenCloseAddDialog}
            >
              Add
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <Stack direction="column" spacing={2}>
              <TableContainer sx={{ overflow: matchDownMD ? 'scroll' : 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <CustomTableHead enableAction={true} headLabel={headerLables} />
                  <TableBody>
                    {isLoading ? (
                      <TableLoadingRow colSpan={headerLables.length} />
                    ) : (
                      <>
                        {employees.length === 0 ? (
                          <TableEmptyRow colSpan={headerLables.length} />
                        ) : (
                          <>
                            {employees.map((emp, index) => (
                              <EmpRow
                                key={index}
                                employee={emp}
                                setSelectedEmp={setSelectedEmp}
                                handleOpenUpdateDialog={handleOpenCloseUpdateDialog}
                                handleOpenResetConfirmation={handleOpenCloseResetDialog}
                              />
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                page={page}
                component="div"
                count={employees.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[10, 20, 30]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Stack>
          </Card>
        </Grid>
      </Grid>
      {isOpenAdd && (
        <AddEmployeeDialog
          formik={formik}
          handleClose={handleOpenCloseAddDialog}
          open={isOpenAdd}
          handleSubmitAddUser={handleAddUser}
          isLoading={isLoadingAddUser}
        />
      )}
      {isOpenUpdate && (
        <UpdateEmployeeDialog
          formik={updateFormik}
          open={isOpenUpdate}
          handleClose={handleOpenCloseUpdateDialog}
          handleSubmit={handleUpdateUser}
          isLoading={isLoadingUpdateUser}
        />
      )}
      {isOpenResetPwd && (
        <ConfirmationDialog
          open={isOpenResetPwd}
          contentText="Are you sure that you want to reset this emlpoyee password ?"
          handleClose={handleOpenCloseResetDialog}
          handleSubmit={handleResetPwd}
          isLoading={isLoadingResetPwd}
        />
      )}
    </>
  );
};

UsersView.propTypes = {
  headerLables: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  employees: PropTypes.array,
  isOpenAdd: PropTypes.bool.isRequired,
  handleOpenCloseAddDialog: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
  handleAddUser: PropTypes.func.isRequired,
  isLoadingAddUser: PropTypes.bool.isRequired,
  isOpenUpdate: PropTypes.bool.isRequired,
  updateFormik: PropTypes.object.isRequired,
  handleOpenCloseUpdateDialog: PropTypes.func.isRequired,
  isLoadingUpdateUser: PropTypes.bool.isRequired,
  handleUpdateUser: PropTypes.func.isRequired,
  isOpenResetPwd: PropTypes.bool.isRequired,
  handleOpenCloseResetDialog: PropTypes.func.isRequired,
  isLoadingResetPwd: PropTypes.bool.isRequired,
  handleResetPwd: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
};
