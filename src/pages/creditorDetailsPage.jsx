import { Helmet } from 'react-helmet-async';
import { CreditorDetails } from 'src/views/creditorDetails';

// ----------------------------------------------------------------------

export default function CreditorDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Creditors Details | GamageGroups </title>
      </Helmet>

      <CreditorDetails />
    </>
  );
}
