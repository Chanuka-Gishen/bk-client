import { Helmet } from 'react-helmet-async';
import { SalesBook } from 'src/views/salesBooks';

// ----------------------------------------------------------------------

export default function SalesBooksPage() {
  return (
    <>
      <Helmet>
        <title> SalesBooks | GamageGroups </title>
      </Helmet>

      <SalesBook />
    </>
  );
}
