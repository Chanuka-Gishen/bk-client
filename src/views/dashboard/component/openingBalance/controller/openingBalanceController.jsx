import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { OpeningBalanceView } from '../view/openingBalanceView';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import responseUtil from 'src/utils/responseUtil';
import { useSnackbar } from 'notistack';
import commonUtil from 'src/utils/common-util';

const validationSchemaAdd = Yup.object().shape({
  cashBalanceDate: Yup.date().required(),
  openingBalance: Yup.number().required().min(0, 'Opening balance invalid'),
});

const validationSchemaUpdate = Yup.object().shape({
  openingBalance: Yup.number().required().min(0, 'Opening balance invalid'),
});

const OpeningBalanceController = () => {
  const headersCashBalances = ['Date', 'Opening Balance'];

  const { enqueueSnackbar } = useSnackbar();
  const sourceToken = axios.CancelToken.source();

  const [cashRecords, setCashRecords] = useState([]);
  const [selectedCashRecord, setSelectedCashRecord] = useState(null);

  const [openCashAdd, setOpenCashAdd] = useState(false);
  const [openCashUpdate, setOpenCashUpdate] = useState(false);
  const [openCashRefresh, setOpenCashRefresh] = useState(false);

  const [isLoadingCashBalance, setIsLoadingCashBalance] = useState(true);
  const [isLoadingCashAdd, setIsLoadingCashAdd] = useState(false);
  const [isLoadingCashUpdate, setIsLoadingCashUpdate] = useState(false);
  const [isLoadingCashRefresh, setIsLoadingCashRefresh] = useState(false);

  const formik = useFormik({
    initialValues: {
      cashBalanceDate: new Date(),
      openingBalance: 0,
    },
    validationSchema: validationSchemaAdd,
    onSubmit: () => {
      null;
    },
  });

  const formikCash = useFormik({
    initialValues: {
      openingBalance: 0,
    },
    validationSchema: validationSchemaUpdate,
    onSubmit: () => {
      null;
    },
  });

  const handleOpenCloseCashAdd = () => {
    setOpenCashAdd(!openCashAdd);

    if (openCashAdd) {
      formik.resetForm();
    }
  };

  const handleOpenCloseCashUpdate = (data) => {
    setOpenCashUpdate(!openCashUpdate);

    if (!openCashUpdate) {
      formikCash.setValues({
        openingBalance: data.openingBalance,
      });
    } else {
      formikCash.resetForm();
    }
  };

  const handleOpenCloseCashRefresh = () => {
    setOpenCashRefresh(!openCashRefresh);
  };

  const handleAddOpeningBalance = async () => {
    if (formik.isValid && formik.dirty) {
      setIsLoadingCashAdd(true);

      await backendAuthApi({
        url: BACKEND_API.CASHB_ADD,
        method: 'POST',
        cancelToken: sourceToken.token,
        data: formik.values,
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleFetchCashBalances();
            handleOpenCloseCashAdd();
          } else {
            enqueueSnackbar(res.data.responseMessage, {
              variant: responseUtil.findResponseType(res.data.responseCode),
            });
          }
        })
        .catch(() => {
          setIsLoadingCashAdd(false);
        })
        .finally(() => {
          setIsLoadingCashAdd(false);
        });
    }
  };

  const handleResetOpeningBalance = async () => {
    setIsLoadingCashRefresh(true);

    await backendAuthApi({
      url: BACKEND_API.CASHB_RESET + selectedCashRecord._id,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          handleOpenCloseCashRefresh();
          handleFetchCashBalances();
        } else {
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        }
      })
      .catch(() => {
        setIsLoadingCashRefresh(false);
      })
      .finally(() => {
        setIsLoadingCashRefresh(false);
      });
  };

  const handleUpdateOpeningCashBalance = async () => {
    commonUtil.validateFormik(formikCash);

    if (formikCash.isValid && formikCash.dirty) {
      setIsLoadingCashUpdate(true);

      await backendAuthApi({
        url: BACKEND_API.CASHB_UPDATE,
        method: 'PUT',
        cancelToken: sourceToken.token,
        data: {
          id: selectedCashRecord._id,
          ...formikCash.values,
        },
      })
        .then((res) => {
          if (responseUtil.isResponseSuccess(res.data.responseCode)) {
            handleFetchCashBalances();
            handleOpenCloseCashUpdate();
          } else {
            enqueueSnackbar(res.data.responseMessage, {
              variant: responseUtil.findResponseType(res.data.responseCode),
            });
          }
        })
        .catch(() => {
          setIsLoadingCashUpdate(false);
        })
        .finally(() => {
          setIsLoadingCashUpdate(false);
        });
    }
  };

  const handleFetchCashBalances = async () => {
    setIsLoadingCashBalance(true);

    await backendAuthApi({
      url: BACKEND_API.CASHB_GET_RECENT,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (responseUtil.isResponseSuccess(res.data.responseCode)) {
          setCashRecords(res.data.responseData);
        }
      })
      .catch(() => {
        setIsLoadingCashBalance(false);
      })
      .finally(() => {
        setIsLoadingCashBalance(false);
      });
  };

  useEffect(() => {
    handleFetchCashBalances();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OpeningBalanceView
      isLoadingCashBalance={isLoadingCashBalance}
      cashRecords={cashRecords}
      headersCashBalances={headersCashBalances}
      setSelectedCashRecord={setSelectedCashRecord}
      openCashAdd={openCashAdd}
      isLoadingCashAdd={isLoadingCashAdd}
      handleOpenCloseCashAdd={handleOpenCloseCashAdd}
      handleAddOpeningBalance={handleAddOpeningBalance}
      formik={formik}
      formikCash={formikCash}
      openCashUpdate={openCashUpdate}
      isLoadingCashUpdate={isLoadingCashUpdate}
      handleOpenCloseCashUpdate={handleOpenCloseCashUpdate}
      handleUpdateOpeningCashBalance={handleUpdateOpeningCashBalance}
      openCashRefresh={openCashRefresh}
      isLoadingCashRefresh={isLoadingCashRefresh}
      handleOpenCloseCashRefresh={handleOpenCloseCashRefresh}
      handleResetOpeningBalance={handleResetOpeningBalance}
    />
  );
};

export default OpeningBalanceController;
