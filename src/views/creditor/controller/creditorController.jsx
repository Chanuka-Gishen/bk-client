import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { CreditorView } from '../view/creditorView';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import { useSnackbar } from 'notistack';
import { SNACKBAR_MESSAGE, SNACKBAR_VARIANT } from 'src/constants/snackbarConstants';
import { NAVIGATION_ROUTES } from 'src/routes/constants/navigationRoutes';

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

const CreditorController = () => {
  const headerLabels = [
    'Creditor',
    'City/Town',
    'Code',
    'Credit Period',
    'Telephone No (Primary)',
    'Telephone No (Secondary)',
    'Created At',
  ];

  const sourceToken = axios.CancelToken.source();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [creditors, setCreditors] = useState([]);

  const [isOpenCreditorAdd, setIsOpenCreditorAdd] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreditorAdd, setIsLoadingCreditorAdd] = useState(false);

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

  const filteredData = creditors.filter((item) => {
    const name = item.creditorName.toLowerCase();
    const searchParamRegex = new RegExp(`^${searchTerm.toLowerCase()}`, 'i');
    return searchParamRegex.test(name);
  });

  const handleOpenCloseCreditorAdd = (data) => {
    setIsOpenCreditorAdd(!isOpenCreditorAdd);

    if (!isOpenCreditorAdd) {
      formik.resetForm();
    }
  };

  const handleOnClickRow = (data) => {
    navigate(NAVIGATION_ROUTES.creditors.details.base + data._id);
  };

  const handleAddCreditor = async () => {
    if (formik.isValid && formik.dirty) {
      setIsLoadingCreditorAdd(true);

      await backendAuthApi({
        url: BACKEND_API.CREDITOR_CREATE,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: formik.values,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleOpenCloseCreditorAdd(null);
            handleFetchCreditors();
          }
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        })
        .catch(() => {
          setIsLoadingCreditorAdd(false);
        })
        .finally(() => {
          setIsLoadingCreditorAdd(false);
        });
    } else {
      enqueueSnackbar(SNACKBAR_MESSAGE.FILL_REQUIRED_FIELDS, { variant: SNACKBAR_VARIANT.WARNING });
    }
  };

  const handleFetchCreditors = async () => {
    setIsLoading(true);

    await backendAuthApi({
      url: BACKEND_API.CREDITOR_LIST,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setCreditors(res.data.responseData);
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
    handleFetchCreditors();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CreditorView
      headerLabels={headerLabels}
      isLoading={isLoading}
      creditors={creditors}
      searchTerm={searchTerm}
      handleSearchInputChange={handleSearchInputChange}
      filteredData={filteredData}
      handleOnClickRow={handleOnClickRow}
      isOpenCreditorAdd={isOpenCreditorAdd}
      formik={formik}
      handleOpenCloseCreditorAdd={handleOpenCloseCreditorAdd}
      isLoadingCreditorAdd={isLoadingCreditorAdd}
      handleAddCreditor={handleAddCreditor}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

export default CreditorController;
