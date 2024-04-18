import React from 'react';
import { Table, TableBody, TableContainer } from '@mui/material';

import { CustomTableHead } from 'src/components/custom-table/custom-table-head';
import TableEmptyRow from 'src/components/custom-table/table-empty-row';
import TableLoadingRow from 'src/components/custom-table/table-loading-row';
import { OpeningBalanceRow } from './openingBalanceRow';
import { OpeningBalanceUpdate } from './openingBalanceUpdate';
import ConfirmationDialog from 'src/components/confirmation-dialog/confirmation-dialog';

export const OpeningBalanceTable = ({
  headers,
  isLoading,
  records,
  setSelectedCashRecord,
  formikCash,
  openCashUpdate,
  isLoadingCashUpdate,
  handleOpenCloseCashUpdate,
  handleUpdateOpeningCashBalance,
  openCashRefresh,
  isLoadingCashRefresh,
  handleOpenCloseCashRefresh,
  handleResetOpeningBalance,
}) => {
  return (
    <TableContainer
      sx={{
        width: '100%',
        overflowX: 'auto',
        position: 'relative',
        display: 'block',
        maxWidth: '100%',
        '& td, & th': { whiteSpace: 'nowrap' },
      }}
    >
      <Table>
        <CustomTableHead enableAction={true} headLabel={headers} />
        <TableBody>
          {isLoading ? (
            <TableLoadingRow colSpan={headers.length} />
          ) : (
            <>
              {records.length === 0 ? (
                <TableEmptyRow colSpan={headers.length} />
              ) : (
                <>
                  {records.map((item, index) => (
                    <OpeningBalanceRow
                      key={index}
                      record={item}
                      setSelectedCashRecord={setSelectedCashRecord}
                      handleOpenUpdateDialog={handleOpenCloseCashUpdate}
                      handleOpenResetDialog={handleOpenCloseCashRefresh}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </TableBody>
      </Table>
      {openCashUpdate && (
        <OpeningBalanceUpdate
          open={openCashUpdate}
          formik={formikCash}
          handleClose={handleOpenCloseCashUpdate}
          isLoading={isLoadingCashUpdate}
          handleSubmit={handleUpdateOpeningCashBalance}
        />
      )}
      {openCashRefresh && (
        <ConfirmationDialog
          contentText="Are you sure that you want to reset this record?"
          handleClose={handleOpenCloseCashRefresh}
          open={openCashRefresh}
          handleSubmit={handleResetOpeningBalance}
          isLoading={isLoadingCashRefresh}
        />
      )}
    </TableContainer>
  );
};
