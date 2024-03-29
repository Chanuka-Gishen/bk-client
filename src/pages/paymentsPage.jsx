import { Helmet } from 'react-helmet-async';
import { Payments } from 'src/views/payments';

// ----------------------------------------------------------------------

export default function PaymentsPage() {
  return (
    <>
      <Helmet>
        <title> Payments | BookKeep </title>
      </Helmet>

      <Payments />
    </>
  );
}
