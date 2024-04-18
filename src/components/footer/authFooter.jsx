// material-ui
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'space-between'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          &copy; Product By&nbsp;
          <Typography
            component={Link}
            variant="subtitle2"
            href="www.zenxbyte.com"
            target="_blank"
            underline="hover"
          >
            Zenxbyte
          </Typography>
        </Typography>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
