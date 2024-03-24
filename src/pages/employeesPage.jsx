import { Helmet } from 'react-helmet-async';
import { Users } from 'src/views/user';

// ----------------------------------------------------------------------

export default function EmployeesPage() {
  return (
    <>
      <Helmet>
        <title> Employees | BookKeep </title>
      </Helmet>

      <Users />
    </>
  );
}
