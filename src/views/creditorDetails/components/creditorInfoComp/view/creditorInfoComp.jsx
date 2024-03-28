import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { fDate } from 'src/utils/format-time';

export const CreditorInforCompView = ({ creditor, isLoading }) => {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>
                <Typography fontWeight="bold" variant="subtitle1">
                  Creditor info
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{isLoading ? 'Loading...' : creditor.creditorName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Oraganization Name</TableCell>
              <TableCell>
                {isLoading
                  ? 'Loading...'
                  : creditor.creditorOrganization
                    ? creditor.creditorOrganization
                    : ' - '}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>City / Town</TableCell>
              <TableCell>{isLoading ? 'Loading...' : creditor.creditorCity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Creditor Code</TableCell>
              <TableCell>{isLoading ? 'Loading...' : creditor.creditorUserName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Credit Period</TableCell>
              <TableCell>{isLoading ? 'Loading...' : creditor.creditorCreditPeriod} Days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Telephone Number (Primary)</TableCell>
              <TableCell>{isLoading ? 'Loading...' : creditor.creditorMobilePrimary}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Telephone Number (Secondary)</TableCell>
              <TableCell>
                {isLoading
                  ? 'Loading...'
                  : creditor.creditorMobileSecondary
                    ? creditor.creditorMobileSecondary
                    : ' - '}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>{isLoading ? 'Loading...' : fDate(creditor.creditorCreatedAt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
