import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { enqueueSnackbar, useSnackbar } from 'notistack';

import { DashboardView } from '../view/dashboardView';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import commonUtil from 'src/utils/common-util';

const validationSchema = Yup.object().shape({
  openingBalance: Yup.number().required().min(0, 'Opening balance invalid'),
});

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

  const headersCashBalances = ['Date', 'Opening Balance'];

  const sourceToken = axios.CancelToken.source();

  const [selectedDays, setSelectedDays] = useState(30);

  const [page, setPage] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dueInvocies, setDueInvoices] = useState([]);
  const [cashRecords, setCashRecords] = useState([]);
  const [selectedCashRecord, setSelectedCashRecord] = useState(null);

  const [openCashUpdate, setOpenCashUpdate] = useState(false);
  const [openCashRefresh, setOpenCashRefresh] = useState(false);
  const [openSelectDate, setOpenSelectdate] = useState(false);

  const [isLoadingDueInvoices, setIsLoadingDueInvocies] = useState(true);
  const [isLoadingCashBalance, setIsLoadingCashBalance] = useState(true);
  const [isLoadingCashUpdate, setIsLoadingCashUpdate] = useState(false);
  const [isLoadingCashRefresh, setIsLoadingCashRefresh] = useState(false);

  const formikCash = useFormik({
    initialValues: {
      openingBalance: 0,
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      null;
    },
  });

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

  const handleSelectDueDays = (event) => {
    setSelectedDays(event.target.value);
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

  const handleOpenCloseCashUpdate = (data) => {
    setOpenCashUpdate(!openCashUpdate);

    if (!openCashUpdate) {
      formikCash.setValues({
        openingBalance: data.openingBalance,
      });
    } else {
      formikCash.resetForm();
    }
  };

  const handleOpenCloseCashRefresh = () => {
    setOpenCashRefresh(!openCashRefresh);
  };

  const handleResetOpeningBalance = async () => {
    setIsLoadingCashRefresh(true);

    await backendAuthApi({
      url: BACKEND_API.CASHB_RESET + selectedCashRecord._id,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          handleFetchCashBalances();
          handleOpenCloseCashRefresh();
        } else {
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        }
      })
      .catch(() => {
        setIsLoadingCashRefresh(false);
      })
      .finally(() => {
        setIsLoadingCashRefresh(false);
      });
  };

  const handleUpdateOpeningCashBalance = async () => {
    commonUtil.validateFormik(formikCash);

    if (formikCash.isValid && formikCash.dirty) {
      setIsLoadingCashUpdate(true);

      await backendAuthApi({
        url: BACKEND_API.CASHB_UPDATE,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: {
          id: selectedCashRecord._id,
          ...formikCash.values,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleFetchCashBalances();
            handleOpenCloseCashUpdate();
          } else {
            enqueueSnackbar(res.data.responseMessage, {
              variant: responseUtil.findResponseType(res.data.responseCode),
            });
          }
        })
        .catch(() => {
          setIsLoadingCashUpdate(false);
        })
        .finally(() => {
          setIsLoadingCashUpdate(false);
        });
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

  const handleFetchCashBalances = async () => {
    setIsLoadingCashBalance(true);

    await backendAuthApi({
      url: BACKEND_API.CASHB_GET_RECENT,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setCashRecords(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingCashBalance(false);
      })
      .finally(() => {
        setIsLoadingCashBalance(false);
      });
  };

  useEffect(() => {
    handleFetchDueInvoices();
    handleFetchCashBalances();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardView
      selectedDays={selectedDays}
      isLoadingDueInvoices={isLoadingDueInvoices}
      dueInvocies={dueInvocies}
      handleSelectDueDays={handleSelectDueDays}
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
      isLoadingCashBalance={isLoadingCashBalance}
      cashRecords={cashRecords}
      headersCashBalances={headersCashBalances}
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
  );
};

export default DashboardController;
