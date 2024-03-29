import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { CreditorDetailsView } from '../view/creditorDetailsView';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import { useSnackbar } from 'notistack';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';

const validationSchema = Yup.object().shape({
  creditorName: Yup.string().required('Name is required'),
  creditorCity: Yup.string().required('City/town is required'),
  creditorOrganization: Yup.string(),
  creditorMobilePrimary: Yup.string().required('Mobile number is required'),
  creditorMobileSecondary: Yup.string(),
  creditorCreditPeriod: Yup.number()
    .required('Credit period is required')
    .min(0, 'Invalid no of days'),
});

const validationSchemaInvoice = Yup.object().shape({
  credInvoiceNo: Yup.string().required('Invoice no is required'),
  credInvoiceDate: Yup.string().required('Invoiced Date is required'),
  credInvoiceAmount: Yup.number().required().min(0, 'Invoice amount is invalid'),
});

const CreditorDetailsController = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const sourceToken = axios.CancelToken.source();

  const [creditor, setCreditor] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const [isOpenCreditorUpdate, setIsOpenCreditorUpdate] = useState(false);
  const [isOpenAddInvoice, setIsOpenAddInvoice] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isLoadingCreditorUpdate, setIsLoadingCreditorUpdate] = useState(false);
  const [isLoadingAddInvoice, setIsLoadingAddInvoice] = useState(false);

  const formik = useFormik({
    initialValues: {
      creditorName: '',
      creditorCity: '',
      creditorOrganization: '',
      creditorMobilePrimary: '',
      creditorMobileSecondary: '',
      creditorCreditPeriod: 30,
    },
    validationSchema,
    onSubmit: () => {
      null;
    },
  });

  const formikInvoice = useFormik({
    initialValues: {
      credInvoiceNo: '',
      credInvoiceDate: new Date(),
      credInvoiceAmount: 0,
    },
    validationSchema: validationSchemaInvoice,
    onSubmit: () => {
      null;
    },
  });

  const handleOpenCloseCreditorUpdate = () => {
    setIsOpenCreditorUpdate(!isOpenCreditorUpdate);

    if (isOpenCreditorUpdate) {
      formik.resetForm();
    } else {
      formik.setValues({
        creditorName: creditor.creditorName,
        creditorCity: creditor.creditorCity,
        creditorOrganization: creditor.creditorOrganization ? creditor.creditorOrganization : '',
        creditorMobilePrimary: creditor.creditorMobilePrimary,
        creditorMobileSecondary: creditor.creditorMobileSecondary
          ? creditor.creditorMobileSecondary
          : '',
        creditorCreditPeriod: 30,
      });
    }
  };

  const handleOpenCloseInvoiceDialog = () => {
    setIsOpenAddInvoice(!isOpenAddInvoice);

    if (!isOpenAddInvoice) {
      formikInvoice.resetForm();
    }
  };

  const handleUpdateCreditor = async () => {
    if (formik.isValid && formik.dirty) {
      setIsLoadingCreditorUpdate(true);

      await backendAuthApi({
        url: BACKEND_API.CREDITOR_UPDATE,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: {
          ...formik.values,
          id: creditor._id,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseCreditorUpdate(null);
            handleFetchCreditorDetails();
          }
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingCreditorUpdate(false);
        })
        .finally(() => {
          setIsLoadingCreditorUpdate(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleSubmitAddInvoice = async () => {
    if (formikInvoice.isValid && formikInvoice.dirty) {
      setIsLoadingAddInvoice(true);

      await backendAuthApi({
        url: BACKEND_API.CREDITOR_ADD_INVOICE,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: {
          creditorId: creditor._id,
          ...formikInvoice.values,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleFetchCreditorInvoices();
            handleOpenCloseInvoiceDialog();
          }

          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingAddInvoice(false);
        })
        .finally(() => {
          setIsLoadingAddInvoice(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleFetchCreditorInvoices = async () => {
    setIsLoadingInvoices(true);

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
        setIsLoadingInvoices(false);
      })
      .finally(() => {
        setIsLoadingInvoices(false);
      });
  };

  const handleFetchCreditorDetails = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.CREDITOR_DETAILS + id,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setCreditor(res.data.responseData);
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
    handleFetchCreditorDetails();

    handleFetchCreditorInvoices();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CreditorDetailsView
      id={id}
      creditor={creditor}
      isLoading={isLoading}
      isOpenAddInvoice={isOpenAddInvoice}
      formikInvoice={formikInvoice}
      isLoadingAddInvoice={isLoadingAddInvoice}
      isLoadingCreditorUpdate={isLoadingCreditorUpdate}
      handleOpenCloseInvoiceDialog={handleOpenCloseInvoiceDialog}
      handleOpenUpdateDialog={handleOpenCloseCreditorUpdate}
      handleSubmitAddInvoice={handleSubmitAddInvoice}
      handleUpdateCreditor={handleUpdateCreditor}
      formik={formik}
      handleOpenCloseCreditorUpdate={handleOpenCloseCreditorUpdate}
      isOpenCreditorUpdate={isOpenCreditorUpdate}
      invoices={invoices}
      isLoadingInvoices={isLoadingInvoices}
      handleFetchCreditorInvoices={handleFetchCreditorInvoices}
    />
  );
};

export default CreditorDetailsController;
