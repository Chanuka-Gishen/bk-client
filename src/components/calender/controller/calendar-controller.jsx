import React, { useEffect, useState } from 'react';
import { CalendarView } from '../view/calendar-view';
import axios from 'axios';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';

const CalendarController = () => {
  const cancelToken = axios.CancelToken.source();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(new Date(date).getMonth());
  };

  const fetchUnits = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.CUSTOMER_UNITS_FOR_CALENDER,
      method: 'GET',
      cancelToken: cancelToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          if (res.data.responseData) {
            setData(res.data.responseData);
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUnits();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CalendarView
      handleDateChange={handleDateChange}
      handleMonthChange={handleMonthChange}
      isLoading={isLoading}
      data={data}
      selectedDate={selectedDate}
      selectedMonth={selectedMonth}
    />
  );
};
export default CalendarController;
