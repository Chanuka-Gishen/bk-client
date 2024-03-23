import { createRef } from 'react';

import Routes from './routes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { SnackbarProvider } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import SnackbarNotifier from './common/service/snackbar-notifier';
import ThemeProvider from './themes';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  // Dismiss Action to all snackbars
  const notistackRef = createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider>
        <SnackbarProvider
          dense
          preventDuplicate
          ref={notistackRef}
          action={(key) => (
            <IconButton aria-label="dismiss" size="small" onClick={onClickDismiss(key)}>
              <CloseIcon fontSize="inherit" color={'action'} />
            </IconButton>
          )}
        >
          <SnackbarNotifier />
          <Routes />
        </SnackbarProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
