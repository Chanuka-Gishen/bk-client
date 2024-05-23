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
import { fDate } from 'src/utils/format-time';

const validationSchema = Yup.object().shape({
  bookName: Yup.string().required('Boook name is required'),
  bookType: Yup.string()
    .required('Boook type is required')
    .oneOf([INVOICE_TYPES.RANGE, INVOICE_TYPES.SINGLE], 'Invalid book invoice type'),
});

const validationSchemaInvoice = Yup.object().shape({
  invoiceNoFrom: Yup.number().required('From invoice no required').min(1),
  invoiceNoTo: Yup.number().required('To invoice no required').min(1),
  invoiceDescription: Yup.string().nullable,
  invoiceAmount: Yup.number().required('Amount is required').min(0),
  invoiceCreatedAt: Yup.date().required('Invoice date required'),
});

const validationSchemaInvoiceSingle = Yup.object().shape({
  invoiceNo: Yup.number().required('From invoice no required').min(1),
  invoiceDescription: Yup.string().nullable,
  invoiceAmount: Yup.number().required('Amount is required').min(0),
  invoiceCreatedAt: Yup.date().required('Invoice date required'),
});

const SalesBookController = () => {
  const invoiceHeadersRange = [
    'Invoice From',
    'Invoice To',
    'Description',
    'Invoiced Date',
    'Amount',
    'Action',
  ];
  const invoiceHeadersSingle = ['Invoice No', 'Description', 'Invoiced Date', 'Amount', 'Action'];

  const { enqueueSnackbar } = useSnackbar();
  const sourceToken = axios.CancelToken.source();

  const [page, setPage] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [salesBooks, setSalesBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [invoiceHeaders, setInvoiceHeaders] = useState(invoiceHeadersRange);
  const [invoices, setInvoices] = useState([]);
  const [invoiceStats, setInvoiceStats] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [downloadDate, setDownloadDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState(null);
  const [cashBalance, setCashBalance] = useState(0);

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
  const [isOpenUpdateInvoiceDialog, setIsOpenUpdateInvoiceDialogOpen] = useState(false);
  const [isOpenAddInvoiceDialog, setIsOpenAddInvoiceDialog] = useState(false);
  const [isOpenDeleteInvoiceDialog, setIsOpenDeleteInvoiceDialog] = useState(false);
  const [isOpenAddBulkInvDialog, setIsOpenAddBulkInvDialog] = useState(false);
  const [isOpenDownloadInvoice, setIsOpenDownloadInvoice] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isLoadingInvoicesStats, setIsLoadingInvoicesStats] = useState(true);
  const [isLoadingInvoiceAdd, setIsLoadingInvoiceAdd] = useState(false);
  const [isLoadingInvoiceUpdate, setIsLoadingInvoiceUpdate] = useState(false);
  const [isLoadingInvoiceDelete, setIsLoadingInvoiceDelete] = useState(false);
  const [isLoadingInvoiceBulk, setIsLoadingInvoiceBulk] = useState(false);
  const [isLoadingCashBalance, setIsLoadingCashBalance] = useState(true);
  const [isDownloadingInvoiceReport, setIsDownloadingInvoiceReport] = useState(false);

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
      invoiceDescription: '',
      invoiceAmount: 0,
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
      invoiceDescription: '',
      invoiceAmount: 0,
      invoiceCreatedAt: new Date(),
    },
    validationSchema: validationSchemaInvoiceSingle,
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

  const handleChangeDownloadDate = (date) => {
    setDownloadDate(new Date(date));
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
          invoiceAmount: selectedInvoice.invoiceAmount,
          invoiceCreatedAt: new Date(selectedInvoice.invoiceCreatedAt),
        });
      } else {
        formikInvoiceSingle.setValues({
          invoiceNo: selectedInvoice.invoiceNo,
          invoiceAmount: selectedInvoice.invoiceAmount,
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

  const handleOpenCloseDownloadReportDialog = () => {
    setIsOpenDownloadInvoice(!isOpenDownloadInvoice);

    if (isOpenDownloadInvoice) {
      setDownloadDate(new Date());
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
      // const date = new Date(formikFilter.values.filteredDate);
      // const dayAfter = formikFilter.values.filteredDate
      //   ? new Date(date.setDate(date.getDate() + 1))
      //   : null;

      setIsLoadingInvoices(true);

      await backendAuthApi({
        url: `${BACKEND_API.INVOICE_BY_BOOK + selectedBook._id}/${selectedBook.bookType}`,
        method: 'POST',
        params: {
          page: page,
          limit: rowsPerPage,
        },
        cancelToken: sourceToken.token,
        data: {
          filteredDate: formikFilter.values.filteredDate
            ? new Date(formikFilter.values.filteredDate)
            : null,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            setInvoices(res.data.responseData.invoices);
            setDocumentCount(res.data.responseData.documentCount);
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

  const handleFetchSalesBookStats = async () => {
    // const date = new Date(formikFilter.values.filteredDate);
    // const dayAfter = formikFilter.values.filteredDate
    //   ? new Date(date.setDate(date.getDate() + 1))
    //   : null;

    setIsLoadingInvoicesStats(true);

    await backendAuthApi({
      url: `${BACKEND_API.INVOICE_STATS_AMOUNT + selectedBook._id}/${selectedBook.bookType}`,
      method: 'POST',
      cancelToken: sourceToken.token,
      data: {
        filteredDate: formikFilter.values.filteredDate
          ? new Date(formikFilter.values.filteredDate)
          : null,
      },
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setInvoiceStats(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingInvoicesStats(false);
      })
      .finally(() => {
        setIsLoadingInvoicesStats(false);
      });
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
            handleFetchSalesBookStats();
            handleFetchCashBalance();
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
            handleFetchSalesBookStats();
            handleFetchCashBalance();
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
        url: `${BACKEND_API.INVOICE_DELETE}${selectedInvoice._id}/${selectedBook.bookType}`,
        method: 'DELETE',
        cancelToken: sourceToken.token,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseDeleteInvoiceDialog();
            handleFetchInvoices();
            handleFetchSalesBookStats();
            handleFetchCashBalance();
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
            handleFetchSalesBookStats();
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

  const handleDownloadInvoiceReport = async () => {
    setIsDownloadingInvoiceReport(true);

    try {
      if (downloadDate) {
        // Make a GET request to the endpoint that generates the PDF
        const response = await fetch(`${BACKEND_API.SBOOK_DOWNLOAD_SUM}?date=${downloadDate}`);

        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to download PDF');
        }

        // Convert the response data to a Blob
        const blob = await response.blob();

        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fDate(downloadDate)}-report.pdf`;
        document.body.appendChild(link);

        // Simulate a click on the link to trigger the download
        link.click();

        // Clean up: remove the link and revoke the temporary URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: SNACKBAR_VARIANT.ERROR });
      setIsDownloadingInvoiceReport(false);
    } finally {
      setIsDownloadingInvoiceReport(false);
    }
  };

  const handleFetchCashBalance = async () => {
    setIsLoadingCashBalance(true);

    await backendAuthApi({
      url: BACKEND_API.SBOOK_CASHB,
      method: 'POST',
      cancelToken: sourceToken.token,
      data: formikFilter.values,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setCashBalance(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingCashBalance(false);
      })
      .finally(() => {
        setIsLoadingCashBalance(false);
      });
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
    handleFetchCashBalance();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedBook) {
      handleFetchInvoices();
      handleFetchSalesBookStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook, formikFilter.values.filteredDate, page, rowsPerPage]);

  return (
    <SalesBookView
      bookType={selectedBook && selectedBook.bookType}
      isLoading={isLoading}
      salesBooks={salesBooks}
      cashBalance={cashBalance}
      isLoadingCashBalance={isLoadingCashBalance}
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
      invoiceStats={invoiceStats}
      isLoadingInvoicesStats={isLoadingInvoicesStats}
      setSelectedInvoice={setSelectedInvoice}
      formikFilter={formikFilter}
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
      documentCount={documentCount}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      downloadDate={downloadDate}
      isOpenDownloadInvoice={isOpenDownloadInvoice}
      handleOpenCloseDownloadReportDialog={handleOpenCloseDownloadReportDialog}
      isDownloadingInvoiceReport={isDownloadingInvoiceReport}
      handleChangeDownloadDate={handleChangeDownloadDate}
      handleDownloadInvoiceReport={handleDownloadInvoiceReport}
    />
  );
};

export default SalesBookController;
