import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { DashboardView } from '../view/dashboardView';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import commonUtil from 'src/utils/common-util';

const validationSchemaDateRange = Yup.object().shape({
  dateFrom: Yup.date()
    .required()
    .test('date-range', 'From date must be less than To date', function (value) {
      const { dateTo } = this.parent;
      return !dateTo || value < dateTo;
    }),
  dateTo: Yup.date()
    .required()
    .test('date-range', 'To date must be greater than From date', function (value) {
      const { dateFrom } = this.parent;
      return !dateFrom || value > dateFrom;
    }),
});

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

  const [page, setPage] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dueInvocies, setDueInvoices] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCreditPayments, setTotalCreditPayments] = useState(0);
  const [totalCashBalance, setTotalCashBalance] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);

  const [openSelectDate, setOpenSelectdate] = useState(false);

  const [isLoadingDueInvoices, setIsLoadingDueInvocies] = useState(true);
  const [isLoadingTb, setIsLoadingTb] = useState(false);
  const [isLoadingTcp, setIsLoadingTcp] = useState(false);
  const [isLoadingCb, setIsLoadingCb] = useState(false);
  const [isLoadingTp, setIsLoadingTp] = useState(false);

  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 30);

  const formikDateRange = useFormik({
    initialValues: {
      dateFrom: currentDate,
      dateTo: futureDate,
    },
    validationSchema: validationSchemaDateRange,
    onSubmit: () => {
      null;
    },
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenSelectDateRange = () => {
    setOpenSelectdate(true);
  };

  const handleCloseSelectDateRange = () => {
    setOpenSelectdate(false);
  };

  const handleSubmitFilterDate = () => {
    commonUtil.validateFormik(formikDateRange);

    if (formikDateRange.isValid && formikDateRange.dirty) {
      handleFetchDueInvoices();
    }
  };

  const handleFetchDueInvoices = async () => {
    setIsLoadingDueInvocies(true);

    await backendAuthApi({
      url: BACKEND_API.CRED_INVOICE_FILTER_DAYS,
      method: 'POST',
      cancelToken: sourceToken.token,
      params: {
        page: page,
        limit: rowsPerPage,
      },
      data: formikDateRange.values,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setDueInvoices(res.data.responseData.invoices);
          setDocumentCount(res.data.responseData.documentCount);
          handleCloseSelectDateRange();
        }
      })
      .catch(() => {
        setIsLoadingDueInvocies(false);
      })
      .finally(() => {
        setIsLoadingDueInvocies(false);
      });
  };

  const handleFetchTotalBalanceStat = async () => {
    setIsLoadingTb(true);

    await backendAuthApi({
      url: BACKEND_API.SBOOK_CASHB_TOTAL,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setTotalBalance(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingTb(false);
      })
      .finally(() => {
        setIsLoadingTb(false);
      });
  };

  const handleFetchTotalCreditorPaymentsStat = async () => {
    setIsLoadingTcp(true);

    await backendAuthApi({
      url: BACKEND_API.INVOICE_TOTAL_CRED_PAYMENTS,
      method: 'POST',
      cancelToken: sourceToken.token,
      data: { filteredDate: null },
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setTotalCreditPayments(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingTcp(false);
      })
      .finally(() => {
        setIsLoadingTcp(false);
      });
  };

  const handleFetchTotalCashBalanceStat = async () => {
    setIsLoadingCb(true);

    await backendAuthApi({
      url: BACKEND_API.SBOOK_CASHB,
      method: 'POST',
      cancelToken: sourceToken.token,
      data: { filteredDate: new Date() },
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setTotalCashBalance(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingCb(false);
      })
      .finally(() => {
        setIsLoadingCb(false);
      });
  };

  const handleFetchTotalPaymentsStat = async () => {
    setIsLoadingTp(true);

    await backendAuthApi({
      url: BACKEND_API.PAYMENTS_TOTAL,
      method: 'POST',
      cancelToken: sourceToken.token,
      data: { filteredDate: new Date() },
    })
      .then((res) => {
        const data = res.data;

        if (responseUtil.isResponseSuccess(data.responseCode)) {
          setTotalPayments(data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingTp(false);
      })
      .finally(() => {
        setIsLoadingTp(false);
      });
  };

  useEffect(() => {
    handleFetchTotalBalanceStat();
    handleFetchTotalCreditorPaymentsStat();
    handleFetchTotalCashBalanceStat();
    handleFetchTotalPaymentsStat();

    handleFetchDueInvoices();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardView
      totalBalance={totalBalance}
      totalCreditPayments={totalCreditPayments}
      totalCashBalance={totalCashBalance}
      totalPayments={totalPayments}
      isLoadingTb={isLoadingTb}
      isLoadingTcp={isLoadingTcp}
      isLoadingCb={isLoadingCb}
      isLoadingTp={isLoadingTp}
      isLoadingDueInvoices={isLoadingDueInvoices}
      dueInvocies={dueInvocies}
      headersDueInvoice={headersDueInvoice}
      formikDateRange={formikDateRange}
      openSelectDate={openSelectDate}
      handleOpenSelectDateRange={handleOpenSelectDateRange}
      handleCloseSelectDateRange={handleCloseSelectDateRange}
      handleSubmitFilterDate={handleSubmitFilterDate}
      page={page}
      documentCount={documentCount}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default DashboardController;
