import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

export const CreditorRow = ({ creditor, handleOnClickRow }) => {
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
  handleOnClickRow: PropTypes.func.isRequired,
};
