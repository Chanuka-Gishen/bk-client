import { Helmet } from 'react-helmet-async';
import { Creditor } from 'src/views/creditor';

// ----------------------------------------------------------------------

export default function CreditorsPage() {
  return (
    <>
      <Helmet>
        <title> Creditors | GamageGroups </title>
      </Helmet>

      <Creditor />
    </>
  );
}
