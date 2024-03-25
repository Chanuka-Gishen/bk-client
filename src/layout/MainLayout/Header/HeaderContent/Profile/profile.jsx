import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';

// assets
import { LogoutOutlined } from '@ant-design/icons';
import MainCard from 'src/components/mainCard';
import Transitions from 'src/components/@extended/transitions';
import { backendAuthApi } from 'src/axios/instance/backend-axios-instance';
import { BACKEND_API } from 'src/axios/constant/backend-api';
import axios from 'axios';
import responseUtil from 'src/utils/responseUtil';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import authAction from 'src/store/action/authAction';

const Profile = () => {
  const iconBackColorOpen = 'grey.300';

  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const { enqueueSnackbar } = useSnackbar();
  const sourceToken = axios.CancelToken.source();

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async () => {
    setIsloading(true);

    await backendAuthApi({
      url: BACKEND_API.LOGOUT,
      method: 'GET',
      cancelToken: sourceToken.token,
    })
      .then((res) => {
        if (!responseUtil.isResponseSuccess(res.data.responseCode)) {
          enqueueSnackbar(res.data.responseMessage, {
            variant: responseUtil.findResponseType(res.data.responseCode),
          });
        }
        handleToggle();
        dispatch(authAction.logoutUser());
      })
      .catch(() => {
        setIsloading(false);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar
            alt="profile user"
            src={'/assets/images/avatars/avatar_25.jpg'}
            sx={{ width: 32, height: 32 }}
          />
          <Typography variant="subtitle1">{user.name}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250,
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar
                              alt="profile user"
                              src={'/assets/images/avatars/avatar_25.jpg'}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Stack>
                              <Typography variant="h7">{user.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {user.userRole.toUpperCase()}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton
                            size="large"
                            color="secondary"
                            onClick={handleLogout}
                            disabled={isLoading}
                            sx={{
                              '&:hover': {
                                '& svg': {
                                  color: 'red', // Change the color of the SVG icon to red on hover
                                },
                              },
                            }}
                          >
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
