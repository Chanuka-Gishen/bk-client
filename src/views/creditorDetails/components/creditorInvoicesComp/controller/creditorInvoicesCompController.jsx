import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CreditorInvoicesCompView } from '../view/creditorInvoicesCompView';
import { PAYMENT_STATUS } from 'src/constants/commonConstants';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import commonUtil from 'src/utils/common-util';

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

const CreditorInvoicesCompController = ({
  id,
  isLoading,
  invoices,
  handleFetchCreditorInvoices,
}) => {
  const headers = [
    'Invoice No',
    'Invoiced Date',
    'Invoice Due Date',
    'Invoice Paid Date',
    'Amount',
    'Amount Balance',
    'Invoice Status',
    'Actions',
  ];

  const headersPayments = ['Invoice No', 'Paid Amount', 'Paid Date'];

  const { enqueueSnackbar } = useSnackbar();
  const sourceToken = axios.CancelToken.source();

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddPayment, setOpenAddPayment] = useState(false);

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingAddPayment, setIsLoadingAddPayment] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenCloseUpdateDialog = (data) => {
    setOpenUpdate(!openUpdate);

    if (openUpdate) {
      formik.resetForm();
    } else {
      formik.setValues({
        credInvoiceNo: data.credInvoiceNo,
        credInvoiceAmount: data.credInvoiceAmount,
        credInvoiceDate: new Date(data.credInvoiceDate),
        credInvoicePaidDate: data.credInvoicePaidDate
          ? new Date(data.credInvoicePaidDate)
          : new Date(),
        credInvoiceStatus: data.credInvoiceStatus,
      });
    }
  };

  const handleOpenCloseAddPaymentDialog = () => {
    setOpenAddPayment(!openAddPayment);

    if (!openAddPayment) {
      formikPayInvoice.resetForm();
    }
  };

  const handleOpenCloseDeleteDialog = () => {
    setOpenDelete(!openDelete);
  };

  const handleUpdateInvoice = async () => {
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
            handleFetchCreditorInvoices();
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

  const handleDeleteInvoice = async () => {
    setIsLoadingDelete(true);

    await backendAuthApi({
      url: BACKEND_API.CREDITOR_DELETE_INVOICE + selectedInvoice._id,
      method: 'DELETE',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          handleOpenCloseDeleteDialog();
          handleFetchCreditorInvoices();
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

  const handleAddPayment = async () => {
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
            handleOpenCloseAddPaymentDialog(null);
            handleFetchCreditorInvoices();
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

  return (
    <CreditorInvoicesCompView
      isLoading={isLoading}
      headers={headers}
      headersPayments={headersPayments}
      invoices={invoices}
      setSelectedInvoice={setSelectedInvoice}
      openUpdate={openUpdate}
      formik={formik}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      isLoadingUpdate={isLoadingUpdate}
      handleUpdateInvoice={handleUpdateInvoice}
      openDelete={openDelete}
      isLoadingDelete={isLoadingDelete}
      handleOpenCloseDeleteDialog={handleOpenCloseDeleteDialog}
      handleDeleteInvoice={handleDeleteInvoice}
      openAddPayment={openAddPayment}
      isLoadingAddPayment={isLoadingAddPayment}
      formikPayInvoice={formikPayInvoice}
      handleOpenCloseAddPaymentDialog={handleOpenCloseAddPaymentDialog}
      handleAddPayment={handleAddPayment}
      handleFetchCreditorInvoices={handleFetchCreditorInvoices}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default CreditorInvoicesCompController;
