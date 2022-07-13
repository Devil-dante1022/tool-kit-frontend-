import React, { Fragment, useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router'

import {
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
;
import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
;
import Grid from "@mui/material/Grid";
import PageInfo from "@components/PageContainer/PageInfo";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const profile = () => {
  const router = useRouter();

  // For Ticker mode

  // For alert message
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>(``);
  const [messageSeverity, setMessageSeverity] = useState<AlertColor>(`success`);
  const closeMessage = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsShowMessage(false);
  };

  // For loading
  const [showLoading, setShowLoading] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
      }
      catch (err) {

      }
    })()
  }, [])

  return (
    <Box component={`main`} >
      <PageInfo />
      <Box
        sx={{
          display: `flex`,
          alignItems: `stretch`,
          justifyContent: `space-between`,
          borderBottomRightRadius: 90,
          width: {
            lg: `92%`,
            xl: `92%`
          },
          mx: `auto`,
          background: `none`,
          overflow: `hidden`,
          position: `relative`
        }}
      >
        <Grid container alignItems={`stretch`} justifyContent={`space-between`} spacing={3} my={4} >
          <Grid
            item
            lg={4}
            md={4}
            sm={4}
          >
            <Stack
              direction={`column`}
              alignItems={`stretch`}
              justifyContent={`space-between`}
              spacing={1}
            >
              <Box component={`div`} sx={{ background: theme => theme.palette.background.paper }}>
                <Typography variant={`h6`} sx={{ px: 4, py: 2 }}>Wallets</Typography>
              </Box>

              <Box
                sx={{
                  background: theme => theme.palette.background.default,
                  minHeight: `100vh`,
                  maxHeight: `100vh`,
                  overflow: `auto`
                }}
              >
                {
                  new Array(3).fill(undefined).map((value: any, index: number) => {
                    return (
                      <Stack
                        direction={`row`}
                        alignItems={`center`}
                        justifyContent={`space-between`}
                        sx={{
                          borderBottom: theme => `solid ${theme.palette.background.paper} 4px`,
                          px: 4,
                          py: 2
                        }}
                      >
                        <Box component={`div`}>
                          <Typography variant={`h6`}>Phantom Wallet</Typography>
                          <Typography variant={`subtitle2`}>12345678901234567890</Typography>
                        </Box>

                        <CloseIcon
                          sx={{
                            fontSize: `34px`,
                            color: theme => theme.palette.neutral.main,
                            '&:hover': {
                              cursor: `pointer`,
                              opacity: 0.7
                            }
                          }}
                        />
                      </Stack>
                    )
                  })
                }

                <Stack
                  direction={`row`}
                  alignItems={`center`}
                  justifyContent={`space-between`}
                  sx={{
                    px: 4,
                    py: 2
                  }}
                >
                  <Box component={`div`}>
                    <Typography variant={`h6`}>Phantom Wallet</Typography>
                    <Typography variant={`subtitle2`}>Click here to link additional wallets</Typography>
                  </Box>

                  <AddIcon
                    sx={{
                      fontSize: `34px`,
                      color: theme => theme.palette.neutral.main,
                      '&:hover': {
                        cursor: `pointer`,
                        opacity: 0.7
                      }
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Grid
            item
            lg={4}
            md={4}
            sm={4}
          >
            <Stack
              direction={`column`}
              alignItems={`stretch`}
              justifyContent={`space-between`}
              spacing={1}
            >
              <Box component={`div`} sx={{ background: theme => theme.palette.background.paper }}>
                <Typography variant={`h6`} sx={{ px: 4, py: 2 }}>Settings</Typography>
              </Box>

              <Box
                sx={{
                  background: theme => theme.palette.background.default,
                  minHeight: `100vh`,
                  maxHeight: `100vh`,
                  overflow: `auto`,
                  px: 4,
                  py: 2
                }}
              >
                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  pb={2}
                >
                  <Typography variant={`h6`}>Display Name</Typography>
                  <Typography
                    variant={`subtitle2`}
                    sx={{
                      py: 1,
                      background: theme => theme.palette.background.paper
                    }}
                  >
                    Joe Smith
                  </Typography>
                </Stack>

                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  pb={2}
                >
                  <Typography variant={`h6`}>Discord</Typography>
                  <Typography
                    variant={`subtitle2`}
                    sx={{
                      py: 1,
                      background: theme => theme.palette.background.paper
                    }}
                  >
                    JSmith#5123
                  </Typography>
                </Stack>

                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  pb={2}
                >
                  <Typography variant={`h6`}>E-mail</Typography>
                  <Typography
                    variant={`subtitle2`}
                    sx={{
                      py: 1,
                      background: theme => theme.palette.background.paper
                    }}
                  >
                    Jsmith@gmail.com
                  </Typography>
                </Stack>

                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  pb={2}
                >
                  <Typography variant={`h6`}>Timezone</Typography>
                  <Typography
                    variant={`subtitle2`}
                    sx={{
                      py: 1,
                      background: theme => theme.palette.background.paper
                    }}
                  >
                    Central Daylight (UTC-5)
                  </Typography>
                </Stack>

              </Box>
            </Stack>
          </Grid>

          <Grid
            item
            lg={4}
            md={4}
            sm={4}
          >
            <Stack
              direction={`column`}
              alignItems={`stretch`}
              justifyContent={`space-between`}
              spacing={1}
            >
              <Box component={`div`} sx={{ background: theme => theme.palette.background.paper }}>
                <Typography variant={`h6`} sx={{ px: 4, py: 2 }}>Passes and Subscriptions</Typography>
              </Box>

              <Box
                sx={{
                  background: theme => theme.palette.background.default,
                  minHeight: `100vh`,
                  maxHeight: `100vh`,
                  overflow: `auto`
                }}
              >
                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  sx={{
                    borderBottom: theme => `solid ${theme.palette.background.paper} 4px`,
                    px: 4,
                    py: 2
                  }}
                >
                  <Typography variant={`h6`}>Snapshots #3316 Obsidian</Typography>
                  <Typography variant={`subtitle2`}>linked on 05.04.2022</Typography>
                </Stack>

                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  sx={{
                    px: 4,
                    py: 2
                  }}
                >
                  <Typography variant={`subtitle2`}>
                    The Obsidian pass gives you full utility through the Snapshot Toolkit. No Subscription is needed at this time.
                  </Typography>
                </Stack>

              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Snackbar open={isShowMessage} autoHideDuration={5000} onClose={closeMessage} sx={{ zIndex: 10001 }}>
          <Alert onClose={closeMessage} severity={messageSeverity} sx={{ width: '100%', zIndex: 10001 }}>
            {messageContent}
          </Alert>
        </Snackbar>

        <Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={showLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Box>

  )
}

export default profile;