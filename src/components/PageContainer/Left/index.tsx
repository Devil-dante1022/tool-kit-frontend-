import * as React from 'react';

import { useRouter } from 'next/router'
import Link from 'next/link';

import { RootState } from "redux/store";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

var localStorage = require('localStorage');

import { createTheme, responsiveFontSizes } from "@mui/material";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from 'src/components/LogoIcon';
import HomeIcon from '@components/IconButton/HomeIcon';
import MarketIcon from '@components/IconButton/MarketIcon';
import NftsIcon from '@components/IconButton/NftsIcon';
import TokenIcon from '@components/IconButton/TokenIcon';
import CalendarIcon from '@components/IconButton/CalendarIcon';
import TwitterButton from '@components/IconButton/TwitterButton';
import DiscordButton from '@components/IconButton/DiscordButton';
import ProfileIcon from '@components/IconButton/ProfileIcon';
import LogoutIcon from '@components/IconButton/LogoutIcon';
import IconButton from '@mui/material/IconButton';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { MENU } from 'src/common/config';

export default function Left() {
  const theme = createTheme()
  const router = useRouter();

  const dispatch = useAppDispatch();
  const mainTheme = useAppSelector((state: RootState) => state.isOwner.theme);

  const getCurMenu = (menuUrl: string): boolean => {
    const path = router.asPath;
    if (path.includes(`coming`)) {
      return false;
    }
    return path.includes(menuUrl);
  }

  const [activeMenu, setActiveMenu] = React.useState();
  const [menuItemActive, setMenuItemActive] = React.useState(-1)
  const [isshow, setShow] = React.useState(false)

  const changeTheme = () => {
    localStorage.setItem(`snapshot-toolkit-theme`, (mainTheme == `light` || mainTheme == ``) ? `dark` : `light`);
    dispatch(setTheme((mainTheme == `light` || mainTheme == ``) ? `dark` : `light`));
  }

  React.useEffect(() => {

  }, []);

  return (
    <React.Fragment>
      {
        <Paper
          sx={{
            position: `fixed`,
            minWidth: {
              md: `200px`,
            },
            [theme.breakpoints.down('md')]: { display: isshow ? 'block' : `none` },
            [theme.breakpoints.up('md')]: { display: 'block' },
            minHeight: `100vh`,
            borderRadius: 'unset !important ',
            borderRight: theme => `2px solid ${theme.palette.neutral.border}`,
            // background: mainTheme == `dark` ? theme => theme.palette.background.paper : theme => theme.palette.background.default,
            background: theme => theme.palette.background.paper
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
              py: 2
            }}
          >
            <Grid item lg={2}>

            </Grid>

            <Grid
              item
              lg={8}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"

            >
              <Grid item>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <LogoIcon sx={{
                    width: `3rem`,
                    height: `3rem`
                  }} />
                </Stack>
              </Grid>
            </Grid>

            <Grid item lg={2}>

            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item lg={2}>

            </Grid>

            <Grid
              item
              lg={8}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"

            >
              <Grid item>
                <Stack
                  direction="row"
                  justifyContent="left"
                  alignItems="center"
                >
                  <Link href={`/`}>
                    <Typography variant={`h6`}>
                      Toolkit
                    </Typography>
                  </Link>
                </Stack>
              </Grid>
            </Grid>

            <Grid item lg={2}>

            </Grid>
          </Grid>

          {
            MENU.map((menu: any, idx: any) => {
              return (

                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    position: {
                      md: idx == 5 ? `absolute` : ``
                    },
                    bottom: {
                      md: idx == 5 ? 56 : ``
                    },
                    mt: {
                      md: idx == 0 ? 3.5 : ``
                    }
                  }}
                  key={idx}

                >
                  <Grid item md={2}>

                  </Grid>

                  <Grid
                    item
                    md={8}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      color: getCurMenu(menu.url) ? `white` : theme => theme.palette.text.primary,
                      borderRadius: 1,
                      border: theme => `solid 1px ${theme.palette.background.paper}`,
                      py: 1,
                      cursor: `pointer`,
                      '&:hover': {
                        border: theme => `solid 1px ${theme.palette.neutral.main}`,
                      },
                      background: getCurMenu(menu.url) ? theme => theme.palette.neutral.main : theme => theme.palette.background.paper,
                    }}
                    onClick={() => {
                      router.push(`/${menu.url}`)
                    }}
                  >
                    <Grid item md={6}>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ ml: 2 }}
                      >
                        {
                          idx == 0 && <HomeIcon />
                        }
                        {
                          idx == 1 && <MarketIcon />
                        }
                        {
                          idx == 2 && <NftsIcon />
                        }
                        {
                          idx == 3 && <TokenIcon />
                        }
                        {
                          idx == 4 && <CalendarIcon />
                        }
                        {
                          idx == 5 && <ProfileIcon />
                        }
                      </Stack>
                    </Grid>
                    <Grid item md={6}>
                      <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                      >
                        <Typography variant={`subtitle1`} sx={{
                          color: getCurMenu(menu.url) ? `white` : theme => theme.palette.text.primary,
                        }} >
                          {menu.menu}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid item md={2}>

                  </Grid>
                </Grid>
              )
            })
          }

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            position={`absolute`}
            bottom={1}
            sx={{
              pb: 2
            }}
          >

            <Grid
              item
              lg={12}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"

            >
              <Grid item>
                <Stack
                  direction="row"
                  justifyContent={`space-between`}
                  alignItems="center"
                  spacing={2}
                >
                  {/* <Grid md={3}>
                    {mainTheme == 'dark' ? <Brightness7Icon sx={{ '&:hover': { cursor: `pointer` } }} onClick={changeTheme} /> : <Brightness4Icon onClick={changeTheme} sx={{ '&:hover': { cursor: `pointer` } }} />}
                  </Grid> */}
                  <Grid md={4} ><DiscordButton sx={{ '&:hover': { cursor: `pointer` } }} /></Grid>
                  <Grid md={4}><TwitterButton sx={{ '&:hover': { cursor: `pointer` } }} /></Grid>
                  <Grid md={4}><LogoutIcon sx={{ '&:hover': { cursor: `pointer` } }} /></Grid>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      }
      <MenuIcon sx={{
        position: 'absolute',
        top: '25px',
        left: '10px',
        [theme.breakpoints.up('md')]: { display: 'none' },
        [theme.breakpoints.down('md')]: { display: 'block' }
      }}
        onClick={() => { setShow(!isshow) }}
      />
    </React.Fragment>


  );
}
