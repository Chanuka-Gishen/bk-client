import React from 'react';
import { CreditorInforCompView } from '../view/creditorInfoComp';

const CreditorInfoController = ({ creditor, isLoading }) => {
  return <CreditorInforCompView creditor={creditor} isLoading={isLoading} />;
};

export default CreditorInfoController;
