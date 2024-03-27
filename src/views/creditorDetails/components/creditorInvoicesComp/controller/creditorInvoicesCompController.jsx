import React, { useEffect, useState } from 'react';
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

const validationInvoiceUpdate = Yup.object().shape({
  credInvoiceNo: Yup.string().required('Invoice no is required'),
  credInvoiceDate: Yup.string().required('Invoiced Date is required'),
  credInvoiceAmount: Yup.number().required().min(0, 'Invoice amount is invalid'),
  credInvoicePaidDate: Yup.string().required('Invoice paid date is required'),
  credInvoiceStatus: Yup.string()
    .required('Status required')
    .oneOf([PAYMENT_STATUS.PAID, PAYMENT_STATUS.NOTPAID], 'Invalid Status'),
});

const CreditorInvoicesCompController = ({ id }) => {
  const headers = [
    'Invoice No',
    'Invoiced Date',
    'Invoice Due Date',
    'Invoice Paid Date',
    'Amount',
    'Invoice Status',
    'Actions',
  ];

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

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [open, setOpen] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const handleOpenMenu = (event, item) => {
    setSelectedInvoice(item);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setSelectedInvoice(null);
    setOpen(null);
  };

  const handleOpenCloseUpdateDialog = (data) => {
    setOpenUpdate(!openUpdate);

    if (openUpdate) {
      formik.resetForm();
      handleCloseMenu();
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

  const handleOpenCloseDeleteDialog = () => {
    setOpenDelete(!openDelete);

    if (openDelete) {
      setOpen(null);
    }
  };

  const handleUpdateInvoice = async () => {
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

  const handleDeleteInvoice = async () => {};

  const handleFetchCreditorInvoices = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.CREDITOR_INVOICES + id,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setInvoices(res.data.responseData);
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
    handleFetchCreditorInvoices();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CreditorInvoicesCompView
      isLoading={isLoading}
      headers={headers}
      invoices={invoices}
      open={open}
      handleOpenMenu={handleOpenMenu}
      handleCloseMenu={handleCloseMenu}
      openUpdate={openUpdate}
      formik={formik}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      isLoadingUpdate={isLoadingUpdate}
      handleUpdateInvoice={handleUpdateInvoice}
      openDelete={openDelete}
      isLoadingDelete={isLoadingDelete}
      handleOpenCloseDeleteDialog={handleOpenCloseDeleteDialog}
      handleDeleteInvoice={handleDeleteInvoice}
    />
  );
};

export default CreditorInvoicesCompController;
