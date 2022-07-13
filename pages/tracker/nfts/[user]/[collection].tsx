import React, { Fragment, useEffect, useRef, useState } from "react";

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart, Line, Scatter, Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

import {
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

import Box from "@mui/material/Box";
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Skeleton from '@mui/material/Skeleton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Toolbar from "@mui/material/Toolbar";
import Divider from '@mui/material/Divider';
import Avatar from "@mui/material/Avatar";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddIcon from '@mui/icons-material/Add';

import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';

import DiscordButton from 'src/components/IconButton/DiscordButton';
import LanguageButton from '@components/IconButton/LanguageButton';
import ShopButton from 'src/components/IconButton/ShopButton';
import TwitterButton from 'src/components/IconButton/TwitterButton';
import PaperButton from 'src/components/PaperButton';

import PageInfo from "src/components/PageContainer/PageInfo";

import { numberToFix } from "src/common/utils/helpers";
import { handleImageError } from "src/common/utils/handleImageError";
import { DATA_API, TIME_RANGE, COLLECTION_ANALYSTIC_PERIOD, CORS_PROXY_SERVER, SNIPER_API, TIME_INCREASE, SNIPER_ACTION_TYPE, LIMIT_COLUMNS } from "src/common/config";

import fetchData from "src/common/services/getDataWithAxios";
import getDatesInterval from "src/helper/getDateInterval";
import getTimeBefore from "src/helper/getTimeBefore";

import { getMarketplace, getMarketplaceImage } from "src/common/services/getMarketplace";

import { TableHead } from "@mui/material";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const lastSalesField = [
  {
    field: `name`,
  },
  {
    field: `price`,
  },
  {
    field: `time`,
  },
  {
    field: `link`
  },
];

const lowestListingField = [
  {
    field: `name`
  },
  {
    field: `price`
  },
  {
    field: `link`
  },
];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let collectionActivities = null;
let priceDistributes = null;
let globalPeriod = COLLECTION_ANALYSTIC_PERIOD.DAY;

let tempOriginalPercent = [];

const Nfts = () => {
  const router = useRouter();
  const siteTheme = useAppSelector((state: RootState) => state.isOwner.theme);

  //Symbol
  const [symbol, setSymbol] = useState<string | string[]>(``);
  const [username, setUsername] = useState<string | string[]>(`root`);

  // For Fetch Detail Data
  const [detailData, setDetailData] = useState<any>();

  //Switch charts
  const [graphmode, setGraphmode] = React.useState(true);
  const [showVolume, setShowVolume] = React.useState(true);
  const [showList, setShowList] = React.useState(true);

  const [chartData, setChartData] = useState<any[] | null>(null);
  const [period, setPeriod] = useState<number>(COLLECTION_ANALYSTIC_PERIOD.DAY);

  const [entireData, setEntireData] = useState<any>();
  const [spreadData, setSpreadData] = useState<any[]>([]);
  const [lastSalesData, setLastSalesData] = useState<any[] | null>(null);

  const [timer, setTimer] = React.useState(null);
  const [percentTimer, setPercentTimer] = React.useState(0);

  const [originalPercent, setOriginalPercent] = useState<any>([]);

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

  const startTimeInterval = async () => {
    const intervalId = window.setInterval(async () => {
      setPercentTimer(percentTimer => percentTimer + TIME_INCREASE);
    }, TIME_RANGE * 6)
    return intervalId;
  }

  const startInterval = async () => {
    const intervalId = window.setInterval(async () => {
      setTimer(timer => timer + TIME_INCREASE);
    }, TIME_RANGE)
    return intervalId;
  }

  //For fetch Data
  const getFetching = async () => {
    new Promise((myResolve, myReject) => {
      const details: any = fetchData({
        method: `post`,
        route: `${DATA_API.GET_COLLECTION_DETAIL.COMMON}/${username}${DATA_API.GET_COLLECTION_DETAIL.DETAIL}`,
        data: {
          symbol: symbol
        }
      });
      myResolve(details);
    }).then(async (res) => {
      const result: any = res;
      let detail = tempOriginalPercent.find((val: any) => {
        return val?.symbol == symbol
      });
      if (result?.symbol) {
        setDetailData({ ...result, ...detail });
      }
      else {
        setDetailData({ ...detail });
      }
    });
    // let detail = tempOriginalPercent.find((val: any) => {
    //   return val?.symbol == symbol
    // });
    // setDetailData({ ...detail });


    new Promise((myResolve, myReject) => {
      const charts: any = fetchData({
        method: `get`,
        route: `${CORS_PROXY_SERVER}/${SNIPER_API.ACTIVITIES_PER_COLLECTION}?symbol=${symbol}`,
      });
      myResolve(charts);
    }).then((res) => {
      const result: any = res;
      if (result && Array.isArray(result)) {
        const temp = result.filter((record: any) => {
          return record?.type == SNIPER_ACTION_TYPE.SALE
        }).sort((a: any, b: any) => {
          return b?.blocktime - a?.blocktime;
        }).slice(0, LIMIT_COLUMNS - 1)
        setLastSalesData([...temp]);
      }
    });

    new Promise((myResolve, myReject) => {
      const lists: any = fetchData({
        method: `get`,
        route: `${CORS_PROXY_SERVER}/${SNIPER_API.NFTS_PER_COLLECTION}?collection=${symbol}&limit=${LIMIT_COLUMNS}&sort=lth`,
      });
      myResolve(lists);
    }).then((res) => {
      const result: any = res;
      if (result && result?.result && Array.isArray(result?.result)) {
        const lowestNfts = result?.result || [];
        setEntireData({
          ...{
            lowestNfts
          }
        });
      }
    })
  }

  const getCollectionDetail = async (symbol: string) => {
    try {

      const fetched: any = await fetchData({
        method: `get`,
        route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${username}/${symbol}`
      });
      console.log(`symbol`, symbol, fetched?.image);
      if (fetched && fetched?.image) {
        return fetched;
      }

      return null;
    }
    catch (err) {
      return null
    }
  }

  const getAutoFetching = async () => {
    try {
      if (username && symbol) {
        getFetching();
        getActsAndMetrics();
        analysisActs();
        analysisMetrics();
      }
    }
    catch (err) {

    }
  }

  const getActsAndMetrics = async () => {
    try {
      new Promise((myResolve, myReject) => {
        const acts: any = fetchData({
          method: `get`,
          route: `${CORS_PROXY_SERVER}/${DATA_API.GET_COLLECTION_DETAIL.SNIPER_ACTS_URL}?symbol=${symbol}`,
        });
        myResolve(acts);
      }).then((res) => {
        const result: any = res;
        if (result && Array.isArray(result)) {
          collectionActivities = result
        }
      });

      new Promise((myResolve, myReject) => {
        const metrics: any = fetchData({
          method: `get`,
          route: `${CORS_PROXY_SERVER}/${DATA_API.GET_COLLECTION_DETAIL.SNIPER_METRICS_URL}?collection=${symbol}`,
        });
        myResolve(metrics);
      }).then((res) => {
        const result: any = res;
        if (result) {
          priceDistributes = result?.PRICE_DISTRIBUTION || [];
        }
      });
    }
    catch (err) {

    }
  }

  const analysisActs = async () => {
    if (collectionActivities) {
      let startTimestamp = undefined;
      if (globalPeriod == 0) {
        startTimestamp = collectionActivities[0]?.timestamp;
      }
      const dates = await getDatesInterval(globalPeriod, startTimestamp);
      const result = dates.map((actDate: any, index: number) => {
        const data = collectionActivities.filter((record: any, _index: number) => {
          return record?.timestamp >= actDate?.openTimestamp && record?.timestamp <= actDate?.closeTimestamp
        });
        const floor = data.map((record: any) => { return record?.minFloorPrice }).sort((a: any, b: any) => { return a - b })[0] || 0;
        const vols = data.map((record: any) => { return record?.closeVolume });
        const lists = data.map((record: any) => { return record?.closeListedCount });
        return {
          ...actDate,
          floor: floor,
          vol: vols[vols.length - 1] || 0,
          list: lists[lists.length - 1] || 0
        }
      });
      if (result && Array.isArray(result)) {
        setChartData([...result])
      }
    }
  }

  const analysisMetrics = async () => {
    if (priceDistributes && Array.isArray(priceDistributes)) {
      const result = priceDistributes.map((data: any) => {
        return {
          spread: data?.max,
          count: data?.count
        }
      })
      setSpreadData([...result])
    }
  }

  const getPercentChange = async () => {
    try {
      const fetched: any = await fetchData({
        method: `get`,
        route: `${CORS_PROXY_SERVER}/${SNIPER_API.PERCENT_CHANGE}`
      });

      let result: any = fetched;
      if (result && result?.percentChanges && Array.isArray(result?.percentChanges)) {
        tempOriginalPercent = result.percentChanges;
        setOriginalPercent([...tempOriginalPercent]);

        startTimeInterval();
      }
    }
    catch (err) {
      return [];
    }
  }

  const fetchPercentChange = async () => {
    try {
      new Promise((myResolve, myReject) => {
        const fetched: any = fetchData({
          method: `get`,
          route: `${DATA_API.SNIPER_API.COMMON}${DATA_API.SNIPER_API.PERCENT_CHANGE}`
        });

        myResolve(fetched);
      }).then(async (res) => {
        if (res) {
          let result: any = res;
          if (result && result?.percentChanges && Array.isArray(result?.percentChanges)) {
            tempOriginalPercent = result.percentChanges;
            setOriginalPercent([...tempOriginalPercent]);
          }
        }
      });
    }
    catch (err) {
      return [];
    }
  }

  useEffect(() => {
    (async () => {
      if (router.isReady && symbol) {
        getActsAndMetrics();
      }
    })()
  }, [router.isReady, symbol]);

  useEffect(() => {
    (async () => {
      await getPercentChange();
      if (router.isReady && router.query.collection && router.query.user) {
        setSymbol(router.query.collection);
        startInterval();
      }
    })()
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      if (router.isReady && symbol) {
        await getFetching();
      }
    })()
  }, [symbol]);

  useEffect(() => {
    (async () => {
      if (router.isReady && symbol && timer > 0) {
        await getAutoFetching();
      }
    })()
  }, [timer]);

  useEffect(() => {
    (async () => {
      if (router.isReady && symbol) {
        globalPeriod = period;
        await analysisActs();
      }
    })()
  }, [period]);

  useEffect(() => {
    (async () => {
      try {
        if (percentTimer > 0) {
          fetchPercentChange();
        }
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, [percentTimer]);

  return (
    <>
      <PageInfo>

      </PageInfo>

      <Box
        sx={{
          mx: `auto`,
          position: `relative`,
          px: 13,
          py: 4,
          pt: 0
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 2.5,
            background: theme => theme.palette.background.default
          }}
        >
          <Typography
            variant={'h6'}
            sx={{
              color: theme => theme.palette.common.white
            }}
          >
            Project Overview
          </Typography>
        </Stack>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          sx={{
            background: theme => theme.palette.background.paper
          }}
        >
          <Grid
            item
            container
            lg={6}
            direction="row"
            alignItems="stretch"
            justifyContent="flex-start"
            sx={{
              p: 1
            }}
          >
            <Grid item lg={5}>
              <Stack
                direction={`row`}
                alignItems={`center`}
                justifyContent={`flex-start`}
              >
                {detailData?.symbol ?
                  <Box
                    component={`img`}
                    src={detailData?.image}
                    sx={{
                      width: 156,
                      height: 156,
                      borderRadius: `50%`,
                      objectFit: `cover`
                    }}
                    onError={handleImageError}
                  /> : <Skeleton variant="circular" width={156} height={156} />
                }
              </Stack>
            </Grid>

            <Grid item lg={7}>
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
                sx={{
                  py: 1.2,
                  height: `100%`
                }}
              >
                <Box>
                  <Typography variant={'h6'} sx={{ pb: 1 }}>
                    {detailData?.symbol ? detailData?.symbol : <Skeleton animation="wave" sx={{ width: `25%` }} />}
                  </Typography>

                  {
                    detailData?.symbol ?
                      <Typography variant={`subtitle2`} sx={{ pb: 2, lineHeight: `1.2` }}>
                        {detailData?.description}
                      </Typography> :
                      <Box sx={{ width: `100%` }}>
                        <Typography variant={`subtitle2`} ><Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        <Typography variant={`subtitle2`} ><Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        <Typography variant={`subtitle2`} ><Skeleton animation="wave" sx={{ width: `50%` }} /></Typography>
                      </Box>
                  }
                </Box>

                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={3}
                >
                  {
                    detailData?.symbol ?
                      detailData?.website ?
                        <Link href={detailData?.website || '/'}>
                          <a target="_blank">
                            <LanguageButton
                              sx={{
                                width: 24,
                                height: 24,
                                '&:hover': { cursor: `pointer` }
                              }}
                            />
                          </a>
                        </Link> :
                        <LanguageButton
                          sx={{
                            width: 24,
                            height: 24,
                            '&:hover': { cursor: `pointer` }
                          }}
                        /> :
                      <Skeleton variant="circular" width={24} height={24} />
                  }

                  {
                    detailData?.symbol ?
                      detailData?.twitter ?
                        <Link href={detailData?.twitter || '/'}>
                          <a target="_blank">
                            <TwitterButton
                              sx={{
                                width: 24,
                                height: 24,
                                '&:hover': { cursor: `pointer` }
                              }}
                            />
                          </a>
                        </Link> :
                        <TwitterButton
                          sx={{
                            width: 24,
                            height: 24,
                            '&:hover': { cursor: `pointer` }
                          }}
                        /> :
                      <Skeleton variant="circular" width={24} height={24} />
                  }

                  {
                    detailData?.symbol ?
                      detailData?.discord ?
                        <Link href={detailData?.discord || '/'}>
                          <a target="_blank">
                            <DiscordButton
                              sx={{
                                width: 24,
                                height: 24,
                                '&:hover': { cursor: `pointer` }
                              }}
                            />
                          </a>
                        </Link> :
                        <DiscordButton
                          sx={{
                            width: 24,
                            height: 24,
                            '&:hover': { cursor: `pointer` }
                          }}
                        /> :
                      <Skeleton variant="circular" width={24} height={24} />
                  }
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Grid
            container
            item
            lg={6}
            direction={`row`}
            alignItems={`stretch`}
            justifyContent={`space-between`}
            sx={{
              background: theme => theme.palette.background.paper
            }}
          >

            <Grid
              item
              md={2}
              sx={{
                background: theme => theme.palette.background.paper,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.main}`,
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Supply
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    &nbsp;
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.symbol ?
                        detailData?.supply > 1000 ? `${(detailData?.supply / 1000).toFixed(1)}k` : detailData?.supply
                        :
                        <Skeleton animation="wave" />
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              md={2}
              sx={{
                background: theme => theme.palette.background.paper,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.main}`,
                px: 2,
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Listings
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    &nbsp;
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.symbol ?
                        detailData?.listedCount > 1000 ? `${(detailData?.listedCount / 1000).toFixed(1)}k` : detailData?.listedCount
                        :
                        <Skeleton animation="wave" />
                    }
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ mt: 2 }}
                    >
                      {
                        (!detailData?.symbol && !detailData?.listedCount1DayDelta) ? <Skeleton animation="wave" sx={{ width: `25%` }} /> : ``
                      }

                      {
                        (detailData?.listedCount1DayDelta && detailData?.listedCount1DayDelta > 0) ? <GreenUp sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        (detailData?.listedCount1DayDelta && detailData?.listedCount1DayDelta < 0) ? <RedDown sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        detailData?.listedCount1DayDelta ? numberToFix(detailData?.listedCount1DayDelta) : (detailData?.symbol ? 0 : ``)
                      }

                      {
                        detailData?.listedCount1DayDelta ? `%` : ``
                      }
                    </Stack>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              md={2}
              sx={{
                background: theme => theme.palette.background.paper,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.main}`,
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Floor
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    &nbsp;
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.floor && `•`
                    }
                    {
                      !detailData?.symbol && !detailData?.floor && <Skeleton animation="wave" />
                    }
                    {

                      detailData?.floor && numberToFix(detailData?.floor)
                    }
                    {
                      detailData?.floor == 0 && 0
                    }
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={0.5}
                      sx={{ mt: 2 }}
                    >
                      {
                        (!detailData?.symbol && !detailData?.floor1DayDelta) ? <Skeleton animation="wave" sx={{ width: `25%` }} /> : ``
                      }
                      {
                        (detailData?.floor1DayDelta && detailData?.floor1DayDelta > 0) ? <GreenUp sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        (detailData?.floor1DayDelta && detailData?.floor1DayDelta < 0) ? <RedDown sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        detailData?.floor1DayDelta ? numberToFix(detailData?.floor1DayDelta) : (detailData?.symbol ? 0 : ``)
                      }

                      {
                        detailData?.floor1DayDelta ? `%` : ``
                      }
                    </Stack>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              md={2}
              sx={{
                background: theme => theme.palette.background.paper,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.main}`,
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Avg.Sale
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    24 hour
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.avgSale && `•`
                    }
                    {
                      !detailData?.symbol && !detailData?.avgSale && <Skeleton animation="wave" />
                    }
                    {
                      detailData?.avgSale &&
                      ((detailData?.avgSale / LAMPORTS_PER_SOL) > 1000 ? `${(detailData?.avgSale / LAMPORTS_PER_SOL / 1000).toFixed(1)} k`
                        : `${numberToFix(detailData?.avgSale / LAMPORTS_PER_SOL)}`)
                    }
                    {
                      detailData?.avgSale == 0 && 0
                    }


                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={0.5}
                    >
                      {
                        (!detailData?.symbol && !detailData?.avgSaleChange) ? <Skeleton animation="wave" sx={{ width: `25%` }} /> : ``
                      }
                      {
                        (detailData?.avgSaleChange && detailData?.avgSaleChange > 0) ? <GreenUp sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        (detailData?.avgSaleChange && detailData?.avgSaleChange < 0) ? <RedDown sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        detailData?.avgSaleChange ? numberToFix(detailData?.avgSaleChange * 100) : (detailData?.symbol ? 0 : ``)
                      }
                      {
                        detailData?.avgSaleChange ? `%` : ``
                      }
                    </Stack>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              md={2}
              sx={{
                background: theme => theme.palette.background.paper,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.main}`,
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Volume
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    {/* all time */}
                    7 days
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.volume && `•`
                    }
                    {
                      !detailData?.symbol && !detailData?.volume && <Skeleton animation="wave" />
                    }
                    {
                      detailData?.volume &&
                      ((detailData?.volume) > 1000 ? `${((detailData?.volume) / 1000).toFixed(1)} k`
                        : `${numberToFix(detailData?.volume)}`)
                    }
                    {
                      detailData?.volume == 0 && 0
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              md={2}
              sx={{
                background: theme => theme.palette.background.paper,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.main}`,
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Volume
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    24 hour
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.volume ? '•' : ``
                    }
                    {
                      (!detailData?.symbol && !detailData?.volume) ? <Skeleton animation="wave" /> : ``
                    }
                    {
                      detailData?.volume &&
                      (((detailData?.volume * detailData?.volume1DayDelta) / (100 + detailData?.volume1DayDelta) > 1000) ? `${((detailData?.volume * detailData?.volume1DayDelta) / (100 + detailData?.volume1DayDelta) / 1000).toFixed(1)}k`
                        : numberToFix((detailData?.volume * detailData?.volume1DayDelta) / (100 + detailData?.volume1DayDelta)))
                    }
                    {
                      (detailData?.volume * detailData?.volume1DayDelta) / (100 + detailData?.volume1DayDelta) == 0 && 0
                    }

                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ mt: 2 }}
                    >
                      {
                        !detailData?.symbol && !detailData?.volume1DayDelta && <Skeleton animation="wave" sx={{ width: `25%` }} />
                      }

                      {
                        (detailData?.volume1DayDelta && detailData?.volume1DayDelta > 0) ? <GreenUp sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        (detailData?.volume1DayDelta && detailData?.volume1DayDelta < 0) ? <RedDown sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        detailData?.volume1DayDelta ? numberToFix(detailData?.volume1DayDelta) : (detailData?.symbol ? 0 : ``)
                      }

                      {
                        detailData?.volume1DayDelta ? `%` : ``
                      }
                    </Stack>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 0.75,
            mt: 1,
            background: theme => theme.palette.background.default
          }}
        >
          <Typography
            variant={'h6'}
            sx={{ color: theme => theme.palette.common.white }}
          >
            Visual Data
          </Typography>

          <ButtonGroup variant="contained" aria-label="outlined primary button group"
            sx={{
              boxShadow: `none`,
              '& .MuiButtonGroup-grouped': {
                borderRight: `none !important`,
              }
            }}
          >
            <PaperButton size={`medium`} selected={period == COLLECTION_ANALYSTIC_PERIOD.ALL} sx={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
              onClick={
                async () => {
                  setPeriod(COLLECTION_ANALYSTIC_PERIOD.ALL);
                }
              }
            >
              <Typography
                variant={`subtitle2`}
              >
                all time
              </Typography>
            </PaperButton>
            <PaperButton size={`medium`} selected={period == COLLECTION_ANALYSTIC_PERIOD.MONTH}
              onClick={
                async () => {
                  setPeriod(COLLECTION_ANALYSTIC_PERIOD.MONTH)
                }
              }
            >
              <Typography
                variant={`subtitle2`}

              >
                30 days
              </Typography>
            </PaperButton>
            <PaperButton size={`medium`} selected={period == COLLECTION_ANALYSTIC_PERIOD.WEEK}
              onClick={
                async () => {
                  setPeriod(COLLECTION_ANALYSTIC_PERIOD.WEEK);
                }
              }
            >
              <Typography
                variant={`subtitle2`}
              >
                7 days
              </Typography>
            </PaperButton>
            <PaperButton size={`medium`} selected={period == COLLECTION_ANALYSTIC_PERIOD.DAY}
              onClick={
                async () => {
                  setPeriod(COLLECTION_ANALYSTIC_PERIOD.DAY);
                }
              }
              sx={{
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4
              }}
            >
              <Typography
                variant={`subtitle2`}
              >
                24 hours
              </Typography>
            </PaperButton>
          </ButtonGroup>
        </Stack>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={0}
          sx={{ mt: 1, py: `0 !important`, background: theme => theme.palette.background.paper }}
        >
          <Grid item lg={6} sx={{ py: `0 !important` }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={0}
              sx={{
                background: theme => theme.palette.neutral.paper,
                px: 2,
                py: 0.25
              }}
            >
              <Typography variant={'subtitle2'} sx={{ color: theme => theme.palette.common.white }}>
                Sales and Floor
              </Typography>

              <ButtonGroup variant="contained" aria-label="outlined primary button group"
                sx={{
                  '& .MuiButtonGroup-grouped': {
                    borderRight: `none !important`,
                  },
                }}
              >
                <PaperButton size={`medium`} selected={graphmode}
                  sx={{
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4
                  }}
                  onClick={() => {
                    setGraphmode(true);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    graph
                  </Typography>
                </PaperButton>
                <PaperButton size={`medium`}
                  selected={!graphmode}
                  sx={{
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4
                  }}
                  onClick={() => {
                    setGraphmode(false);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    points
                  </Typography>
                </PaperButton>
              </ButtonGroup>
            </Stack>
          </Grid>

          <Grid item lg={6} sx={{ py: `0 !important` }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={0}
              sx={{ pl: 2, py: 0.25, background: theme => theme.palette.neutral.paper, px: 2 }}
            >
              <Typography variant={'subtitle2'} sx={{ color: theme => theme.palette.common.white }}>
                Volume and Listings
              </Typography>

              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
                sx={{
                  '& .MuiButtonGroup-grouped': {
                    borderRight: `none !important`,
                  },
                }}
              >
                <PaperButton size={`medium`}
                  selected={showVolume}
                  sx={{
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4
                  }}
                  onClick={() => {
                    setShowVolume(!showVolume);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    volume
                  </Typography>
                </PaperButton>
                <PaperButton size={`medium`} selected={showList}
                  sx={{
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4
                  }}
                  onClick={() => {
                    setShowList(!showList);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    listings
                  </Typography>
                </PaperButton>
              </ButtonGroup>
            </Stack>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          sx={{ mt: 0, py: `0 !important`, background: theme => theme.palette.background.paper }}
        >
          <Grid item lg={6} sx={{ py: `0 !important` }}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              sx={{ py: 1.5, height: `100%`, px: 2 }}
            >
              {
                collectionActivities ? (
                  graphmode ?
                    <Chart
                      type={
                        'bar'
                      }
                      data={{
                        labels: chartData?.map((chart: any, index: number) => {
                          if (period == COLLECTION_ANALYSTIC_PERIOD.DAY) {
                            // return `${new Date(chart?.openTimestamp).getHours()}:${new Date(chart?.openTimestamp).getMinutes()}`
                            return `${new Date(chart?.openTimestamp).getHours()}:00`
                          }
                          return `${monthNames[new Date(chart?.openTimestamp).getMonth()]} ${new Date(chart?.openTimestamp).getDate()}`
                        }),
                        datasets: [
                          {
                            type: 'line' as const,
                            label: 'Floor',
                            borderColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF` : `#9AC3E2`,
                            borderWidth: 2,
                            fill: false,
                            data: chartData?.map((chart: any, index: number) => {
                              return numberToFix((chart?.floor || 0));
                            })
                          }
                        ],
                      }} /> :
                    <Line
                      options={{
                        responsive: true,
                        interaction: {
                          mode: 'index' as const,
                          intersect: false,
                        },
                        stacked: false,
                        plugins: {
                          title: {
                            display: false,
                            text: 'Chart.js Line Chart - Multi Axis',
                          },
                        },

                        scales: {
                          y: {
                            type: 'linear' as const,
                            display: true,
                            position: 'left' as const,
                          }
                        },
                      }}
                      data={{
                        labels: chartData?.map((chart: any, index: number) => {
                          if (period == COLLECTION_ANALYSTIC_PERIOD.DAY) {
                            // return `${new Date(chart?.openTimestamp).getHours()}:${new Date(chart?.openTimestamp).getMinutes()}`
                            return `${new Date(chart?.openTimestamp).getHours()}:00`
                          }
                          return `${monthNames[new Date(chart?.openTimestamp).getMonth()]} ${new Date(chart?.openTimestamp).getDate()}`
                        }),
                        datasets: [
                          {
                            label: 'Floor',
                            data: chartData?.map((chart: any, index: number) => {
                              return numberToFix((chart?.floor || 0));
                            }),
                            borderColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF` : `#9AC3E2`,
                            backgroundColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF50` : `#9AC3E250`,
                            yAxisID: 'y',
                            showLine: false
                          }
                        ],

                      }}
                    />
                ) :
                  <Skeleton animation="wave" width={`100%`} height={`360px`} />
              }

            </Stack>
          </Grid>

          <Grid item lg={6} sx={{ py: `0 !important` }}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              sx={{ px: 2, py: 1.5, height: `100%` }}
            >
              {
                collectionActivities ?
                  <Line
                    options={{
                      responsive: true,
                      interaction: {
                        mode: 'index' as const,
                        intersect: false,
                      },
                      stacked: false,
                      plugins: {
                        title: {
                          display: false,
                          text: '',
                        },
                      },

                      scales: {
                        y: {
                          type: 'linear' as const,
                          display: showVolume,
                          position: 'left' as const,
                        },
                        y1: {
                          type: 'linear' as const,
                          display: showList,
                          position: 'right' as const,
                          grid: {
                            drawOnChartArea: false,
                          },
                        },
                      },
                    }}
                    data={{
                      labels: chartData?.map((chart: any, index: number) => {
                        if (period == COLLECTION_ANALYSTIC_PERIOD.DAY) {
                          // return `${new Date(chart?.openTimestamp).getHours()}:${new Date(chart?.openTimestamp).getMinutes()}`
                          return `${new Date(chart?.openTimestamp).getHours()}:00`
                        }
                        return `${monthNames[new Date(chart?.openTimestamp).getMonth()]} ${new Date(chart?.openTimestamp).getDate()}`
                      }),
                      datasets: [
                        {
                          label: 'Volume',
                          data: showVolume ? chartData?.map((chart: any, index: number) => {
                            return numberToFix((chart?.vol || 0));
                          }) : [],
                          borderColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF` : `#9AC3E2`,
                          backgroundColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF50` : `#9AC3E250`,
                          yAxisID: 'y',
                        },
                        {
                          label: 'Listings',
                          data: showList ? chartData?.map((chart: any, index: number) => {
                            return chart?.list || 0
                          }) : [],
                          borderColor: 'rgb(246, 151, 153)',
                          backgroundColor: 'rgba(246, 151, 153, 0.5)',
                          yAxisID: 'y1',
                        },
                      ],

                    }}
                  /> :
                  <Skeleton animation="wave" width={`100%`} height={`360px`} />
              }
            </Stack>
          </Grid>

        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
          sx={{
            mt: 1,
            py: `0 !important`,
          }}
        >
          <Grid item lg={4} sx={{ py: `0 !important` }}>
            <Box
              sx={{ py: 1.5 }}
            >
              <Typography variant={'h6'} sx={{ color: theme => theme.palette.common.white }}>
                Pricing Spread
              </Typography>
            </Box>
          </Grid>

          <Grid item lg={4} sx={{ py: `0 !important` }}>
            <Box
              sx={{ py: 1.5 }}
            >
              <Typography variant={'h6'} sx={{ color: theme => theme.palette.common.white }}>
                Last Sales
              </Typography>
            </Box>
          </Grid>

          <Grid item lg={4} sx={{ py: `0 !important` }}>
            <Box
              sx={{ py: 1.5 }}
            >
              <Typography variant={'h6'} sx={{ color: theme => theme.palette.common.white }}>
                Lowest Listings
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
          sx={{
            mt: 1,
            py: `0 !important`,
          }}
        >

          <Grid item lg={4} sx={{ py: `0 !important` }}>
            <Stack
              direction={`column`}
              alignItems={`stretch`}
              justifyContent={`flex-start`}
              sx={{
                overflow: `auto`,
                maxHeight: `40vh`,
              }}
            >
              <TableContainer
                component={`div`}
              >
                <Table
                  aria-label="simple table"
                  sx={{
                    tableLayout: `fixed`,
                    width: `100%`,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          border: `none`,
                          p: 1,
                          pl: 4,
                          background: theme => `${theme.palette.neutral.paper}`,
                          borderTopLeftRadius: 4
                        }}
                      >
                        <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                          Solana | Count
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.paper}`,
                          borderTopRightRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                  </TableBody>
                </Table>
              </TableContainer>

              <Stack
                direction={`row`}
                alignItems={`center`}
                justifyContent={`center`}
                sx={{
                  px: 2,
                  minHeight: `30vh`
                }}
              >
                {
                  priceDistributes ?
                    <Bar
                      options={{
                        plugins: {
                          title: {
                            display: false,
                            text: 'Chart.js Bar Chart - Stacked',
                          },
                        },
                        responsive: true,
                        scales: {
                          x: {
                            stacked: true,
                          },
                          y: {
                            stacked: true,
                          },
                        },
                      }}
                      data={{
                        labels: spreadData.map((val: any, index: number) => { return (val?.spread || 0) }) || [],
                        datasets: [
                          {
                            label: 'Count',
                            data: spreadData.map((val: any, index: number) => { return (val?.count || 0) }) || [],
                            backgroundColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF` : `#73ADD7`,
                          }
                        ],
                      }}
                    /> :
                    <Skeleton animation="wave" width={`100%`} height={`30vh`} />
                }
              </Stack>
            </Stack>
          </Grid>

          <Grid item lg={4} sx={{ py: `0 !important` }}>
            <Box
              sx={{
                background: theme => theme.palette.background.default,
                height: `100%`,
              }}
            >
              <TableContainer
                component={`div`}
                sx={{
                  overflowX: `hidden`,
                  overflowY: `auto`,
                  maxHeight: `40vh`,
                }}
              >
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{
                    tableLayout: `fixed`,
                    width: `100%`,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: `5%`,
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.paper}`,
                          borderTopLeftRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                      <TableCell
                        sx={{
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.paper}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: `flex`,
                            alignItems: `center`,
                            justifyContent: `center`
                          }}
                        >
                          <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                            nft
                          </Typography>
                        </Box>
                      </TableCell>
                      {
                        lastSalesField.map((menu: any, index: number) => {
                          return (
                            <TableCell
                              sx={{
                                border: `none`,
                                p: 1,
                                background: theme => `${theme.palette.neutral.paper}`,
                              }}
                              key={index}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                                  {menu.field}
                                </Typography>
                              </Box>
                            </TableCell>
                          );
                        })
                      }
                      <TableCell
                        sx={{
                          width: `5%`,
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.paper}`,
                          borderTopRightRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      overflow: `hidden`
                    }}
                  >
                    {lastSalesData?.map((track: any, index: number) => (
                      <TableRow
                        key={index}
                      >
                        <TableCell
                          sx={{
                            border: `none`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          &nbsp;
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Avatar src={track?.image} />
                          </Box>

                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {track?.name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {numberToFix(track?.amount)}
                            </Typography>
                            <Box
                              component={`img`}
                              src={`/images/icons/sol.svg`}
                              sx={{
                                ml: 1,
                                width: `12px`,
                                height: `12px`
                              }}
                            ></Box>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {
                                `${new Date(parseInt(track?.blocktime)).getMonth() + 1} / ${new Date(parseInt(track?.blocktime)).getDate()}`
                              }
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Link href={`${getMarketplace(track?.marketplaceName)}${track?.mint}`} passHref>
                              <a target="_blank">
                                <Box
                                  sx={{
                                    display: `flex`,
                                    alignItems: `center`,
                                    justifyContent: `center`
                                  }}
                                >
                                  <Avatar src={`${getMarketplaceImage(track?.marketplaceName)}`} />
                                </Box>
                              </a>
                            </Link>

                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          &nbsp;
                        </TableCell>
                      </TableRow>
                    ))}

                    {
                      (!lastSalesData) &&
                      new Array(5).fill(undefined).map((val, index) => {
                        return (
                          <TableRow
                            key={index}
                          >
                            <TableCell
                              sx={{
                                border: `none`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              &nbsp;
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Skeleton variant="circular" width={36} height={36} />
                              </Box>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              sx={{
                                border: `none`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              &nbsp;
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }

                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          <Grid item lg={4} sx={{ py: `0 !important` }}>
            <Box
              sx={{
                background: theme => theme.palette.background.default,
                height: `100%`
              }}
            >
              <TableContainer
                component={`div`}
                sx={{
                  overflowX: `hidden`,
                  overflowY: `auto`,
                  maxHeight: `40vh`,
                }}
              >
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{
                    tableLayout: `fixed`,
                    width: `100%`,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: `5%`,
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.paper}`,
                          borderTopLeftRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                      <TableCell
                        sx={{
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.paper}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: `flex`,
                            alignItems: `center`,
                            justifyContent: `center`
                          }}
                        >
                          <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                            nft
                          </Typography>
                        </Box>
                      </TableCell>
                      {
                        lowestListingField.map((menu: any, index: number) => {
                          return (
                            <TableCell
                              sx={{
                                border: `none`,
                                p: 1,
                                background: theme => `${theme.palette.neutral.paper}`,
                              }}
                              key={index}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                                  {menu.field}
                                </Typography>
                              </Box>
                            </TableCell>
                          );
                        })
                      }
                      <TableCell
                        sx={{
                          width: `5%`,
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.paper}`,
                          borderTopRightRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      overflow: `hidden`
                    }}
                  >
                    {entireData?.lowestNfts?.map((track: any, index: number) => (
                      <TableRow
                        key={index}
                      >
                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >&nbsp;</TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Avatar src={track?.image} />
                          </Box>

                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {
                                track?.name
                              }
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {numberToFix(track?.listingPrice)}
                            </Typography>
                            <Box
                              component={`img`}
                              src={`/images/icons/sol.svg`}
                              sx={{
                                ml: 1,
                                width: `12px`,
                                height: `12px`
                              }}
                            ></Box>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Link href={`${getMarketplace(track?.marketplace)}${track?.mint}`} passHref>
                              <a target="_blank">
                                <Box
                                  sx={{
                                    display: `flex`,
                                    alignItems: `center`,
                                    justifyContent: `center`
                                  }}
                                >
                                  <Avatar src={`${getMarketplaceImage(track?.marketplace)}`} />
                                </Box>
                              </a>
                            </Link>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            background: theme => `${theme.palette.neutral.common}`,
                            py: 1,
                            px: 1,
                          }}
                        >&nbsp;</TableCell>
                      </TableRow>
                    ))}

                    {
                      (entireData?.lowestNfts == undefined || entireData?.lowestNfts == null) &&
                      new Array(5).fill(undefined).map((val: undefined, index: number) => {
                        return (
                          <TableRow
                            key={index}
                          >
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >&nbsp;</TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Skeleton variant="circular" width={36} height={36} />
                              </Box>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >&nbsp;</TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

        </Grid>

        <Snackbar open={isShowMessage} autoHideDuration={5000} onClose={closeMessage} sx={{ zIndex: 10001 }}>
          <Alert onClose={closeMessage} severity={messageSeverity} sx={{ width: '100%', zIndex: 10001 }}>
            {messageContent}
          </Alert>
        </Snackbar>
      </Box>
    </>

  );
}

export default Nfts;
