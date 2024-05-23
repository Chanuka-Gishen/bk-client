import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { PaymentsView } from '../view/paymentsView';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import commonUtil from 'src/utils/common-util';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';

// ---------------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  paymentDescription: Yup.string().required('Description is required'),
  paymentAmount: Yup.number().required().min(0, 'Payment amount is invalid'),
  paymentDate: Yup.date().required('Date is required'),
});

const PaymentsController = () => {
  const headerLabels = ['Date', 'Description', 'Paid Amount'];

  const sourceToken = axios.CancelToken.source();
  const { enqueueSnackbar } = useSnackbar();

  const [invoices, setInvoices] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isAdd, setIsAdd] = useState(true);
  const [isOpenAddUpdate, setIsOpenAddUpdate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTotal, setIsLoadingTotal] = useState(false);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const formik = useFormik({
    initialValues: {
      paymentDescription: '',
      paymentAmount: 0,
      paymentDate: new Date(),
    },
    validationSchema,
    onSubmit: () => {
      null;
    },
  });

  const formikFilter = useFormik({
    initialValues: {
      filteredDate: null,
    },
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

  const handleOpenCloseAddDialog = () => {
    setIsOpenAddUpdate(!isOpenAddUpdate);

    if (!isOpenAddUpdate) {
      setIsAdd(true);
    } else {
      formik.resetForm();
    }
  };

  const handleOpenCloseUpdateDialog = (record) => {
    setIsOpenAddUpdate(!isOpenAddUpdate);

    if (!isOpenAddUpdate) {
      setIsAdd(false);
      formik.setValues({
        paymentDescription: record.paymentDescription,
        paymentAmount: record.paymentAmount,
        paymentDate: new Date(record.paymentDate),
      });
    } else {
      formik.resetForm();
    }
  };

  const handleOpenCloseDeleteDialog = () => {
    setIsOpenDelete(!isOpenDelete);
  };

  const handleAddPaymentSubmit = async () => {
    commonUtil.validateFormik(formik);

    if (formik.isValid && formik.dirty) {
      setIsLoadingAdd(true);

      await backendAuthApi({
        url: BACKEND_API.PAYMENT_ADD,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: formik.values,
      })
        .then((res) => {
          const data = res.data;

          if (responseUtil.isResponseSuccess(data.responseCode)) {
            handleOpenCloseAddDialog();
            handleFetchPayments();
          }

          enqueueSnackbar(data.responseMessage, {
            variant: responseUtil.findResponseType(data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingAdd(false);
        })
        .finally(() => {
          setIsLoadingAdd(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleUpdatePaymentSubmit = async () => {
    commonUtil.validateFormik(formik);

    if (formik.isValid && formik.dirty) {
      setIsLoadingUpdate(true);

      await backendAuthApi({
        url: BACKEND_API.PAYMENT_UPDATE,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: {
          id: selectedInvoiceId,
          ...formik.values,
        },
      })
        .then((res) => {
          const data = res.data;

          if (responseUtil.isResponseSuccess(data.responseCode)) {
            handleOpenCloseUpdateDialog(null);
            handleFetchPayments();
          }

          enqueueSnackbar(data.responseMessage, {
            variant: responseUtil.findResponseType(data.responseCode),
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

  const handleDeletePaymentSubmit = async () => {
    if (selectedInvoiceId) {
      setIsLoadingDelete(true);

      await backendAuthApi({
        url: BACKEND_API.PAYMENT_DELETE + selectedInvoiceId,
        method: 'DELETE',
        cancelToken: sourceToken.token,
      })
        .then((res) => {
          const data = res.data;

          if (responseUtil.isResponseSuccess(data.responseCode)) {
            handleOpenCloseDeleteDialog();
            handleFetchPayments();
          }

          enqueueSnackbar(data.responseMessage, {
            variant: responseUtil.findResponseType(data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingDelete(false);
        })
        .finally(() => {
          setIsLoadingDelete(false);
        });
    }
  };

  const handleFetchTotalPayments = async () => {
    setIsLoadingTotal(true);

    await backendAuthApi({
      url: BACKEND_API.PAYMENTS_TOTAL,
      method: 'POST',
      cancelToken: sourceToken.token,
      data: formikFilter.values,
    })
      .then((res) => {
        const data = res.data;

        if (responseUtil.isResponseSuccess(data.responseCode)) {
          setTotalPayments(data.responseData);
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
      url: BACKEND_API.PAYMENTS,
      method: 'POST',
      cancelToken: sourceToken.token,
      params: {
        page: page,
        limit: rowsPerPage,
      },
      data: formikFilter.values,
    })
      .then((res) => {
        const data = res.data;

        if (responseUtil.isResponseSuccess(data.responseCode)) {
          setInvoices(data.responseData.invoices);
          setCount(data.responseData.documentCount);
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
    handleFetchTotalPayments();
    handleFetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikFilter.values.filteredDate, page]);

  return (
    <PaymentsView
      headerLabels={headerLabels}
      setSelectedInvoiceId={setSelectedInvoiceId}
      formik={formik}
      formikFilter={formikFilter}
      invoices={invoices}
      totalPayments={totalPayments}
      isAdd={isAdd}
      isOpenAddUpdate={isOpenAddUpdate}
      isOpenDelete={isOpenDelete}
      isLoading={isLoading}
      isLoadingTotal={isLoadingTotal}
      isLoadingAdd={isLoadingAdd}
      isLoadingUpdate={isLoadingUpdate}
      isLoadingDelete={isLoadingDelete}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleOpenCloseAddDialog={handleOpenCloseAddDialog}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      handleOpenCloseDeleteDialog={handleOpenCloseDeleteDialog}
      handleAddPaymentSubmit={handleAddPaymentSubmit}
      handleUpdatePaymentSubmit={handleUpdatePaymentSubmit}
      handleDeletePaymentSubmit={handleDeletePaymentSubmit}
      page={page}
      count={count}
      rowsPerPage={rowsPerPage}
    />
  );
};

export default PaymentsController;
