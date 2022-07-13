import { Fragment } from "react";

import Box from "@mui/material/Box";
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';
import PageInfo from "src/components/PageContainer/PageInfo";
import { Avatar, TableHead } from "@mui/material";

const topMovers = [
  { title: 'project' }, { title: '24h avg' }, { title: '% changes' }
]

const Home = () => {

  return (
    <Box
      component={`main`}
      sx={{ overflow: 'hidden' }}
    >
      <PageInfo />

      <Box component={`section`} sx={{ px: 13, py: 4 }} >
        <Typography variant='h6' >Top Volume</Typography>
        <Grid container spacing={1.5} flexWrap='unset'
          sx={{
            my: 2,
            maxWidth: {

              md: '85%',
            },
            // maxWidth: '82%',
            overflow: 'auto',
            py: 3
          }} >
          <Grid item  >
            <Box
              sx={{
                width: '290px',
                height: '20px',
                background: theme => theme.palette.background.paper
              }}
            ></Box>
            <Box sx={{
              width: '100%',
              height: '120px',
              position: 'relative'
            }} >
              <Typography variant="h6" sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-100%)'
              }} >
                Okay Bears
              </Typography>
            </Box>
            <Box sx={{
              background: theme => theme.palette.background.paper
            }} >
              <Grid container spacing={3} justifyContent='space-between' sx={{ padding: '0px 20px 20px 20px' }} >
                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >floor</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >listings</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <Typography variant='subtitle2' >volume</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

              </Grid>

            </Box>
          </Grid>

          <Grid item>
            <Box
              sx={{
                width: '290px',
                height: '20px',
                background: theme => theme.palette.background.paper
              }}
            ></Box>
            <Box sx={{
              width: '100%',
              height: '120px',
              position: 'relative'
            }} >
              <Typography variant="h6" sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-100%)'
              }} >
                Okay Bears
              </Typography>
            </Box>
            <Box sx={{
              background: theme => theme.palette.background.paper
            }} >
              <Grid container spacing={3} justifyContent='space-between' sx={{ padding: '0px 20px 20px 20px' }} >
                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >floor</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >listings</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <Typography variant='subtitle2' >volume</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

              </Grid>

            </Box>
          </Grid>
          <Grid item>
            <Box
              sx={{
                width: '290px',
                height: '20px',
                background: theme => theme.palette.background.paper
              }}
            ></Box>
            <Box sx={{
              width: '100%',
              height: '120px',
              position: 'relative'
            }} >
              <Typography variant="h6" sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-100%)'
              }} >
                Okay Bears
              </Typography>
            </Box>
            <Box sx={{
              background: theme => theme.palette.background.paper
            }} >
              <Grid container spacing={3} justifyContent='space-between' sx={{ padding: '0px 20px 20px 20px' }} >
                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >floor</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >listings</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <Typography variant='subtitle2' >volume</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

              </Grid>

            </Box>
          </Grid>
          <Grid item>
            <Box
              sx={{
                width: '290px',
                height: '20px',
                background: theme => theme.palette.background.paper
              }}
            ></Box>
            <Box sx={{
              width: '100%',
              height: '120px',
              position: 'relative'
            }} >
              <Typography variant="h6" sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-100%)'
              }} >
                Okay Bears
              </Typography>
            </Box>
            <Box sx={{
              background: theme => theme.palette.background.paper
            }} >
              <Grid container spacing={3} justifyContent='space-between' sx={{ padding: '0px 20px 20px 20px' }} >
                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >floor</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >listings</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <Typography variant='subtitle2' >volume</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

              </Grid>

            </Box>
          </Grid>
          <Grid item>
            <Box
              sx={{
                width: '290px',
                height: '20px',
                background: theme => theme.palette.background.paper
              }}
            ></Box>
            <Box sx={{
              width: '100%',
              height: '120px',
              position: 'relative'
            }} >
              <Typography variant="h6" sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-100%)'
              }} >
                Okay Bears
              </Typography>
            </Box>
            <Box sx={{
              background: theme => theme.palette.background.paper
            }} >
              <Grid container spacing={3} justifyContent='space-between' sx={{ padding: '0px 20px 20px 20px' }} >
                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >floor</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }} >
                  <Typography variant='subtitle2' >listings</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

                <Grid item lg={4} textAlign='center' sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <Typography variant='subtitle2' >volume</Typography>
                  <Typography variant='h6' >24.60</Typography>
                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                    <RedDown sx={{ width: `1rem`, height: `1rem` }} />
                    <Typography variant='subtitle2' >4.69%</Typography>
                  </Box>
                </Grid>

              </Grid>

            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box component={`section`} sx={{ px: 13, py: 4 }} >
        <Grid container direction={`row`} spacing={2} >
          <Grid item lg={2.97} md={2.87} >
            <Typography variant={`h6`} sx={{ py: 1 }} >Top Movers</Typography>
            <Table>
              <TableContainer sx={{
                maxHeight: '250px',
                overflow: 'auto'
              }} >
                <TableHead
                  sx={{
                    background: theme => theme.palette.background.paper,
                    border: 'none'
                  }}
                >
                  <TableRow>
                    {
                      topMovers.map((item: any, idx: any) => (
                        <TableCell sx={{
                          width: {
                            lg: idx == 0 ? '27%' : '17%'
                          },
                          textAlign: {
                            lg: idx == 0 ? 'left' : 'center'
                          },
                          border: 'none'
                        }} >
                          {item.title}
                        </TableCell>
                      ))
                    }

                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none', background: theme => `${theme.palette.common.white}` }} >Sample Project</TableCell>
                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => `${theme.palette.common.white}` }} >25%</TableCell>
                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => `${theme.palette.common.white}` }}>200%</TableCell>
                  </TableRow>
                </TableBody>
              </TableContainer>
            </Table>
          </Grid>
          <Grid item lg={2.97} md={2.87}>
            <Typography variant={`h6`} sx={{ py: 1 }}>New NFT Arrivals </Typography>
            <Table>
              <TableContainer sx={{
                maxHeight: '250px',
                overflow: 'auto'
              }} >
                <TableHead
                  sx={{
                    background: theme => theme.palette.background.paper,
                    border: 'none'
                  }}
                >
                  <TableRow>
                    {
                      topMovers.map((item: any, idx: any) => (
                        <TableCell sx={{
                          width: {
                            lg: idx == 0 ? '27%' : '17%'
                          },
                          textAlign: {
                            lg: idx == 0 ? 'left' : 'center'
                          },
                          border: 'none'
                        }} >
                          {item.title}
                        </TableCell>
                      ))
                    }

                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none', background: theme => `${theme.palette.common.white}` }} >Sample Project</TableCell>
                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => `${theme.palette.common.white}` }}>25%</TableCell>
                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => `${theme.palette.common.white}` }}>200%</TableCell>
                  </TableRow>
                </TableBody>
              </TableContainer>
            </Table>
          </Grid>
          <Grid item lg={2.97} md={2.87}>
            <Typography variant={`h6`} sx={{ py: 1 }}>New Token Arrivals</Typography>
            <Table>
              <TableContainer sx={{
                maxHeight: '250px',
                overflow: 'auto'
              }} >
                <TableHead
                  sx={{
                    background: theme => theme.palette.background.paper,
                    border: 'none'
                  }}
                >
                  <TableRow>
                    {
                      topMovers.map((item: any, idx: any) => (
                        <TableCell sx={{
                          width: {
                            lg: idx == 0 ? '27%' : '17%'
                          },
                          textAlign: {
                            lg: idx == 0 ? 'left' : 'center'
                          },
                          border: 'none'
                        }} >
                          {item.title}
                        </TableCell>
                      ))
                    }

                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none', background: theme => `${theme.palette.common.white}` }} >Sample Project</TableCell>
                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => `${theme.palette.common.white}` }}>25%</TableCell>
                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => `${theme.palette.common.white}` }}>200%</TableCell>
                  </TableRow>
                </TableBody>
              </TableContainer>
            </Table>
          </Grid>
          <Grid item lg={2.87} md={2.87}>
            <Typography variant={`h6`} sx={{ py: 1 }}>Upcoming</Typography>
            <Table>
              <TableContainer sx={{
                maxHeight: '250px',
                overflow: 'auto'
              }} >
                <TableHead
                  sx={{
                    background: theme => theme.palette.background.paper,
                    border: 'none'
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ border: 'none' }} >Project</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none', background: theme => `${theme.palette.common.white}` }}  >Sample Project</TableCell>
                  </TableRow>
                </TableBody>
              </TableContainer>
            </Table>
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
}

export default Home;