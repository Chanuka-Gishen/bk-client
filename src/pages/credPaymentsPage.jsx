import { Helmet } from 'react-helmet-async';
import { CredPayments } from 'src/views/creditorPayments';

// ----------------------------------------------------------------------

export default function CredPaymentsPage() {
  return (
    <>
      <Helmet>
        <title> Payments | GamageGroups </title>
      </Helmet>

      <CredPayments />
    </>
  );
}
