import React, { useEffect, useState } from 'react';
import { DashboardView } from '../view/dashboardView';
import axios from 'axios';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';

const DashboardController = () => {
  const headersDueInvoice = [
    'Invoice No',
    'Creditor',
    'Invoiced Date',
    'Invoice Due Date',
    'Invoice Paid Date',
    'Amount',
    'Balance Amount',
    'Invoice Status',
  ];

  const sourceToken = axios.CancelToken.source();

  const [selectedDays, setSelectedDays] = useState(30);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dueInvocies, setDueInvoices] = useState([]);

  const [isLoadingDueInvoices, setIsLoadingDueInvocies] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSelectDueDays = (event) => {
    setSelectedDays(event.target.value);
  };

  const handleFetchDueInvoices = async () => {
    setIsLoadingDueInvocies(true);

    await backendAuthApi({
      url: BACKEND_API.CRED_INVOICE_FILTER_DAYS,
      method: 'POST',
      cancelToken: sourceToken.token,
      query: {
        page: page,
        limit: rowsPerPage,
      },
      data: {
        days: selectedDays,
      },
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setDueInvoices(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingDueInvocies(false);
      })
      .finally(() => {
        setIsLoadingDueInvocies(false);
      });
  };

  useEffect(() => {
    handleFetchDueInvoices();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays]);

  return (
    <DashboardView
      selectedDays={selectedDays}
      isLoadingDueInvoices={isLoadingDueInvoices}
      dueInvocies={dueInvocies}
      handleSelectDueDays={handleSelectDueDays}
      headersDueInvoice={headersDueInvoice}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default DashboardController;
