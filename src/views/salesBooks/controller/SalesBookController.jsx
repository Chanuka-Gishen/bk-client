import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { SalesBookView } from '../view/SalesBookView';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';

const validationSchema = Yup.object().shape({
  bookName: Yup.string().required('Boook name is required'),
});

const SalesBookController = () => {
  const { enqueueSnackbar } = useSnackbar();
  const sourceToken = axios.CancelToken.source();

  const [salesBooks, setSalesBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const formik = useFormik({
    initialValues: {
      bookName: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      null;
    },
  });

  const handleOpenCloseCreateDialog = () => {
    setIsOpenCreateDialog(!isOpenCreateDialog);

    if (isOpenCreateDialog) {
      formik.resetForm();
    }
  };

  const handleSelectBook = (book) => {
    if (selectedBook && book._id === selectedBook._id) {
      setSelectedBook(null);
    } else {
      setSelectedBook(book);
    }
  };

  const handleCreateSalesBook = async () => {
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

  return (
    <SalesBookView
      isLoading={isLoading}
      salesBooks={salesBooks}
      isOpenCreateDialog={isOpenCreateDialog}
      isLoadingCreate={isLoadingCreate}
      formik={formik}
      handleOpenCloseCreateDialog={handleOpenCloseCreateDialog}
      handleCreateSalesBook={handleCreateSalesBook}
      selectedBook={selectedBook}
      handleSelectBook={handleSelectBook}
    />
  );
};

export default SalesBookController;
