import { Helmet } from 'react-helmet-async';
import { Users } from 'src/views/user';

// ----------------------------------------------------------------------

export default function EmployeesPage() {
  return (
    <>
      <Helmet>
        <title> Employees | EREngineers </title>
      </Helmet>

      <Users />
    </>
  );
}
