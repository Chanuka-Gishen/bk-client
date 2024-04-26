import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { PaymentsView } from '../view/paymentsView';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import commonUtil from 'src/utils/common-util';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';

const validationInvoiceUpdate = Yup.object().shape({
  credInvoiceNo: Yup.string().required('Invoice no is required'),
  credInvoiceDate: Yup.string().required('Invoiced Date is required'),
  credInvoiceAmount: Yup.number().required().min(0, 'Invoice amount is invalid'),
  credInvoicePaidDate: Yup.string().required('Invoice paid date is required'),
  credInvoiceStatus: Yup.string()
    .required('Status required')
    .oneOf([PAYMENT_STATUS.PAID, PAYMENT_STATUS.NOTPAID], 'Invalid Status'),
});

const validationInvoicePayment = Yup.object().shape({
  invoiceNo: Yup.string().required('Invoice no is required'),
  invoiceAmount: Yup.number().required().min(0, 'Invoice amount is invalid'),
  invoiceCreatedAt: Yup.string().required('Invoice created date is required'),
});

const PaymentsController = () => {
  const headerLabels = [
    '',
    'Creditor',
    'Invoice No',
    'Amount',
    'Balance Amount',
    'Invoiced Date',
    'Due Date',
    'Status',
    'Paid Date',
  ];

  const sourceToken = axios.CancelToken.source();
  const { enqueueSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTotal, setIsLoadingTotal] = useState(true);
  const [isLoadingAddPayment, setIsLoadingAddPayment] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const formik = useFormik({
    initialValues: {
      credInvoiceNo: '',
      credInvoiceDate: null,
      credInvoiceAmount: 0,
      credInvoicePaidDate: null,
      credInvoiceStatus: PAYMENT_STATUS.NOTPAID,
    },
    validationSchema: validationInvoiceUpdate,
    onSubmit: () => {
      null;
    },
  });

  const formikPayInvoice = useFormik({
    initialValues: {
      invoiceNo: '',
      invoiceAmount: 0,
      invoiceCreatedAt: new Date(),
    },
    validationSchema: validationInvoicePayment,
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

  const handleSelectedDateChange = (date) => {
    setSelectedDate(new Date(date));
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = invoices.filter((item) => {
    const name = item.creditor.creditorName.toLowerCase();
    const searchParamRegex = new RegExp(`${searchTerm.toLowerCase()}`, 'i');
    return searchParamRegex.test(name);
  });

  const handleOpenCloseAddDialog = () => {
    setIsOpenAdd(!isOpenAdd);

    if (isOpenAdd) {
      formikPayInvoice.resetForm();
    }
  };

  const handleOpenCloseUpdateDialog = () => {
    setIsOpenUpdate(!isOpenUpdate);

    if (!isOpenUpdate) {
      formik.setValues({
        credInvoiceNo: selectedInvoice.credInvoiceNo,
        credInvoiceAmount: selectedInvoice.credInvoiceAmount,
        credInvoiceDate: new Date(selectedInvoice.credInvoiceDate),
        credInvoicePaidDate: selectedInvoice.credInvoicePaidDate
          ? new Date(selectedInvoice.credInvoicePaidDate)
          : new Date(),
        credInvoiceStatus: selectedInvoice.credInvoiceStatus,
      });
    } else {
      formik.resetForm();
    }
  };

  const handleOpenCloseDeleteDialog = () => {
    setIsOpenDelete(!isOpenDelete);
  };

  const handleSubmitAddPayment = async () => {
    commonUtil.validateFormik(formikPayInvoice);

    if (formikPayInvoice.isValid && formikPayInvoice.dirty) {
      setIsLoadingAddPayment(true);

      await backendAuthApi({
        url: BACKEND_API.INVOICE_CREATE_CRED,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: {
          credInvoiceId: selectedInvoice._id,
          ...formikPayInvoice.values,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseAddDialog();
            handleFetchPayments();
          }
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingAddPayment(false);
        })
        .finally(() => {
          setIsLoadingAddPayment(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleSubmitUpdate = async () => {
    commonUtil.validateFormik(formik);
    if (formik.isValid && formik.dirty) {
      setIsLoadingUpdate(true);

      await backendAuthApi({
        url: BACKEND_API.CREDITOR_UPDATE_INVOICE,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: {
          credId: selectedInvoice._id,
          ...formik.values,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseUpdateDialog(null);
            handleFetchPayments();
          }
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingUpdate(false);
        })
        .finally(() => {
          setIsLoadingUpdate(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleSubmitDelete = async () => {
    setIsLoadingDelete(true);

    await backendAuthApi({
      url: BACKEND_API.CREDITOR_DELETE_INVOICE + selectedInvoice._id,
      method: 'DELETE',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          handleOpenCloseDeleteDialog();
          handleFetchPayments();
        }
        enqueueSnackbar(res.data.responseMessage, {
          variant: responseUtil.findResponseType(res.data.responseCode),
        });
      })
      .catch(() => {
        setIsLoadingDelete(false);
      })
      .finally(() => {
        setIsLoadingDelete(false);
      });
  };

  const handleFetchTotalAmount = async () => {
    setIsLoadingTotal(true);

    await backendAuthApi({
      url: BACKEND_API.INVOICE_TOTAL_CRED_PAYMENTS,
      method: 'POST',
      cancelToken: sourceToken.token,
      data: {
        filteredDate: selectedDate,
      },
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setTotalPayments(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingTotal(false);
      })
      .finally(() => {
        setIsLoadingTotal(false);
      });
  };

  const handleFetchPayments = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.CREDITORS_INVOICES,
      method: 'POST',
      cancelToken: sourceToken.token,
      params: {
        page: page,
        limit: rowsPerPage,
      },
      data: {
        filteredDate: selectedDate,
      },
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setInvoices(res.data.responseData.invoices);
          setCount(res.data.responseData.count);
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
    handleFetchPayments();
    handleFetchTotalAmount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, page, rowsPerPage]);

  return (
    <PaymentsView
      headerLabels={headerLabels}
      invoices={invoices}
      totalPayments={totalPayments}
      isLoading={isLoading}
      isLoadingTotal={isLoadingTotal}
      setSelectedInvoice={setSelectedInvoice}
      searchTerm={searchTerm}
      handleSearchInputChange={handleSearchInputChange}
      filteredData={filteredData}
      formik={formik}
      formikPayInvoice={formikPayInvoice}
      isOpenAdd={isOpenAdd}
      isOpenUpdate={isOpenUpdate}
      isOpenDelete={isOpenDelete}
      isLoadingAddPayment={isLoadingAddPayment}
      isLoadingUpdate={isLoadingUpdate}
      isLoadingDelete={isLoadingDelete}
      handleOpenCloseAddDialog={handleOpenCloseAddDialog}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      handleOpenCloseDeleteDialog={handleOpenCloseDeleteDialog}
      handleSubmitAddPayment={handleSubmitAddPayment}
      handleSubmitUpdate={handleSubmitUpdate}
      handleSubmitDelete={handleSubmitDelete}
      handleFetchPayments={handleFetchPayments}
      selectedDate={selectedDate}
      handleSelectedDateChange={handleSelectedDateChange}
      handleClearDate={handleClearDate}
      page={page}
      count={count}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default PaymentsController;
