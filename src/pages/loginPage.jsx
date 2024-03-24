import { Helmet } from 'react-helmet-async';
import { LoginView } from 'src/views/authentication/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | BookKeep </title>
      </Helmet>

      <LoginView />
    </>
  );
}
