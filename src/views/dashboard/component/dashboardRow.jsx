import React from 'react';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';
import { WORK_STATUS, WORK_TYPE } from 'src/constants/commonConstants';
import commonUtil from 'src/utils/common-util';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export const JobTableRow = ({ jobs, handleClickJob }) => {
  return (
    <>
      <TableRow hover onClick={() => handleClickJob(jobs._id)}>
        <TableCell component="th">
          <Typography variant="subtitle2" noWrap>
            {jobs.workOrderCode}
          </Typography>
        </TableCell>
        <TableCell>{jobs.workOrderFrom}</TableCell>
        <TableCell>{jobs.workOrderCustomerId.customerName}</TableCell>
        <TableCell>
          <Label color={jobs.workOrderStatus === WORK_STATUS.CREATED ? 'warning' : 'success'}>
            {jobs.workOrderStatus}
          </Label>
        </TableCell>

        <TableCell>
          {commonUtil.calculateMonthDifference(jobs.workOrderScheduledDate) ? (
            <Label color={'error'}>{fDate(jobs.workOrderScheduledDate)}</Label>
          ) : (
            <>{fDate(jobs.workOrderScheduledDate)}</>
          )}
        </TableCell>

        <TableCell>
          <Label color={jobs.workOrderType === WORK_TYPE.SERVICE ? 'success' : 'warning'}>
            {jobs.workOrderType}
          </Label>
        </TableCell>
      </TableRow>
    </>
  );
};

JobTableRow.propTypes = {
  jobs: PropTypes.object.isRequired,
  handleClickJob: PropTypes.func.isRequired,
};
