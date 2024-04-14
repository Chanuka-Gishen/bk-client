import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { SalesBookView } from '../view/SalesBookView';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';
import { INVOICE_TYPES } from 'src/constants/invoiceTypeConstants';
import commonUtil from 'src/utils/common-util';

const validationSchema = Yup.object().shape({
  bookName: Yup.string().required('Boook name is required'),
  bookType: Yup.string()
    .required('Boook type is required')
    .oneOf([INVOICE_TYPES.RANGE, INVOICE_TYPES.SINGLE], 'Invalid book invoice type'),
});

const validationSchemaInvoice = Yup.object().shape({
  invoiceNoFrom: Yup.number().required('From invoice no required').min(1),
  invoiceNoTo: Yup.number().required('To invoice no required').min(1),
  invoiceInAmount: Yup.number().required('Amount in required').min(0),
  invoiceOutAmount: Yup.number().required('Amount out required').min(0),
  invoiceCreatedAt: Yup.date().required('Invoice date required'),
});

const validationSchemaInvoiceSingle = Yup.object().shape({
  invoiceNo: Yup.number().required('From invoice no required').min(1),
  invoiceInAmount: Yup.number().required('Amount in required').min(0),
  invoiceOutAmount: Yup.number().required('Amount out required').min(0),
  invoiceCreatedAt: Yup.date().required('Invoice date required'),
});

const SalesBookController = () => {
  const invoiceHeadersRange = [
    'Invoice From',
    'Invoice To',
    'Invoiced Date',
    'Amount In',
    'Amount Out',
    'Action',
  ];
  const invoiceHeadersSingle = ['Invoice No', 'Invoiced Date', 'Amount In', 'Amount Out', 'Action'];

  const { enqueueSnackbar } = useSnackbar();
  const sourceToken = axios.CancelToken.source();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [salesBooks, setSalesBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [invoiceHeaders, setInvoiceHeaders] = useState(invoiceHeadersRange);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
  const [isOpenUpdateInvoiceDialog, setIsOpenUpdateInvoiceDialogOpen] = useState(false);
  const [isOpenAddInvoiceDialog, setIsOpenAddInvoiceDialog] = useState(false);
  const [isOpenDeleteInvoiceDialog, setIsOpenDeleteInvoiceDialog] = useState(false);
  const [isOpenAddBulkInvDialog, setIsOpenAddBulkInvDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isLoadingInvoiceAdd, setIsLoadingInvoiceAdd] = useState(false);
  const [isLoadingInvoiceUpdate, setIsLoadingInvoiceUpdate] = useState(false);
  const [isLoadingInvoiceDelete, setIsLoadingInvoiceDelete] = useState(false);
  const [isLoadingInvoiceBulk, setIsLoadingInvoiceBulk] = useState(false);

  const formik = useFormik({
    initialValues: {
      bookName: '',
      bookType: INVOICE_TYPES.RANGE,
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      null;
    },
  });

  const formikInvoice = useFormik({
    initialValues: {
      invoiceNoFrom: 1,
      invoiceNoTo: 1,
      invoiceInAmount: 0,
      invoiceOutAmount: 0,
      invoiceCreatedAt: new Date(),
    },
    validationSchema: validationSchemaInvoice,
    onSubmit: () => {
      null;
    },
  });

  const formikInvoiceSingle = useFormik({
    initialValues: {
      invoiceNo: 1,
      invoiceInAmount: 0,
      invoiceOutAmount: 0,
      invoiceCreatedAt: new Date(),
    },
    validationSchema: validationSchemaInvoiceSingle,
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

  const handleOpenCloseCreateDialog = () => {
    setIsOpenCreateDialog(!isOpenCreateDialog);

    if (isOpenCreateDialog) {
      formik.resetForm();
    }
  };

  const handleOpenCloseUpdateDialog = () => {
    setIsOpenUpdateDialog(!isOpenUpdateDialog);

    if (isOpenUpdateDialog) {
      formik.resetForm();
    } else {
      formik.setValues({
        bookName: selectedBook.bookName,
      });
    }
  };

  const handleSelectBook = (book) => {
    if (selectedBook && book._id === selectedBook._id) {
      setSelectedBook(null);
    } else {
      setSelectedBook(book);
      setInvoiceHeaders(
        book.bookType === INVOICE_TYPES.RANGE ? invoiceHeadersRange : invoiceHeadersSingle
      );
    }
  };

  const handleOpenCloseAddInvoiceDialog = async () => {
    setIsOpenAddInvoiceDialog(!isOpenAddInvoiceDialog);

    if (isOpenAddInvoiceDialog) {
      if (selectedBook.bookType === INVOICE_TYPES.RANGE) {
        formikInvoice.resetForm();
      } else {
        formikInvoiceSingle.resetForm();
      }
    }
  };

  const handleOpenCloseUpdateInvoiceDialog = async () => {
    setIsOpenUpdateInvoiceDialogOpen(!isOpenUpdateInvoiceDialog);

    if (isOpenUpdateInvoiceDialog) {
      if (selectedBook.bookType === INVOICE_TYPES.RANGE) {
        formikInvoice.resetForm();
      } else {
        formikInvoiceSingle.resetForm();
      }
    } else {
      if (selectedBook.bookType === INVOICE_TYPES.RANGE) {
        formikInvoice.setValues({
          invoiceNoFrom: selectedInvoice.invoiceNoFrom,
          invoiceNoTo: selectedInvoice.invoiceNoTo,
          invoiceInAmount: selectedInvoice.invoiceInAmount,
          invoiceOutAmount: selectedInvoice.invoiceOutAmount,
          invoiceCreatedAt: new Date(selectedInvoice.invoiceCreatedAt),
        });
      } else {
        formikInvoiceSingle.setValues({
          invoiceNo: selectedInvoice.invoiceNo,
          invoiceInAmount: selectedInvoice.invoiceInAmount,
          invoiceOutAmount: selectedInvoice.invoiceOutAmount,
          invoiceCreatedAt: new Date(selectedInvoice.invoiceCreatedAt),
        });
      }
    }
  };

  const handleOpenCloseDeleteInvoiceDialog = () => {
    setIsOpenDeleteInvoiceDialog(!isOpenDeleteInvoiceDialog);
  };

  const handleOpenCloseAddBulkInvDialog = () => {
    setIsOpenAddBulkInvDialog(!isOpenAddBulkInvDialog);

    if (isOpenAddBulkInvDialog) {
      setSelectedFile(null);
    }
  };

  const handleCreateSalesBook = async () => {
    commonUtil.validateFormik(formik);
    if (formik.isValid && formik.dirty) {
      setIsLoadingCreate(true);

      await backendAuthApi({
        url: BACKEND_API.SBOOK_CREATE,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: formik.values,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseCreateDialog();
            handleFetchSalesBooks();
          }

          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingCreate(false);
        })
        .finally(() => {
          setIsLoadingCreate(false);
        });
    }
  };

  const handleFetchInvoices = async () => {
    if (selectedBook) {
      setIsLoadingInvoices(true);

      await backendAuthApi({
        url: `${BACKEND_API.INVOICE_BY_BOOK + selectedBook._id}/${selectedBook.bookType}`,
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
    }
  };

  const handleUpdateSalesBook = async () => {
    commonUtil.validateFormik(formik);
    if (selectedBook && formik.isValid && formik.dirty) {
      setIsLoadingUpdate(false);

      await backendAuthApi({
        url: BACKEND_API.SBOOK_UPDATE,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: {
          bookId: selectedBook._id,
          ...formik.values,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleFetchSalesBooks();
            setSelectedBook(res.data.responseData);
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
          handleOpenCloseUpdateDialog();
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleAddInvoice = async () => {
    const valid =
      selectedBook.bookType === INVOICE_TYPES.RANGE
        ? Boolean(formikInvoice.isValid && formikInvoice.dirty)
        : Boolean(formikInvoiceSingle.isValid && formikInvoiceSingle.dirty);

    commonUtil.validateFormik(
      selectedBook.bookType === INVOICE_TYPES.RANGE ? formikInvoice : formikInvoiceSingle
    );

    const data =
      selectedBook.bookType === INVOICE_TYPES.RANGE
        ? { bookId: selectedBook._id, ...formikInvoice.values }
        : { bookId: selectedBook._id, ...formikInvoiceSingle.values };

    if (valid) {
      setIsLoadingInvoiceAdd(true);

      await backendAuthApi({
        url:
          selectedBook.bookType === INVOICE_TYPES.RANGE
            ? BACKEND_API.INVOICE_CREATE_RANGE
            : BACKEND_API.INVOICE_CREATE_SINGLE,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: data,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseAddInvoiceDialog();
            handleFetchInvoices();
          }
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingInvoiceAdd(false);
        })
        .finally(() => {
          setIsLoadingInvoiceAdd(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleUpdateInvoice = async () => {
    const valid =
      selectedBook.bookType === INVOICE_TYPES.RANGE
        ? Boolean(formikInvoice.isValid && formikInvoice.dirty)
        : Boolean(formikInvoiceSingle.isValid && formikInvoiceSingle.dirty);

    commonUtil.validateFormik(
      selectedBook.bookType === INVOICE_TYPES.RANGE ? formikInvoice : formikInvoiceSingle
    );

    const data =
      selectedBook.bookType === INVOICE_TYPES.RANGE
        ? { invoiceId: selectedInvoice._id, ...formikInvoice.values }
        : { invoiceId: selectedInvoice._id, ...formikInvoiceSingle.values };

    if (valid) {
      setIsLoadingInvoiceUpdate(true);

      await backendAuthApi({
        url: BACKEND_API.INVOICE_UPDATE + selectedBook.bookType,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: data,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseUpdateInvoiceDialog();
            handleFetchInvoices();
          }
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingInvoiceUpdate(false);
        })
        .finally(() => {
          setIsLoadingInvoiceUpdate(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleDeleteInvoice = async () => {
    if (selectedInvoice) {
      setIsLoadingInvoiceDelete(true);

      await backendAuthApi({
        url: BACKEND_API.INVOICE_DELETE + selectedInvoice._id,
        method: 'DELETE',
        cancelToken: sourceToken.token,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseDeleteInvoiceDialog();
            handleFetchInvoices();
          }
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingInvoiceDelete(false);
        })
        .finally(() => {
          setIsLoadingInvoiceDelete(false);
        });
    }
  };

  const handleAddBulkFiles = async () => {
    if (selectedFile) {
      setIsLoadingInvoiceBulk(true);

      const formData = new FormData();
      formData.append('file', selectedFile);

      await backendAuthApi({
        url: BACKEND_API.INVOICE_BULK + selectedBook._id,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: sourceToken.token,
        data: formData,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseAddBulkInvDialog();
            handleFetchInvoices();
          }
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingInvoiceBulk(false);
        })
        .finally(() => {
          setIsLoadingInvoiceBulk(false);
        });
    }
  };

  const handleFetchSalesBooks = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.SBOOK_GET_ALL,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setSalesBooks(res.data.responseData);
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
    handleFetchSalesBooks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedBook) {
      handleFetchInvoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook]);

  return (
    <SalesBookView
      bookType={selectedBook && selectedBook.bookType}
      isLoading={isLoading}
      salesBooks={salesBooks}
      isOpenCreateDialog={isOpenCreateDialog}
      isLoadingCreate={isLoadingCreate}
      formik={formik}
      handleOpenCloseCreateDialog={handleOpenCloseCreateDialog}
      handleCreateSalesBook={handleCreateSalesBook}
      selectedBook={selectedBook}
      handleSelectBook={handleSelectBook}
      isOpenUpdateDialog={isOpenUpdateDialog}
      handleOpenCloseUpdateDialog={handleOpenCloseUpdateDialog}
      isLoadingUpdate={isLoadingUpdate}
      handleUpdateSalesBook={handleUpdateSalesBook}
      invoiceHeaders={invoiceHeaders}
      isLoadingInvoices={isLoadingInvoices}
      invoices={invoices}
      setSelectedInvoice={setSelectedInvoice}
      formikInvoice={formikInvoice}
      formikInvoiceSingle={formikInvoiceSingle}
      isOpenAddInvoiceDialog={isOpenAddInvoiceDialog}
      isOpenUpdateInvoiceDialog={isOpenUpdateInvoiceDialog}
      isOpenDeleteInvoiceDialog={isOpenDeleteInvoiceDialog}
      handleOpenCloseAddInvoiceDialog={handleOpenCloseAddInvoiceDialog}
      handleOpenCloseUpdateInvoiceDialog={handleOpenCloseUpdateInvoiceDialog}
      handleOpenCloseDeleteInvoiceDialog={handleOpenCloseDeleteInvoiceDialog}
      handleAddInvoice={handleAddInvoice}
      handleUpdateInvoice={handleUpdateInvoice}
      handleDeleteInvoice={handleDeleteInvoice}
      isLoadingInvoiceAdd={isLoadingInvoiceAdd}
      isLoadingInvoiceUpdate={isLoadingInvoiceUpdate}
      isLoadingInvoiceDelete={isLoadingInvoiceDelete}
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
      isOpenAddBulkInvDialog={isOpenAddBulkInvDialog}
      isLoadingInvoiceBulk={isLoadingInvoiceBulk}
      handleOpenCloseAddBulkInvDialog={handleOpenCloseAddBulkInvDialog}
      handleAddBulkFiles={handleAddBulkFiles}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default SalesBookController;
