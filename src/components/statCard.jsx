import React from 'react';
import propTypes from 'prop-types';

import { Chip, Grid, Stack, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import MainCard from './mainCard';
import { fDate } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';

export const StatisticCard = ({ title, isLoading, data, date }) => {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={12}>
            <Typography variant="h4" color="inherit">
              {isLoading ? 'Loading...' : formatCurrency(data)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Chip
              variant="combined"
              icon={<CalendarMonthIcon />}
              label={`${fDate(new Date(date))}`}
              sx={{ mt: 1 }}
              size="small"
            />
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
};

StatisticCard.propTypes = {
  title: propTypes.string.isRequired,
  isLoading: propTypes.bool.isRequired,
  data: propTypes.number.isRequired,
  date: propTypes.any,
};
