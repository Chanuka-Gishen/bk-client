import React, { Fragment } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {
  Avatar,
  Badge,
  Card,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { DayCalendarSkeleton, PickersDay } from '@mui/x-date-pickers';

import WorkIcon from '@mui/icons-material/Work';
import { fDate } from 'src/utils/format-time';

const ServerDay = (props) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  // Check if day is a Date object before accessing its properties
  const isSelected =
    !props.outsideCurrentMonth &&
    day instanceof Date &&
    highlightedDays.indexOf(day.getDate()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      color="success"
      badgeContent={isSelected ? ' ' : null}
      variant={isSelected ? 'dot' : 'standard'}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
};

export const CalendarView = ({
  handleDateChange,
  handleMonthChange,
  isLoading,
  data,
  selectedDate,
  selectedMonth,
}) => {
  // Filter the data for the selected month
  const filteredData = data.filter((item) => new Date(item._id).getMonth() === selectedMonth);

  const jobsForSelectedDate = data.filter((unit) => {
    const unitDate = new Date(unit._id);
    // Check if the unit's date matches the selected date
    return (
      unitDate.getDate() === selectedDate.getDate() &&
      unitDate.getMonth() === selectedDate.getMonth() &&
      unitDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const highlightedDays = filteredData.map((item) => {
    const day = new Date(item._id).getDate(); // Extract the day (DD) part
    return day;
  });

  return (
    <Grid container spacing={2} alignItems="start" justifyContent="center">
      <Grid item xs={12} sm={6}>
        <Card>
          <DateCalendar
            loading={isLoading}
            onMonthChange={handleMonthChange}
            onChange={(newValue) => handleDateChange(newValue)}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day: {
                highlightedDays,
              },
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card sx={{ p: 2 }}>
          <Typography textAlign="center" fontWeight="bold">
            Scheduled Jobs for {fDate(selectedDate)}
          </Typography>
          {jobsForSelectedDate.length > 0 ? (
            <List sx={{ maxHeight: 308, overflow: 'auto' }}>
              {jobsForSelectedDate[0].units.map((job, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={job.customer.customerName}
                    secondary={
                      <Stack direction="column">
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {`${job.unitBrand} - ${job.unitModel} - ${job.unitSerialNo}`}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {job.qrCode ? `${job.qrCode.qrCodeName}` : 'QR not assigned'}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography textAlign="center" variant="body2">
              No jobs available
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};
