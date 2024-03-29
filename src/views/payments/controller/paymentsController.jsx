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

const validationSchema = Yup.object().shape({
  paymentDescription: Yup.string().required('Description is required'),
  paymentAmount: Yup.number().required('Amount is required').min(0),
  paymentDate: Yup.date().required('Date is required'),
});

const PaymentsController = () => {
  const headerLabels = ['Description', 'Amount', 'Date'];

  const sourceToken = axios.CancelToken.source();
  const { enqueueSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
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

  const filteredData = invoices.filter((item) => {
    const name = item.paymentDescription.toLowerCase();
    const searchParamRegex = new RegExp(`${searchTerm.toLowerCase()}`, 'i');
    return searchParamRegex.test(name);
  });

  const handleOpenCloseAddDialog = () => {
    setIsOpenAdd(!isOpenAdd);

    if (!isOpenAdd) {
      formik.resetForm();
    }
  };

  const handleOpenCloseUpdateDialog = () => {
    setIsOpenUpdate(!isOpenUpdate);

    if (!isOpenUpdate) {
      formik.setValues({
        paymentDescription: selectedInvoice.paymentDescription,
        paymentAmount: selectedInvoice.paymentAmount,
        paymentDate: new Date(selectedInvoice.paymentDate),
      });
    } else {
      formik.resetForm();
    }
  };

  const handleOpenCloseDeleteDialog = () => {
    setIsOpenDelete(!isOpenDelete);
  };

  const handleSubmitAdd = async () => {
    if (formik.dirty && formik.isValid) {
      setIsLoadingAdd(true);

      await backendAuthApi({
        url: BACKEND_API.PAYMENT_ADD,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: formik.values,
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
          setIsLoadingAdd(false);
        })
        .finally(() => {
          setIsLoadingAdd(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleSubmitUpdate = async () => {
    if (formik.dirty && formik.isValid) {
      setIsLoadingUpdate(true);

      await backendAuthApi({
        url: BACKEND_API.PAYMENT_UPDATE,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: {
          id: selectedInvoice._id,
          ...formik.values,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseUpdateDialog();
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
    if (selectedInvoice) {
      setIsLoadingDelete(true);

      await backendAuthApi({
        url: BACKEND_API.PAYMENT_DELETE + selectedInvoice._id,
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
    }
  };

  const handleFetchPayments = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.PAYMENTS,
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
    handleFetchPayments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaymentsView
      headerLabels={headerLabels}
      invoices={invoices}
      isLoading={isLoading}
      setSelectedInvoice={setSelectedInvoice}
      searchTerm={searchTerm}
      handleSearchInputChange={handleSearchInputChange}
      filteredData={filteredData}
      formik={formik}
      isOpenAdd={isOpenAdd}
      isOpenUpdate={isOpenUpdate}
      isOpenDelete={isOpenDelete}
      isLoadingAdd={isLoadingAdd}
      isLoadingUpdate={isLoadingUpdate}
      isLoadingDelete={isLoadingDelete}
      handleOpenCloseAddDialog={handleOpenCloseAddDialog}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      handleOpenCloseDeleteDialog={handleOpenCloseDeleteDialog}
      handleSubmitAdd={handleSubmitAdd}
      handleSubmitUpdate={handleSubmitUpdate}
      handleSubmitDelete={handleSubmitDelete}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default PaymentsController;
