import React, { useEffect, useState } from 'react';
import { CreditorDetailsView } from '../view/creditorDetailsView';
import { useParams } from 'react-router-dom';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import axios from 'axios';
import responseUtil from 'src/utils/responseUtil';

const CreditorDetailsController = () => {
  const { id } = useParams();
  const sourceToken = axios.CancelToken.source();

  const [creditor, setCreditor] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <CreditorDetailsView id={id} creditor={creditor} isLoading={isLoading} />;
};

export default CreditorDetailsController;
