import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { CredPaymentsView } from '../view/credPaymentsView';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import commonUtil from 'src/utils/common-util';

const validationSchema = Yup.object().shape({
  invoiceNo: Yup.string().required('Invoice no is required'),
  invoiceAmount: Yup.number().required().min(0, 'Invoice amount is invalid'),
  invoiceCreatedAt: Yup.string().required('Invoice created date is required'),
});

const CredPaymentsController = () => {
  const headerLabels = [
    'Main Invoice',
    'Sub Invoice',
    'Creditor',
    'Invoice Amount',
    'Balance Amount',
    'Paid Amount',
    'Invoiced Date',
    'Paid Date',
    'Due Date',
  ];

  const sourceToken = axios.CancelToken.source();
  const { enqueueSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTotal, setIsLoadingTotal] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const formik = useFormik({
    initialValues: {
      invoiceNo: '',
      invoiceAmount: 0,
      invoiceCreatedAt: new Date(),
    },
    validationSchema: validationSchema,
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

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenCloseUpdateDialog = (data) => {
    setIsOpenUpdate(!isOpenUpdate);

    if (!isOpenUpdate) {
      formik.setValues({
        invoiceNo: data.invoiceNo,
        invoiceAmount: data.invoiceAmount,
        invoiceCreatedAt: new Date(data.invoiceCreatedAt),
      });
    } else {
      formik.resetForm();
    }
  };

  const handleOpenCloseDeleteDialog = () => {
    setIsOpenDelete(!isOpenDelete);
  };

  const handleSubmitUpdate = async () => {
    commonUtil.validateFormik(formik);
    if (formik.isValid && formik.dirty) {
      setIsLoadingUpdate(true);

      await backendAuthApi({
        url: BACKEND_API.INVOICE_UPDATE_PAYMENT,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: {
          invoiceId: selectedInvoice._id,
          ...formik.values,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleFetchPayments();
            handleOpenCloseUpdateDialog(null);
          } else {
            enqueueSnackbar(res.data.responseMessage, {
              variant: responseUtil.findResponseType(res.data.responseCode),
            });
          }
        })
        .catch(() => {
          setIsLoadingUpdate(false);
        })
        .finally(() => {
          setIsLoadingUpdate(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, {
        variant: SNACKBAR_VARIANT.WARNING,
      });
    }
  };

  const handleSubmitDelete = async () => {
    if (selectedInvoice) {
      setIsLoadingDelete(true);

      await backendAuthApi({
        url: BACKEND_API.INVOICE_DELETE_PAYMENT + selectedInvoice._id,
        method: 'DELETE',
        cancelToken: sourceToken.token,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleFetchPayments();
            handleOpenCloseDeleteDialog();
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
    }
  };

  const handleFetchTotalAmount = async () => {
    setIsLoadingTotal(true);

    await backendAuthApi({
      url: BACKEND_API.INVOICE_TOTAL_CRED_PAYMENTS,
      method: 'POST',
      cancelToken: sourceToken.token,
      data: { filteredDate: formikFilter.values.filteredDate },
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
      url: BACKEND_API.INVOICE_CRED_PAYMENTS,
      method: 'GET',
      cancelToken: sourceToken.token,
      params: {
        page: page,
        limit: rowsPerPage,
        filteredDate: formikFilter.values.filteredDate,
        customerName: searchTerm,
      },
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setInvoices(res.data.responseData.invoices);
          setCount(res.data.responseData.documentCount);
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
  }, [formikFilter.values.filteredDate, page, rowsPerPage, searchTerm]);

  return (
    <CredPaymentsView
      headerLabels={headerLabels}
      invoices={invoices}
      totalPayments={totalPayments}
      isLoading={isLoading}
      isLoadingTotal={isLoadingTotal}
      setSelectedInvoice={setSelectedInvoice}
      searchTerm={searchTerm}
      handleSearchInputChange={handleSearchInputChange}
      formik={formik}
      isOpenUpdate={isOpenUpdate}
      isOpenDelete={isOpenDelete}
      isLoadingUpdate={isLoadingUpdate}
      isLoadingDelete={isLoadingDelete}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      handleOpenCloseDeleteDialog={handleOpenCloseDeleteDialog}
      handleSubmitUpdate={handleSubmitUpdate}
      handleSubmitDelete={handleSubmitDelete}
      handleFetchPayments={handleFetchPayments}
      formikFilter={formikFilter}
      page={page}
      count={count}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default CredPaymentsController;
