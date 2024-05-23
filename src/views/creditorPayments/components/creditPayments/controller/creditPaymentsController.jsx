import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { BACKEND_API } from 'src/axios/constant/backend-api';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import responseUtil from 'src/utils/responseUtil';
import { CreditPaymentsView } from '../view/creditPaymentsView';
import commonUtil from 'src/utils/common-util';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';

const validationSchema = Yup.object().shape({
  invoiceNo: Yup.string().required('Invoice no is required'),
  invoiceAmount: Yup.number().required().min(0, 'Invoice amount is invalid'),
  invoiceCreatedAt: Yup.string().required('Invoice created date is required'),
});

const CreditPaymentsController = ({ id, open, handleFetch }) => {
  const sourceToken = axios.CancelToken.source();
  const { enqueueSnackbar } = useSnackbar();

  const headers = ['Invoice No', 'Paid Amount', 'Paid Date'];

  const [payments, setPayments] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
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

  const handleOpenCloseUpdateDialog = (data) => {
    setOpenUpdate(!openUpdate);

    if (!openUpdate) {
      setSelectedInvoice(data);
      formik.setValues({
        invoiceNo: data.invoiceNo,
        invoiceAmount: data.invoiceAmount,
        invoiceCreatedAt: new Date(data.invoiceCreatedAt),
      });
    } else {
      setSelectedInvoice(null);
      formik.resetForm();
    }
  };

  const handleOpenCloseDeleteDialog = (data) => {
    setOpenDelete(!openDelete);

    if (!openDelete) {
      setSelectedInvoice(data);
    } else {
      setSelectedInvoice(null);
    }
  };

  const handleUpdatePayment = async () => {
    if (setSelectedInvoice) {
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
              handleFetch();
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
    }
  };

  const handleDeletePayment = async () => {
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
            handleFetch();
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

  const handleFetchPayments = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.CRED_PAYMENT_INVOICES + id,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setPayments(res.data.responseData);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CreditPaymentsView
      headers={headers}
      open={open}
      payments={payments}
      isLoading={isLoading}
      formik={formik}
      openUpdate={openUpdate}
      openDelete={openDelete}
      isLoadingUpdate={isLoadingUpdate}
      isLoadingDelete={isLoadingDelete}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      handleOpenCloseDeleteDialog={handleOpenCloseDeleteDialog}
      handleUpdatePayment={handleUpdatePayment}
      handleDeletePayment={handleDeletePayment}
    />
  );
};

export default CreditPaymentsController;
