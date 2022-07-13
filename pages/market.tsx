import React, { Fragment, useEffect, useRef, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

import moment from 'moment';

import { RootState } from "redux/store";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { Avatar, Grid, Hidden } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';

import { getMarketplace, getMarketplaceImage } from "src/common/services/getMarketplace";
import { numberToFix, parseNumber } from "src/common/utils/helpers";
import { getActionType, getActionColor } from "src/helper/getActionType";
import getCollectionName from "src/helper/getCollectionName"
import { DATA_API, LIMIT_COLUMNS, TIME_RANGE, MARKET_ANALYSTIC_PERIOD, LIMIT_PAGE_SIZE, ACTION_TYPE, SNIPER_API, CORS_PROXY_SERVER, SNIPER_ACTION_TYPE } from "src/common/config";
import WhiteCircle from 'src/components/IconButton/WhiteCircle';
import WhiteDown from 'src/components/IconButton/WhiteDown';
import WhiteUp from "@components/IconButton/WhiteUp";
import fetchData from "src/common/services/getDataWithAxios";
import { delayTime, useInterval } from "src/helper/utility"

import PaperButton from "src/components/PaperButton";
import PageInfo from "@components/PageContainer/PageInfo";
import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';
import AddMarket from "@components/IconButton/AddMarket";
import ZoomGlass from "@components/IconButton/ZoomGlass";
import { truncateSync } from "fs";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const trackFields: {
  menu: string,
  field: string,
  isStatistic: boolean,
  isLamport: boolean
}[] = [
    {
      menu: `project`,
      field: `name`,
      isStatistic: false,
      isLamport: false
    },
    {
      menu: `listed`,
      field: `listedCount`,
      isStatistic: false,
      isLamport: false
    },
    {
      menu: `% change`,
      field: `listedCount1DayDelta`,
      isStatistic: true,
      isLamport: false
    },
    {
      menu: `floor`,
      field: `floor`,
      isStatistic: false,
      isLamport: true
    },
    {
      menu: `% change`,
      field: `floor1DayDelta`,
      isStatistic: true,
      isLamport: true
    },
    {
      menu: `volume`,
      field: `volume`,
      isStatistic: false,
      isLamport: true
    },
    {
      menu: `% change`,
      field: `volume1DayDelta`,
      isStatistic: true,
      isLamport: false
    }
  ];

const tickerFields: {
  title: String
}[] = [
    { title: `project` },
    { title: `name` },
    { title: `price` },
    { title: `type` },
    { title: `time` },
    { title: `link` },
  ];

const hightestSales: {
  title: String
}[] = [
    { title: `project` },
    { title: `name` },
    { title: `price` },
    { title: `link` }
  ]

const lowestListings: {
  title: String
}[] = [
    { title: `project` },
    { title: `% drop` },
    { title: `price` },
    { title: `link` }
  ]

let activityTempData: any[] | null = null;
let tempOriginalTickerData = [];
let globalPeriod = MARKET_ANALYSTIC_PERIOD.HOUR;

const market = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const mainTheme = useAppSelector((state: RootState) => state.isOwner.theme);

  // For TopTrends
  const [myTracksData, setMyTracksData] = useState<any[] | null>(null);
  const [percentChange, setPercentChange] = useState<any[] | null>(null);
  const [loadedPercent, setLoadedPercent] = useState<boolean>(true);

  // For Ticker mode
  const [tickerModes, setTickerModes] = useState<string[]>([SNIPER_ACTION_TYPE.LISTING, SNIPER_ACTION_TYPE.SALE]);

  // For alert message
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>(``);
  const [messageSeverity, setMessageSeverity] = useState<AlertColor>(`success`);

  const [period, setPeriod] = useState<number>(MARKET_ANALYSTIC_PERIOD.HOUR);

  const [originalTickerData, setOriginalTickerData] = useState<any[]>([]);
  const [originalTickerChanged, setOriginalTickerChanged] = useState<boolean>(true);
  const [tickerData, setTickerData] = useState<any[]>([]);
  const [tickerTempInterval, setTickerTempInterval] = useState<number>(0);
  const [tickerOneInterval, setTickerOneInterval] = useState<number>(0);
  const [hyperInterval, setHyperInterval] = useState<number>(0);

  const [highestSalesData, setHightestSalesData] = useState<any[]>([]);
  const [lowestListingsData, setLowestListingsData] = useState<any[]>([]);

  const [statistic, setStatistic] = useState<{ sales: number, listings: number, delistings: number }>({
    sales: 0,
    listings: 0,
    delistings: 0
  });

  const [sortMode, setSortMode] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>('volume1DayDelta');

  // For Real time fetching
  const [timer, setTimer] = React.useState(null);

  const [loadingTicker, setLoadingTicker] = useState<boolean>(true);
  const [loadingHightest, setLoadingHightest] = useState<boolean>(false);
  const [getHightest, setGetHightest] = useState<boolean>(false);
  const [loadingLowest, setLoadingLowest] = useState<boolean>(false);
  const [getLowest, setGetLowest] = useState<boolean>(false);

  const closeMessage = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsShowMessage(false);
  };

  const getPercentChange = async () => {
    try {
      new Promise((myResolve, myReject) => {
        const fetched: any = fetchData({
          method: `get`,
          route: `${DATA_API.SNIPER_API.COMMON}${DATA_API.SNIPER_API.PERCENT_CHANGE}`
        });

        myResolve(fetched);
      }).then((res: any) => {
        let result: any = res;
        if (result && Array.isArray(result)) {
          setPercentChange([...result]);
          setLoadedPercent(!loadedPercent);
        }
      });
    }
    catch (err) {

    }
  }

  const getCollectionDetail = async (symbol: string) => {
    try {

      const fetched: any = await fetchData({
        method: `get`,
        route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${`root`}/${symbol}`
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

  const sortData = async (field: string) => {
    if (field) {
      const tempMyTrackData = myTracksData;
      tempMyTrackData.sort((a: any, b: any) => {
        if (field == `name`) {
          return sortMode ? ('' + a[field]).localeCompare(b[field]) : ('' + b[field]).localeCompare(a[field]);
        }
        else {
          return sortMode ? (a[field] - b[field]) : (b[field] - a[field]);
        }
      });
      setMyTracksData([...tempMyTrackData]);
      setSortField(field);
      setSortMode(!sortMode);
    }
    else {
      setIsShowMessage(true);
      setMessageContent(`Invalid Field! Please try again.`);
      setMessageSeverity(`warning`);
    }
  }

  const getTickerData = async () => {
    try {
      setLoadingTicker(true);
      const fetched: any = await fetchData({
        method: `get`,
        route: `${DATA_API.SNIPER_API.COMMON}${DATA_API.SNIPER_API.ACTIVITIES}`
      });

      let result: any = fetched;
      if (result && Array.isArray(result)) {
        activityTempData = [...result];
        const cutData = activityTempData.slice(-1 * LIMIT_COLUMNS * 2);
        setOriginalTickerData([...cutData]);
        tempOriginalTickerData = [...cutData];
        setOriginalTickerChanged(!originalTickerChanged);
      }
      setLoadingTicker(false);
    }
    catch (err) {

    }
  }

  const getHighestData = async () => {
    if (!getHightest) {
      setLoadingHightest(true);
    }
    new Promise((myResolve, myReject) => {
      const fetched: any = fetchData({
        method: `get`,
        route: `${DATA_API.SNIPER_API.COMMON}${DATA_API.SNIPER_API.LAST_SOLD_ACTIVITY}`
      });
      myResolve(fetched);
    }).then((res) => {
      let result: any = res || [];
      setLoadingHightest(false);
      setGetHightest(true);
      if (result && Array.isArray(result)) {
        const temp = result.sort((a: any, b: any) => {
          return b?.amount - a?.amount
        }).slice(0, LIMIT_COLUMNS - 1);
        setHightestSalesData([...temp]);
      }
    });
  }

  const getLowestData = async () => {
    if (!getLowest) {
      setLoadingLowest(true);
    }

    if (activityTempData) {
      const temp = activityTempData.filter((val: any) => {
        return val?.type == SNIPER_ACTION_TYPE.LISTING
      }).sort((a: any, b: any) => {
        return b?.amount - a?.amount;
      }).slice(0, LIMIT_COLUMNS - 1);
      setLoadingLowest(false);
      setGetLowest(true);
      setLowestListingsData([...temp]);
    }
  }

  const fetchInterval = () => {
    try {
      getLowestData();
      getHighestData();
    } catch (error) {

    } finally {

    }
  }

  const fetchTickerTempInterval = async () => {
    const id = window.setInterval(async () => {
      setTickerTempInterval(tickerTempInterval => tickerTempInterval + 0.000000001);
    }, (TIME_RANGE / 5))
    return id;
  }

  const fetchTickerOneInterval = async () => {
    const id = window.setInterval(async () => {
      setTickerOneInterval(tickerOneInterval => tickerOneInterval + 0.000000001);
    }, TIME_RANGE / 10)
    return id;
  }

  const getNewTickerOne = async () => {
    if (activityTempData && tempOriginalTickerData[0]) {
      const lastTicker: any = tempOriginalTickerData[0];
      const index = activityTempData.findIndex((val: any) => { return val?.signature == lastTicker?.signature });
      if (index == -1) {
        return activityTempData[activityTempData.length - 1] || null;
      }
      else if (index == 0) {
        return null;
      } else {

        return activityTempData[index - 1] || null;
      }
    }

    if (activityTempData && tempOriginalTickerData.length < 1) {
      return activityTempData[activityTempData.length - 1] || null;
    }
  }

  const fetchHyperInterval = async () => {
    const id = window.setInterval(async () => {
      setHyperInterval(hyperInterval => hyperInterval + 1);
    }, (TIME_RANGE * 6))
    return id;
  }

  useEffect(() => {
    (async () => {
      getTickerData();
      fetchHyperInterval();
      fetchTickerTempInterval();
      fetchTickerOneInterval();
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (!loadingTicker) {
        new Promise((myResolve, myReject) => {
          const fetched: any = fetchData({
            method: `get`,
            route: `${DATA_API.SNIPER_API.COMMON}${DATA_API.SNIPER_API.ACTIVITIES}`
          });
          myResolve(fetched);
        }).then(async (res) => {
          let temp: any = res || [];
          if (temp && Array.isArray(temp)) {
            if (activityTempData) {
              let tempOrigin = activityTempData.sort((a: any, b: any) => {
                return b?.blocktime - a?.blocktime
              });
              let curSigs = tempOrigin.map((act: any) => { return act?.signature });

              let filtered = temp.filter((act: any) => {
                let isIn = curSigs.findIndex((signature: string) => { return act?.signature == signature });
                if (isIn > -1) {
                  return false;
                }
                else {
                  return true;
                }
              });
              if (filtered.length > 0) {
                let res = [...filtered, ...tempOrigin];

                if (res.length > 200) {
                  const diff = res.length - 200;
                  for (let i = 0; i < diff; i++) {
                    res.pop();
                  }
                }
                activityTempData = [...res];
                setLoadingLowest(false);
              }
            }
          }
        });
      }
    })()
  }, [tickerTempInterval]);

  useEffect(() => {
    (async () => {
      if (!loadingTicker) {
        const newTicker = await getNewTickerOne();
        if (newTicker) {

          const saleData = tempOriginalTickerData.filter((act: any, index: number) => {
            return act?.type == SNIPER_ACTION_TYPE.SALE
          });
          const listingData = tempOriginalTickerData.filter((act: any, index: number) => {
            return act?.type == SNIPER_ACTION_TYPE.LISTING
          });
          const delistingData = tempOriginalTickerData.filter((act: any, index: number) => {
            return act?.type == SNIPER_ACTION_TYPE.CANCEL_LISTING
          });

          if (saleData.length < LIMIT_PAGE_SIZE && listingData.length < LIMIT_PAGE_SIZE && delistingData.length < LIMIT_PAGE_SIZE) {
            setOriginalTickerData([...[newTicker], ...tempOriginalTickerData]);
            tempOriginalTickerData = [...[newTicker], ...tempOriginalTickerData];
            setOriginalTickerChanged(!originalTickerChanged);
          }
          else {
            let temp = tempOriginalTickerData;
            let removalType = [];
            if (saleData.length >= LIMIT_PAGE_SIZE) {
              removalType.push(SNIPER_ACTION_TYPE.SALE);
            }

            if (listingData.length >= LIMIT_PAGE_SIZE) {
              removalType.push(SNIPER_ACTION_TYPE.LISTING);
            }

            if (delistingData.length >= LIMIT_PAGE_SIZE) {
              removalType.push(SNIPER_ACTION_TYPE.CANCEL_LISTING);
            }
            if (removalType.findIndex((val: string) => { return val == newTicker?.type }) > -1) {
              const removalIndex = tempOriginalTickerData.lastIndexOf((val: any) => { return val?.type == newTicker?.type });
              if (removalIndex > -1) {
                temp = tempOriginalTickerData.splice(removalIndex, 1);
              }
            }

            setOriginalTickerData([...[newTicker], ...temp]);
            tempOriginalTickerData = [...[newTicker], ...temp];
            setOriginalTickerChanged(!originalTickerChanged);
          }
        }
      }
    })()
  }, [tickerOneInterval]);

  useEffect(() => {
    (async () => {
      fetchInterval();
      getPercentChange();
    })()
  }, [hyperInterval]);

  useEffect(() => {
    (async () => {
      let temp = tempOriginalTickerData;
      if (!tickerModes.some((mode: string) => { return mode == SNIPER_ACTION_TYPE.LISTING; })) {
        temp = temp.filter((act: any, index: number) => {
          return act?.type != SNIPER_ACTION_TYPE.LISTING
        })
      }
      if (!tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.CANCEL_LISTING); })) {
        temp = temp.filter((act: any, index: number) => {
          return act?.type != SNIPER_ACTION_TYPE.CANCEL_LISTING
        })
      }
      if (!tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.SALE); })) {
        temp = temp.filter((act: any, index: number) => {
          return act?.type != SNIPER_ACTION_TYPE.SALE
        })
      }
      temp = temp.filter((act: any, index: number) => {
        return act?.type != SNIPER_ACTION_TYPE.MINT
      })

      const saleData = tempOriginalTickerData.filter((act: any, index: number) => {
        return act?.type == SNIPER_ACTION_TYPE.SALE
      });
      const listingData = tempOriginalTickerData.filter((act: any, index: number) => {
        return act?.type == SNIPER_ACTION_TYPE.LISTING
      });
      const delistingData = tempOriginalTickerData.filter((act: any, index: number) => {
        return act?.type == SNIPER_ACTION_TYPE.CANCEL_LISTING
      });
      const mintData = tempOriginalTickerData.filter((act: any, index: number) => {
        return act?.type == SNIPER_ACTION_TYPE.MINT
      });
      const all = tempOriginalTickerData?.length - mintData?.length;

      setStatistic({
        ...statistic,
        sales: saleData?.length / all || 0,
        listings: listingData?.length / all || 0,
        delistings: delistingData?.length / all || 0
      })
      setTickerData([...temp]);
    })()
  }, [tickerModes, originalTickerData, originalTickerChanged]);

  useEffect(() => {
    (async () => {
      globalPeriod = period;
      if (!loadingLowest) {
        getLowestData();
      }

      if (!loadingHightest) {
        getHighestData();
      }
    })()
  }, [period]);

  useEffect(() => {
    (async () => {
      if (percentChange) {
        let temp = percentChange.sort((a: any, b: any) => {
          const aprevVolume = (a?.volume * a?.volume1DayDelta) / (100 + a?.volume1DayDelta);
          const bprevVolume = (b?.volume * b?.volume1DayDelta) / (100 + b?.volume1DayDelta);
          return bprevVolume - aprevVolume;
        }).slice(0, ((LIMIT_COLUMNS * 2) - 1));

        temp.sort((a: any, b: any) => {
          if (sortField == `name`) {
            return sortMode ? ('' + a[sortField]).localeCompare(b[sortField]) : ('' + b[sortField]).localeCompare(a[sortField]);
          }
          else {
            return sortMode ? (a[sortField] - b[sortField]) : (b[sortField] - a[sortField]);
          }
        });

        // let res = [];
        // for (let i = 0; i < temp.length; i++) {
        //   //const detail = await getCollectionDetail(temp[i]?.symbol);
        //   res[i] = {
        //     ...temp[i],
        //     //image: detail?.image
        //   }
        // }
        setMyTracksData([...temp]);
      }
    })()
  }, [loadedPercent]);

  return (
    <>
      <PageInfo>
        {/* <ButtonGroup variant="contained" aria-label="outlined primary button group"
          sx={{
            '& .MuiButtonGroup-grouped': {
              borderRight: `none !important`,
            }
          }}
        >
          <PaperButton size={`medium`} selected={period == MARKET_ANALYSTIC_PERIOD.MONTH}
            sx={{
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4
            }}
            onClick={
              async () => {
                setPeriod(MARKET_ANALYSTIC_PERIOD.MONTH);
              }
            }
          >
            <Typography
              variant={`subtitle2`}

            >
              30 days
            </Typography>
          </PaperButton>
          <PaperButton size={`medium`} selected={period == MARKET_ANALYSTIC_PERIOD.WEEK}
            onClick={
              async () => {
                setPeriod(MARKET_ANALYSTIC_PERIOD.WEEK)
              }
            }
          >
            <Typography
              variant={`subtitle2`}

            >
              7 days
            </Typography>
          </PaperButton>
          <PaperButton size={`medium`} selected={period == MARKET_ANALYSTIC_PERIOD.DAY}
            onClick={
              async () => {
                setPeriod(MARKET_ANALYSTIC_PERIOD.DAY);
              }
            }
          >
            <Typography
              variant={`subtitle2`}

            >
              24 hours
            </Typography>
          </PaperButton>
          <PaperButton size={`medium`} selected={period == MARKET_ANALYSTIC_PERIOD.HOUR}
            sx={{
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4
            }}
            onClick={
              async () => {
                setPeriod(MARKET_ANALYSTIC_PERIOD.HOUR);
              }
            }
          >
            <Typography
              variant={`subtitle2`}

            >
              1 hour
            </Typography>
          </PaperButton>
        </ButtonGroup> */}
      </PageInfo>
      <Box component='section'
        sx={{
          display: `flex`,
          alignItems: `stretch`,
          justifyContent: `space-between`,
          mx: `auto`,
          px: 13,
          py: 1.5,
          background: `none`,
          overflow: `hidden`,
          position: `relative`,
          '* td *, th *': {
            wordBreak: `break-word`
          }
        }}
      >
        <Grid lg={6} > <Typography variant="h6" sx={{ color: theme => theme.palette.common.white }}>Trending Projects</Typography></Grid>
      </Box>

      <Box component='section'
        sx={{
          mx: `auto`,
          px: 13,
          background: `none`,
          position: `relative`
        }}
      >
        <TableContainer
          component={`div`}
          sx={{
            overflow: `auto`,
            position: `relative`,
            maxHeight: `50vh`
          }}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead
              sx={{
                background: theme => `${theme.palette.background.paper}`
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    border: `none`,
                    width: `3%`,
                    background: theme => theme.palette.neutral.paper,
                  }}

                >
                </TableCell>
                <TableCell
                  sx={{
                    background: theme => theme.palette.neutral.paper,
                    border: `none`,
                  }}
                >
                </TableCell>
                {
                  trackFields?.map((menu: any, index: number) => {
                    return (
                      <TableCell
                        sx={{
                          background: theme => theme.palette.neutral.paper,
                          width: index == 0 ? `15%` : `auto`,
                          border: `none`,
                          py: 1.5,
                          px: 1,
                          pl: index == 0 ? 3 : 1,
                          borderRight: [2, 4].includes(index) ? theme => `solid 1px ${theme.palette.common.white}` : `none`,
                        }}
                        key={index}
                      >
                        <Stack
                          direction={`row`}
                          alignItems={`center`}
                          justifyContent={
                            index == 0 ? `flex-start` : `center`
                          }
                        >
                          <Stack
                            direction={`column`}
                            alignItems={`center`}
                            justifyContent={`center`}
                          >
                            {
                              sortField == menu?.field ? (sortMode ?
                                <WhiteDown
                                  sx={{
                                    width: `1.5rem`,
                                    height: `1.5rem`,
                                    '&:hover': {
                                      cursor: `pointer`,
                                      opacity: 0.7
                                    },
                                    color: theme => theme.palette.common.white
                                  }}
                                  onClick={async () => {
                                    await sortData(menu?.field);
                                  }}
                                /> :
                                <WhiteUp
                                  sx={{
                                    width: `1.5rem`,
                                    height: `1.5rem`,

                                    '&:hover': {
                                      cursor: `pointer`,
                                      opacity: 0.7
                                    },
                                    color: theme => theme.palette.common.white
                                  }}
                                  onClick={async () => {
                                    await sortData(menu?.field);
                                  }}
                                />
                              ) :
                                <WhiteCircle
                                  sx={{
                                    width: `1.5rem`,
                                    height: `1.5rem`,
                                    '&:hover': {
                                      cursor: `pointer`,
                                      opacity: 0.7
                                    },
                                    color: theme => theme.palette.common.white,
                                    fill: `none`,
                                    stroke: theme => theme.palette.common.white,
                                  }}
                                  onClick={async () => {
                                    await sortData(menu?.field);
                                  }}
                                />
                            }
                            <Typography variant={`subtitle2`} sx={{ mt: 0.5, color: theme => theme.palette.common.white }}>
                              {menu.menu}
                            </Typography>

                          </Stack>
                        </Stack>
                      </TableCell>
                    );
                  })
                }
                <TableCell
                  sx={{
                    background: theme => theme.palette.neutral.paper,
                    border: `none`,
                    width: `3%`
                  }}
                >
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                myTracksData ?
                  (
                    myTracksData?.map((track: any, index: number) => (
                      <TableRow
                        key={track?.symbol}
                        sx={{
                          '&:hover': {
                            cursor: `pointer`
                          },
                        }}
                      >
                        <TableCell sx={{
                          border: `none`,
                          background: theme => `${theme.palette.neutral.common}`,
                          px: 1,
                          py: 1
                        }}> </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            px: 1,
                            py: 1
                          }}
                        >
                          <Box
                            component={`img`}
                            src={track?.image}
                            sx={{
                              width: `36px`,
                              height: `36px`,
                              borderRadius: `50%`
                            }}
                          >
                          </Box>
                        </TableCell>
                        {
                          trackFields?.map((field: any, _index: number) => {
                            return (
                              <>
                                <TableCell
                                  align="center"
                                  key={_index}
                                  sx={{
                                    borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                    borderRight: [2, 4].includes(_index) ? theme => `solid 1px ${theme.palette.neutral.main}` : `none`,
                                    background: theme => `${theme.palette.neutral.common}`,
                                    px: 1,
                                    py: 1,
                                    pl: _index == 0 ? 3 : 1,
                                  }}
                                >

                                  <Stack
                                    direction={`row`}
                                    alignItems={`center`}
                                    justifyContent={
                                      _index == 0 ? `flex-start` : `center`
                                    }
                                  >
                                    <Box
                                      sx={{
                                        display: `flex`,
                                        alignItems: `center`,
                                        justifyContent: `center`
                                      }}
                                    >
                                      {
                                        field?.isStatistic && track[field?.field] != undefined && track[field?.field] > 0 && <GreenUp sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} />
                                      }

                                      {
                                        field?.isStatistic && track[field?.field] != undefined && track[field?.field] < 0 && <RedDown sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} />
                                      }

                                      <Typography variant={`subtitle2`} color={`inherit`}>
                                        {
                                          field?.isStatistic && track[field?.field] != undefined && `${numberToFix(parseNumber(track[field?.field]))}%`
                                        }

                                        {
                                          !field?.isStatistic && !field?.isLamport && track[field?.field] != undefined && !isNaN(parseFloat(track[field?.field])) && numberToFix(track[field?.field])
                                        }

                                        {
                                          !field?.isStatistic && !field?.isLamport && track[field?.field] != undefined && isNaN(parseFloat(track[field?.field])) && track[field?.field]
                                        }

                                        {
                                          !field?.isStatistic && field?.isLamport && track[field?.field] != undefined && numberToFix((track[field?.field]))
                                        }
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </TableCell>
                              </>
                            );
                          })
                        }
                        <TableCell
                          sx={{
                            border: `none`,
                            background: theme => `${theme.palette.neutral.common}`,
                            px: 1,
                            py: 1
                          }}
                        > </TableCell>
                      </TableRow>
                    ))
                  ) :
                  (
                    new Array(10).fill(undefined).map((track: any, index: number) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:hover': {
                            cursor: `pointer`
                          }
                        }}
                      >
                        <TableCell sx={{
                          border: `none`,
                          background: theme => `${theme.palette.neutral.common}`,
                          px: 1,
                          py: 1
                        }}> </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: theme => `solid 2px ${theme.palette.primary.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            px: 1,
                            py: 1
                          }}
                        >
                          <Skeleton variant="circular" width={40} height={40} />
                        </TableCell>
                        {
                          trackFields?.map((field: any, _index: number) => {
                            return (
                              <TableCell
                                align="center"
                                key={_index}
                                sx={{
                                  borderBottom: theme => `solid 2px ${theme.palette.primary.main}`,
                                  borderRight: [2, 4].includes(_index) ? theme => `solid 1px ${theme.palette.neutral.main}` : `none`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  px: 1,
                                  py: 1,
                                  pl: _index == 0 ? 3 : 1,
                                }}
                              >

                                <Stack
                                  direction={`row`}
                                  alignItems={`center`}
                                  justifyContent={
                                    _index == 0 ? `flex-start` : `center`
                                  }
                                >
                                  <Box
                                    sx={{
                                      width: `100%`,
                                      mx: 1,
                                      display: `flex`,
                                      alignItems: `center`,
                                      justifyContent: `center`
                                    }}
                                  >
                                    <Typography variant={`subtitle2`} color={`inherit`} sx={{ width: `100%` }}>
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                            );
                          })
                        }
                        <TableCell sx={{
                          border: `none`,
                          background: theme => `${theme.palette.neutral.common}`,
                          px: 1,
                          py: 1
                        }}> </TableCell>
                        <TableCell sx={{ border: `none`, background: theme => `${theme.palette.neutral.common}`, }}> </TableCell>
                      </TableRow>
                    ))
                  )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Grid
        container
        spacing={2}
        direction={`row`}
        justifyContent={`space-between`}
        alignItems={`stretch`}
        sx={{
          px: 13,
          mb: 4
        }} >

        <Grid item
          lg={7}
          sm={12}
          direction="row"
          alignItems="stretch"
          justifyContent="flex-start"
        >
          <Box
            sx={{
              mx: `auto`,
              background: `none`,
              position: `relative`,
              width: `100%`,
              height: `100%`
            }}
          >
            <Stack direction='row' justifyContent="space-between" alignItems='center' sx={{
              borderRadius: '4px',
              py: 1.5,
            }} >
              <Grid>
                <Typography variant='h6' sx={{ color: theme => theme.palette.common.white }}>Ticker</Typography>
              </Grid>
              <Grid>
                <ButtonGroup>
                  <Box sx={{
                    background: tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.LISTING); }) ? theme => theme.palette.success.light : theme => theme.palette.background.paper,
                    px: 2,
                    py: 1.5,
                    borderRadius: '4px 0px 0px 4px',
                    '&:hover': {
                      cursor: `pointer`
                    }
                  }}
                    onClick={() => {
                      if (tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.LISTING); })) {
                        const temp = tickerModes.filter((mode) => { return mode != (SNIPER_ACTION_TYPE.LISTING); });
                        setTickerModes([...temp])
                      }
                      else {
                        setTickerModes([...tickerModes, ...[SNIPER_ACTION_TYPE.LISTING]]);
                      }
                    }}
                  >
                    <Typography variant='subtitle2' sx={{
                      color: `white`
                    }}
                    >listings</Typography>
                  </Box>

                  <Box sx={{
                    background: tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.CANCEL_LISTING); }) ? theme => theme.palette.success.light : theme => theme.palette.background.paper,
                    px: 2,
                    py: 1.5,
                    '&:hover': {
                      cursor: `pointer`
                    }
                  }}
                    onClick={() => {
                      if (tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.CANCEL_LISTING); })) {
                        const temp = tickerModes.filter((mode) => { return mode != (SNIPER_ACTION_TYPE.CANCEL_LISTING); });
                        setTickerModes([...temp])
                      }
                      else {
                        setTickerModes([...tickerModes, ...[SNIPER_ACTION_TYPE.CANCEL_LISTING]]);
                      }
                    }}
                  >
                    <Typography variant='subtitle2' sx={{
                      color: `white`
                    }}>delistings</Typography>
                  </Box>

                  <Box sx={{
                    background: tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.SALE); }) ? theme => theme.palette.success.light : theme => theme.palette.background.paper,
                    px: 2,
                    py: 1.5,
                    borderRadius: '0px 4px 4px 0px',
                    '&:hover': {
                      cursor: `pointer`
                    }
                  }}
                    onClick={() => {
                      if (tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.SALE); })) {
                        const temp = tickerModes.filter((mode) => { return mode != (SNIPER_ACTION_TYPE.SALE); });
                        setTickerModes([...temp])
                      }
                      else {
                        setTickerModes([...tickerModes, ...[SNIPER_ACTION_TYPE.SALE]]);
                      }
                    }}
                  >
                    <Typography variant='subtitle2' sx={{
                      color: `white`
                    }}>sales</Typography>
                  </Box>
                </ButtonGroup>
              </Grid>
            </Stack>

            <TableContainer
              component={`div`}
              sx={{
                overflow: `auto`,
                position: `relative`,
                minHeight: `100vh`,
                maxHeight: `100vh`,
                '& *': {
                  transition: `all 1000ms ease-in-out`
                }
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead
                  sx={{
                    background: theme => `${theme.palette.background.paper}`
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        width: '3%',
                        border: `none`,
                        background: theme => theme.palette.neutral.paper
                      }}
                    ></TableCell>
                    <TableCell
                      sx={{
                        border: `none`,
                        textAlign: 'center',
                        background: theme => theme.palette.neutral.paper
                      }}
                    >
                    </TableCell>
                    {
                      tickerFields?.map((menu: any, index: number) => {
                        return (
                          <TableCell
                            sx={{
                              background: theme => theme.palette.neutral.paper,
                              width: index == 0 ? `15%` : `auto`,
                              border: `none`,
                              textAlign: 'center'
                            }}
                            key={index}
                          >
                            <Stack
                              direction={`row`}
                              alignItems={`center`}
                              justifyContent={
                                index == 0 ? 'flex-start' :
                                  `center`
                              }
                            >
                              <Typography variant={`subtitle2`} sx={{ mt: 0.5, color: theme => theme.palette.common.white }}>
                                {menu.title}
                              </Typography>

                            </Stack>
                          </TableCell>
                        );
                      })
                    }
                    <TableCell
                      sx={{
                        width: '3%',
                        border: `none`,
                        background: theme => theme.palette.neutral.paper,
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {
                    !loadingTicker && tickerData?.map((ticker: any, index: number) => {
                      return <TableRow key={ticker?.signature}>
                        <TableCell sx={{
                          border: 'none',
                          background: theme => `${theme.palette.neutral.common}`,
                          p: 1,
                          py: 1
                        }} />
                        <TableCell
                          sx={{
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Box
                              component={`img`}
                              src={ticker?.image}
                              sx={{
                                width: `36px`,
                                height: `36px`,
                                borderRadius: `50%`
                              }}
                            >
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Typography variant='subtitle2' >
                            {getCollectionName(ticker?.name)}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Typography variant='subtitle2'>
                            {ticker?.name}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Stack
                            direction={`row`}
                            alignItems={`center`}
                            justifyContent={`center`}
                          >
                            <Typography variant='subtitle2' >{(ticker?.amount && ticker?.type != SNIPER_ACTION_TYPE.CANCEL_LISTING) && `${numberToFix(ticker?.amount)}`}</Typography>
                            {
                              (ticker?.amount && ticker?.type != SNIPER_ACTION_TYPE.CANCEL_LISTING) &&
                              <Box
                                component={`img`}
                                src={`/images/icons/sol.svg`}
                                sx={{
                                  ml: 1,
                                  width: `12px`,
                                  height: `12px`
                                }}
                              >
                              </Box>
                            }
                          </Stack>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Chip
                            label={ticker?.type && `${getActionType(ticker?.type)}`}
                            color={ticker?.type ? `${getActionColor(ticker?.type)}` : `default`}
                            sx={{
                              '& *': {
                                fontSize: `10px`,
                                color: theme => theme.palette.common.white,
                              },
                              height: `18px`,
                              borderRadius: `2px !important`
                            }}
                            size={`small`}
                          />

                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Typography variant='subtitle2'>
                            {
                              `${`0${new Date(parseInt(ticker?.blocktime)).getHours()}`.slice(-2)}:`
                            }
                            {
                              `${`0${new Date(parseInt(ticker?.blocktime)).getMinutes()}`.slice(-2)}:`
                            }
                            {
                              `${`0${new Date(parseInt(ticker?.blocktime)).getSeconds()}`.slice(-2)}`
                            }

                            {

                            }
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{
                            cursor: 'pointer'
                          }} >
                            <Link href={`${getMarketplace(ticker?.marketplaceName)}${ticker?.mint}`} passHref>
                              <a target="_blank">
                                <Box
                                  sx={{
                                    display: `flex`,
                                    alignItems: `center`,
                                    justifyContent: `center`
                                  }}
                                >
                                  <Box
                                    component={`img`}
                                    src={`${getMarketplaceImage(ticker?.marketplaceName)}`}
                                    sx={{
                                      width: `36px`,
                                      height: `36px`,
                                      borderRadius: `50%`
                                    }}
                                  >
                                  </Box>
                                </Box>
                              </a>
                            </Link>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ background: theme => `${theme.palette.neutral.common}`, border: 'none', }} />
                      </TableRow>
                    })
                  }
                  {
                    loadingTicker && new Array(20).fill(undefined).map((val: any, index: number) => {
                      return <TableRow
                        key={index}
                      >
                        <TableCell sx={{
                          border: 'none',
                          background: theme => `${theme.palette.neutral.common}`,
                          p: 1,
                          py: 1
                        }} />

                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Skeleton variant="circular" width={36} height={36} />
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}>
                            {
                              <Skeleton animation="wave" sx={{ width: `100%` }} />
                            }
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}> <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}> <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}> <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}> <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => `${theme.palette.neutral.common}`,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{
                            cursor: 'pointer',
                            width: `100%`
                          }} > <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell sx={{
                          border: 'none',
                          background: theme => `${theme.palette.neutral.common}`,
                          p: 1,
                          py: 1
                        }} ></TableCell>
                      </TableRow>
                    })
                  }
                </TableBody>
              </Table >
            </TableContainer >
          </Box >
        </Grid >

        <Grid item
          lg={5}
          sm={12}
          direction="row"
          alignItems="stretch"
          justifyContent="flex-start"
        >
          <Box
            sx={{
              mx: `auto`,
              background: `none`,
              position: `relative`,
              width: `100%`
            }}
          >
            <Stack direction='row' justifyContent="space-between" alignItems='center' sx={{
              py: 2.8
            }} >
              <Grid>
                <Typography variant='h6' sx={{ color: theme => theme.palette.common.white }}>Market Overview</Typography>
              </Grid>
            </Stack>

            <TableContainer
              component={`div`}
              sx={{
                overflow: `auto`,
                position: `relative`
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>

                    <TableCell
                      sx={{
                        background: theme => theme.palette.neutral.paper,
                        border: `none`,
                        px: 1.5,
                        py: 2.2
                      }}
                    >
                      <Stack
                        direction={`row`}
                        alignItems={`center`}
                      >
                        <Stack
                          direction={`column`}
                          alignItems={`center`}
                          justifyContent={`center`}
                        >

                          <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                            Activity Overview
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  <TableRow sx={{
                    display: 'flex', justifyContent: 'space-between', pt: 1.5, pb: 0.5,
                    px: 1.5,
                  }} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" >Sales&nbsp;</Typography>
                      <Typography variant="subtitle2" >{numberToFix(statistic.sales * 100)}%</Typography>
                    </Box>
                    <Box maxWidth={`80%`} width={`${80 * statistic.sales}%`} height={20} sx={{
                      background: theme => theme.palette.neutral.contrast
                    }} />
                  </TableRow>

                  <TableRow sx={{
                    display: 'flex', justifyContent: 'space-between', pt: 0.5, pb: 0.5,
                    px: 1.5,
                  }} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" >Listings&nbsp;</Typography>
                      <Typography variant="subtitle2" >{numberToFix(statistic.listings * 100)}%</Typography>
                    </Box>
                    <Box maxWidth={`80%`} width={`${80 * statistic.listings}%`} height={20} sx={{
                      background: theme => theme.palette.neutral.contrast
                    }} />
                  </TableRow>

                  <TableRow sx={{
                    display: 'flex', justifyContent: 'space-between', pt: 0.5, pb: 1.5,
                    px: 1.5,
                  }} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" >Delistings&nbsp;</Typography>
                      <Typography variant="subtitle2" >{numberToFix(statistic.delistings * 100)}%</Typography>
                    </Box>
                    <Box maxWidth={`80%`} width={`${80 * statistic.delistings}%`} height={20} sx={{
                      background: theme => theme.palette.neutral.contrast
                    }} />
                  </TableRow>

                </TableBody>
              </Table >
            </TableContainer >
          </Box>

          <Box
            sx={{
              mx: `auto`,
              background: `none`,
              position: `relative`,
              width: `100%`
            }}
          >
            <Stack direction='row' justifyContent="space-between" alignItems='center'
              sx={{
                py: 1.5
              }}
            >
              <Typography variant='h6' sx={{ color: theme => theme.palette.common.white }}>Highest Sales</Typography>
              <Typography variant='subtitle2' sx={{ color: theme => theme.palette.common.white }}>last 1k transaction</Typography>
            </Stack>
            <TableContainer
              component={`div`}
              sx={{
                overflowX: `hidden`,
                overflowY: `auto`,
                position: `relative`,
                minHeight: `calc(50vh - 114px)`,
                maxHeight: `calc(50vh - 114px)`
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead
                  sx={{
                    background: theme => `${theme.palette.background.paper}`
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ border: `none`, width: `3%`, background: theme => theme.palette.neutral.paper }} />
                    <TableCell
                      sx={{
                        border: `none`,
                        py: 2.2,
                        px: 1,
                        background: theme => theme.palette.neutral.paper
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
                      hightestSales?.map((item: any, index: any) => {
                        return (
                          <TableCell
                            sx={{
                              width: index == 0 ? `25%` : `auto`,
                              border: `none`,
                              py: 2.2,
                              px: 1,
                              background: theme => theme.palette.neutral.paper
                            }}
                            key={index}
                          >
                            <Stack
                              direction={`row`}
                              alignItems={`center`}
                              justifyContent={index == 0 ? `flex-start` : `center`}
                            >
                              <Stack
                                direction={`column`}
                                alignItems={`center`}
                                justifyContent={`center`}
                              >

                                <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                                  {item.title}
                                </Typography>
                              </Stack>
                            </Stack>
                          </TableCell>
                        )
                      })
                    }
                    <TableCell sx={{ border: `none`, width: `3%`, background: theme => theme.palette.neutral.paper }} />
                  </TableRow>
                </TableHead>

                <TableBody>

                  {
                    !loadingHightest ? (
                      highestSalesData?.map((data: any, index: number) => {
                        return (
                          <TableRow key={data?.signature}>
                            <TableCell
                              sx={{
                                border: `none`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                              }}
                            >
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
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

                                <Box
                                  component={`img`}
                                  src={data?.image}
                                  sx={{
                                    width: `36px`,
                                    height: `36px`,
                                    borderRadius: `50%`
                                  }}
                                >
                                </Box>
                              </Box>

                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Typography variant='subtitle2' >{getCollectionName(data?.name)}</Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                                textAlign: `center`
                              }}
                            >
                              <Typography variant='subtitle2' >{data?.name}</Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                                textAlign: `center`
                              }}
                            >
                              <Stack
                                direction={`row`}
                                alignItems={`center`}
                                justifyContent={`center`}
                              >
                                <Typography variant='subtitle2' >{data?.amount && `${numberToFix(data?.amount)}`}</Typography>

                                <Box
                                  component={`img`}
                                  src={`/images/icons/sol.svg`}
                                  sx={{
                                    ml: 1,
                                    width: `12px`,
                                    height: `12px`
                                  }}
                                >
                                </Box>
                              </Stack>

                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                                textAlign: `center`,
                              }}
                            >
                              <Typography variant='subtitle2' sx={{ cursor: 'pointer' }} >
                                <Link href={`${getMarketplace(data?.marketplace)}${data?.mint}`} passHref>
                                  <a target="_blank">
                                    <Box
                                      sx={{
                                        display: `flex`,
                                        alignItems: `center`,
                                        justifyContent: `center`
                                      }}
                                    >
                                      <Box
                                        component={`img`}
                                        src={`${getMarketplaceImage(data?.marketplace)}`}
                                        sx={{
                                          width: `36px`,
                                          height: `36px`,
                                          borderRadius: `50%`
                                        }}
                                      >
                                      </Box>
                                    </Box>
                                  </a>
                                </Link>
                              </Typography>
                            </TableCell>
                            <TableCell sx={{
                              border: `none`,
                              background: theme => `${theme.palette.neutral.common}`,
                              py: 1,
                              px: 1,
                            }} />
                          </TableRow>
                        )
                      })
                    ) :
                      (
                        new Array(10).fill(undefined).map((data: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                }} />
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
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`,
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ cursor: 'pointer', width: `100%` }} >
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                }}
                              />
                            </TableRow>
                          )
                        })
                      )
                  }
                </TableBody>
              </Table >
            </TableContainer >
          </Box>

          <Box
            sx={{
              mx: `auto`,
              background: `none`,
              position: `relative`,
              width: `100%`
            }}
          >
            <Stack direction='row' justifyContent="space-between" alignItems='center' sx={{
              py: 1.5
            }}>
              <Typography variant='h6' sx={{ color: theme => theme.palette.common.white }}>Lowest Listings</Typography>
              <Typography variant='subtitle2' sx={{ color: theme => theme.palette.common.white }}>based off 24 hour average sale</Typography>
            </Stack>
            <TableContainer
              component={`div`}
              sx={{
                overflowX: `hidden`,
                overflowY: `auto`,
                position: `relative`,
                minHeight: `calc(50vh - 115px)`,
                maxHeight: `calc(50vh - 115px)`
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead
                  sx={{
                    background: theme => `${theme.palette.background.paper}`
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ border: `none`, width: `3%`, background: theme => theme.palette.neutral.paper }} />
                    <TableCell
                      sx={{
                        border: `none`,
                        py: 2.2,
                        px: 1,
                        background: theme => theme.palette.neutral.paper
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
                      lowestListings?.map((item: any, index: any) => {
                        return (
                          <TableCell
                            sx={{
                              width: index == 0 ? `25%` : `auto`,
                              border: `none`,
                              py: 2.2,
                              px: 1,
                              background: theme => theme.palette.neutral.paper
                            }}
                            key={index}
                          >
                            <Stack
                              direction={`row`}
                              alignItems={`center`}
                              justifyContent={index == 0 ? `flex-start` : `center`}
                            >
                              <Stack
                                direction={`column`}
                                alignItems={`center`}
                                justifyContent={`center`}
                              >

                                <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                                  {item.title}
                                </Typography>
                              </Stack>
                            </Stack>
                          </TableCell>
                        )
                      })
                    }
                    <TableCell sx={{ border: `none`, width: `3%`, background: theme => theme.palette.neutral.paper }} />
                  </TableRow>
                </TableHead>

                <TableBody>

                  {
                    !loadingLowest ? (
                      lowestListingsData?.map((data: any, index: number) => {
                        return (
                          <TableRow key={data?.signature}>
                            <TableCell
                              sx={{
                                border: `none`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                              }}
                            >
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
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
                                <Box
                                  component={`img`}
                                  src={data?.image}
                                  sx={{
                                    width: `36px`,
                                    height: `36px`,
                                    borderRadius: `50%`
                                  }}
                                >
                                </Box>
                              </Box>

                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Typography variant='subtitle2' >{getCollectionName(data?.name)}</Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                                textAlign: `center`
                              }}
                            >
                              <Typography variant='subtitle2' >{data?.name}</Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                                textAlign: `center`
                              }}
                            >
                              <Stack
                                direction={`row`}
                                alignItems={`center`}
                                justifyContent={`center`}
                              >
                                <Typography variant='subtitle2' >{data?.amount && `${numberToFix(data?.amount)}`}</Typography>

                                <Box
                                  component={`img`}
                                  src={`/images/icons/sol.svg`}
                                  sx={{
                                    ml: 1,
                                    width: `12px`,
                                    height: `12px`
                                  }}
                                >
                                </Box>
                              </Stack>

                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => `${theme.palette.neutral.common}`,
                                py: 1,
                                px: 1,
                                textAlign: `center`,
                              }}
                            >
                              <Typography variant='subtitle2' sx={{ cursor: 'pointer' }} >
                                <Link href={`${getMarketplace(data?.marketplaceName)}${data?.mint}`} passHref>
                                  <a target="_blank">
                                    <Box
                                      sx={{
                                        display: `flex`,
                                        alignItems: `center`,
                                        justifyContent: `center`
                                      }}
                                    >
                                      <Box
                                        component={`img`}
                                        src={`${getMarketplaceImage(data?.marketplaceName)}`}
                                        sx={{
                                          width: `36px`,
                                          height: `36px`,
                                          borderRadius: `50%`
                                        }}
                                      >
                                      </Box>
                                    </Box>
                                  </a>
                                </Link>
                              </Typography>
                            </TableCell>
                            <TableCell sx={{
                              border: `none`,
                              background: theme => `${theme.palette.neutral.common}`,
                              py: 1,
                              px: 1,
                            }} />
                          </TableRow>
                        )
                      })
                    ) :
                      (
                        new Array(10).fill(undefined).map((data: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                }} />
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
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`,
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ cursor: 'pointer', width: `100%` }} >
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  background: theme => `${theme.palette.neutral.common}`,
                                  py: 1,
                                  px: 1,
                                }}
                              />
                            </TableRow>
                          )
                        })
                      )
                  }
                </TableBody>
              </Table >
            </TableContainer >
          </Box>
        </Grid>
      </Grid >

      <Snackbar open={isShowMessage} autoHideDuration={5000} onClose={closeMessage} sx={{ zIndex: 10001 }}>
        <Alert onClose={closeMessage} severity={messageSeverity} sx={{ width: '100%', zIndex: 10001 }}>
          {messageContent}
        </Alert>
      </Snackbar>
    </>

  )
}

export default market;