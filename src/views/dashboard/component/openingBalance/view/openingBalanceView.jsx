import React from 'react';
import { IconButton, Stack, Typography } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import MainCard from 'src/components/mainCard';
import { OpeningBalanceTable } from '../components/openingBalanceTable';
import { OpeningBalanceAdd } from '../components/openingBalanceAdd';

export const OpeningBalanceView = ({
  isLoadingCashBalance,
  cashRecords,
  headersCashBalances,
  setSelectedCashRecord,
  formik,
  formikCash,
  openCashUpdate,
  isLoadingCashUpdate,
  handleOpenCloseCashUpdate,
  handleUpdateOpeningCashBalance,
  openCashRefresh,
  isLoadingCashRefresh,
  handleOpenCloseCashRefresh,
  handleResetOpeningBalance,
  openCashAdd,
  isLoadingCashAdd,
  handleOpenCloseCashAdd,
  handleAddOpeningBalance,
}) => {
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography variant="h5">Recent Opening Balances</Typography>
        <IconButton aria-label="Add" onClick={handleOpenCloseCashAdd}>
          <AddCircleIcon />
        </IconButton>
      </Stack>

      <MainCard sx={{ mt: 2 }} content={false}>
        <OpeningBalanceTable
          headers={headersCashBalances}
          isLoading={isLoadingCashBalance}
          records={cashRecords}
          setSelectedCashRecord={setSelectedCashRecord}
          formikCash={formikCash}
          openCashUpdate={openCashUpdate}
          isLoadingCashUpdate={isLoadingCashUpdate}
          handleOpenCloseCashUpdate={handleOpenCloseCashUpdate}
          handleUpdateOpeningCashBalance={handleUpdateOpeningCashBalance}
          openCashRefresh={openCashRefresh}
          isLoadingCashRefresh={isLoadingCashRefresh}
          handleOpenCloseCashRefresh={handleOpenCloseCashRefresh}
          handleResetOpeningBalance={handleResetOpeningBalance}
        />
      </MainCard>
      {openCashAdd && (
        <OpeningBalanceAdd
          open={openCashAdd}
          handleClose={handleOpenCloseCashAdd}
          formik={formik}
          handleSubmit={handleAddOpeningBalance}
          isLoading={isLoadingCashAdd}
        />
      )}
    </>
  );
};
