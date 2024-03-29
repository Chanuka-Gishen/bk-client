import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow, Typography } from '@mui/material';

import { useSelector } from 'react-redux';
import { fDate } from 'src/utils/format-time';

export const CreditorRow = ({ creditor, handleOnClickRow }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <TableRow hover onClick={() => handleOnClickRow(creditor)}>
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {creditor.creditorName}
          </Typography>
        </TableCell>
        <TableCell>{creditor.creditorCity}</TableCell>
        <TableCell>{creditor.creditorUserName}</TableCell>
        <TableCell>{creditor.creditorCreditPeriod} Days</TableCell>
        <TableCell>{creditor.creditorMobilePrimary}</TableCell>
        <TableCell>
          {creditor.creditorMobileSecondary ? creditor.creditorMobileSecondary : ' - '}
        </TableCell>
        <TableCell>{fDate(creditor.creditorCreatedAt)}</TableCell>
      </TableRow>
    </>
  );
};

CreditorRow.propTypes = {
  creditor: PropTypes.object.isRequired,
  setSelectedCreditor: PropTypes.func.isRequired,
  handleOpenUpdateDialog: PropTypes.func.isRequired,
};
