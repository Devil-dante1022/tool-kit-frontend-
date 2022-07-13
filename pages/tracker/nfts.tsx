import React, { Fragment, MouseEventHandler, useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router';
import InfiniteScroll from "react-infinite-scroll-component";
import {
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

import Autocomplete, { createFilterOptions, autocompleteClasses } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Stack from "@mui/material/Stack";
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar } from "@mui/material";

import AddPlus from 'src/components/IconButton/AddPlus';
import ZoomGlass from 'src/components/IconButton/ZoomGlass';
import WhiteCircle from 'src/components/IconButton/WhiteCircle';
import WhiteDown from 'src/components/IconButton/WhiteDown';
import WhiteUp from "@components/IconButton/WhiteUp";
// import WhiteUp from 'src/components/IconButton/WhiteUp';
import CloseCancel from 'src/components/IconButton/CloseCancel';
import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';

import { numberToFix, parseNumber } from "src/common/utils/helpers"
import { DATA_API, LIMIT_COLUMNS, TIME_RANGE, TIME_INCREASE, CORS_PROXY_SERVER, SNIPER_API, CLOUD_FLARE_URI } from "src/common/config";

import { delayTime, useInterval } from "src/helper/utility";
import { handleImageError } from "src/common/utils/handleImageError";

import fetchData from "src/common/services/getDataWithAxios";

import PageInfo from "src/components/PageContainer/PageInfo";
import { LIMIT_PAGE_SIZE } from '../../src/common/config';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    // fontSize: '20px !important ',
    '& .MuiAutocomplete-popper': {
      margin: '20px'
    },
  },
});

const trackFields: {
  menu: string,
  field: string,
  isStatistic: boolean,
  isLamport: boolean
}[] = [
    {
      menu: `projects`,
      field: `name`,
      isStatistic: false,
      isLamport: false
    },
    {
      menu: `supply`,
      field: `supply`,
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
      menu: `24h volume`,
      field: `volume1Day`,
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

let tempOriginalData = [];
let tempOriginalPercent = [];

const Nfts = () => {
  const router = useRouter();

  // For data
  const [collectibles, setCollectibles] = useState<any>([]);
  const [myTracks, setMyTracks] = useState<any>([]);
  const [loaded, setLoaded] = useState<boolean>(true);
  const [originalTracks, setOriginalTracks] = useState<any>([]);
  const [originalPercent, setOriginalPercent] = useState<any>([]);

  // For get scroll infinit
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(1);

  // For delete Collection
  const [deleteCollection, setDeleteCollection] = useState<string>(``);
  // For Alert
  const [openConf, setOpenConf] = useState<boolean>(false);

  // For Real time fetching
  const [timer, setTimer] = React.useState<number>(0);

  // For Register Collection
  const [registCollection, setRegistCollection] = useState<any>([]);

  // For user login
  const [isSigned, setIsSigned] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>(`root`);

  // For Load More
  const [loadIndex, setLoadIndex] = useState<number>(0);

  // For sorting
  const [sortField, setSortField] = useState<string>('volume1Day');
  const [sortMode, setSortMode] = useState<boolean>(false);

  // For searching
  const [trackSearch, setTrackSearch] = useState<string>('');
  const [startSearch, setStartSearch] = useState<boolean>(true);

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

  // For scrolling by clicking button
  // const step = 8;
  // const scrollRef: any = useRef();
  // const isScrollRef: any = useRef();
  // const scrollMove = () => {
  //   if (isScrollRef.current) {
  //     scrollRef.current.scrollTop = scrollRef.current.scrollTop + step;
  //     requestAnimationFrame(scrollMove);
  //   }
  // };

  const getSelectibles = async (filter: string) => {
    try {
      filter = filter.toLowerCase();
      const temp = tempOriginalPercent.filter((record: any) => {
        return record?.name.toLowerCase().includes(filter);
      })
      setCollectibles([...temp]);
    }
    catch (err) {

    }
  }

  const addCollection = async () => {
    if (registCollection.length > 0) {
      let succeed = 0, failed = 0, total = registCollection.length;
      setShowLoading(true);
      try {
        let res: any[] = [];
        for (let i = 0; i < total; i++) {
          const result: any = await fetchData({
            method: `post`,
            route: `${DATA_API.TRACK_NFTS.REGIST_TRACKS}/${userName}`,
            data: {
              symbol: registCollection[i]?.symbol
            }
          });

          if (result && Array.isArray(result?.nfts)) {
            res = result?.nfts || [];
            succeed++;
          }
          else {
            failed++;
          }
        }

        if (res?.length > 0) {
          let temp = [];

          for (let i = 0; i < res.length; i++) {
            let detail = tempOriginalPercent.find((val: any) => {
              return val?.symbol == res[i].symbol
            });

            if (detail < 0) {
              detail = undefined;
            }

            const volume1Day = (detail?.volume * detail?.volume1DayDelta) / (100 + detail?.volume1DayDelta);
            temp[i] = { ...detail, volume1Day: volume1Day }
          }

          setOriginalTracks([...temp]);
          setLoaded(!loaded);
          tempOriginalData = [...temp];
        }

        setIsShowMessage(true);
        setMessageContent(`Succeed: ${succeed} and Failed: ${failed} (In total of ${total})`);
        setMessageSeverity(`info`);
      }
      catch (err) {
        setIsShowMessage(true);
        setMessageContent(`Operation is failed! Please check your network! Succeed: (${succeed} and Failed: ${failed} [In total of ${total}])`);
        setMessageSeverity(`error`);
      }
      finally {
        setShowLoading(false);
        setRegistCollection([]);
        setCollectibles([]);
      }
    }
    else {
      setIsShowMessage(true);
      setMessageContent(`Please select more than one collection!`);
      setMessageSeverity(`warning`);
    }
  }

  const deleteOneCollection = async () => {
    if (deleteCollection) {
      setShowLoading(true);
      try {
        const result = await fetchData({
          method: `post`,
          route: `${DATA_API.TRACK_NFTS.DELETE_TRACKS}/${userName}/delete`,
          data: {
            symbol: deleteCollection
          }
        });
        if (result) {
          const filtered = tempOriginalData.filter((track: any, index: number) => { return track.symbol != deleteCollection });
          setOriginalTracks([...filtered]);
          tempOriginalData = [...filtered];
          setLoaded(!loaded);
          setOpenConf(false);
          setIsShowMessage(true);
          setMessageContent(`Selected collection deleted!`);
          setMessageSeverity(`info`);
        }
        else {
          setIsShowMessage(true);
          setMessageContent(`Operation is failed! Please check your network!`);
          setMessageSeverity(`error`);
        }

      }
      catch (err) {
        setIsShowMessage(true);
        setMessageContent(`Operation is failed! Please check your network!`);
        setMessageSeverity(`error`);
      }
      finally {
        setShowLoading(false);
      }
    }
    else {
      setIsShowMessage(true);
      setMessageContent(`Please select the collection!`);
      setMessageSeverity(`warning`);
    }
  }
  // For Handle Alert Modal
  const closeConfDialog = () => {
    setOpenConf(false);
  }

  const sortAndSearchTracks = async () => {
    let result = null;
    if (sortField) {
      let tempMyTrackData = tempOriginalData;
      tempMyTrackData.sort((a: any, b: any) => {
        if (sortField == `name`) {
          return sortMode ? ('' + a[sortField]).localeCompare(b[sortField]) : ('' + b[sortField]).localeCompare(a[sortField]);
        }
        else {
          return sortMode ? (a[sortField] - b[sortField]) : (b[sortField] - a[sortField]);
        }
      });

      result = tempMyTrackData;
    }
    if (trackSearch) {
      let tempMyTrackData = result ? result : tempOriginalData;
      let lowerSearch = trackSearch.toLocaleLowerCase();
      let res = tempMyTrackData.filter((track: any, index: number) => {
        let lowerName = track?.name.toLocaleLowerCase();
        return lowerName.includes(lowerSearch);
      });
      result = res;
    }
    else {
      result = result ? result : tempOriginalData;
    }

    setMyTracks([...result]);
  }

  const fetchScrollTrack = async () => {
    try {
      setOffset(offset + 1);
      const tracks: any = await fetchData({
        method: `get`,
        route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${userName}?offset=${offset}&page_size=${LIMIT_COLUMNS}`
      });
      let res = [];
      let missedCollections = [];
      if (tracks?.length > 0) {
        res = tracks || [];

        let temp = [];

        for (let i = 0; i < res.length; i++) {
          let detail = tempOriginalPercent.find((val: any) => {
            return val?.symbol == res[i].symbol
          });

          if (detail < 0) {
            detail = undefined;
          }

          const volume1Day = (detail?.volume * detail?.volume1DayDelta) / (100 + detail?.volume1DayDelta);
          temp[i] = { ...detail, volume1Day: volume1Day }

          if (!temp[i]?.supply) {
            missedCollections.push(temp[i]);
          }
        }

        tempOriginalData = [...tempOriginalData, ...temp];
        setOriginalTracks([...tempOriginalData, ...temp]);
        setLoaded(!loaded);

        if (missedCollections.length > 0) {
          await addMissedFields(missedCollections)
        }
      }

      if (res.length < LIMIT_COLUMNS) {
        setHasMore(false);
      }
      else {
        setHasMore(true);
      }
    }
    catch (err) {
      setHasMore(false);
    }
  }

  const getPercentChange = async () => {
    try {
      const fetched: any = await fetchData({
        method: `get`,
        route: `${DATA_API.SNIPER_API.COMMON}${DATA_API.SNIPER_API.PERCENT_CHANGE}`
      });

      let result: any = fetched;
      if (result && Array.isArray(result)) {
        tempOriginalPercent = result;
        setOriginalPercent([...tempOriginalPercent])
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
          let temp = [];
          if (result && Array.isArray(result)) {
            tempOriginalPercent = result;
            setOriginalPercent([...tempOriginalPercent]);

            for (let i = 0; i < tempOriginalData.length; i++) {
              let detail = tempOriginalPercent.find((val: any) => {
                return val?.symbol == tempOriginalData[i].symbol
              });

              if (detail < 0) {
                detail = undefined;
              }

              const volume1Day = (detail?.volume * detail?.volume1DayDelta) / (100 + detail?.volume1DayDelta);
              temp[i] = { ...detail, volume1Day: volume1Day }
            }
            tempOriginalData = [...temp];
            setOriginalTracks([...temp]);
            setLoaded(!loaded);
          }
        }
      });
    }
    catch (err) {
      return [];
    }
  }

  const getTrackers = async () => {
    new Promise((myResolve, myReject) => {
      const trackersFromDB: any = fetchData({
        method: `get`,
        route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${userName}?offset=${0}&page_size=${LIMIT_COLUMNS}`
      });

      myResolve(trackersFromDB);
    }).then(async (res) => {
      let temp = [];
      let missedCollections = [];
      if (res) {
        const result: any = res;
        if (result && Array.isArray(result)) {

          for (let i = 0; i < result.length; i++) {
            let detail = tempOriginalPercent.find((val: any) => {
              return val?.symbol == result[i].symbol
            });
            if (detail < 0) {
              detail = undefined;
            }
            const volume1Day = (detail?.volume * detail?.volume1DayDelta) / (100 + detail?.volume1DayDelta);
            temp[i] = { ...detail, volume1Day: volume1Day }
            if (!temp[i]?.supply) {
              missedCollections.push(temp[i]);
            }
          }
        }
        setShowLoading(false);
        setOriginalTracks([...temp]);
        setLoaded(!loaded);
        tempOriginalData = [...temp];
      }
      setShowLoading(false);
      if (temp.length < LIMIT_COLUMNS) {
        setHasMore(false);
      }
      startTimeInterval();
      if (missedCollections.length > 0) {
        await addMissedFields(missedCollections)
      }
    });
  }

  const addMissedFields = async (collections: any[]) => {
    for (let i = 0; i < collections.length; i++) {
      const fetched: any = await fetchData({
        method: `get`,
        route: `${CORS_PROXY_SERVER}/${SNIPER_API.COLLECTION_STATE}${collections[i]?.symbol}`
      });
      if (fetched && fetched?.mintedNFTs) {
        const inserted: any = await fetchData({
          method: `post`,
          route: `${DATA_API.SNIPER_API.COMMON}${DATA_API.SNIPER_API.INSERT_STATE}`,
          data: {
            missedData: {
              symbol: collections[i]?.symbol,
              supply: fetched.mintedNFTs
            }
          }
        });
        if (inserted) {
          let temp = tempOriginalData.map((record: any) => {
            if (record?.symbol == fetched?.symbol) {
              return {
                ...record,
                ...fetched
              }
            }
            return record;
          });

          setOriginalTracks([...temp]);
          setLoaded(!loaded);
          tempOriginalData = [...temp];
        }
      }
    }
  }

  const startTimeInterval = async () => {
    const intervalId = window.setInterval(async () => {
      setTimer(timer => timer + TIME_INCREASE);
    }, TIME_RANGE * 6)
    return intervalId;
  }

  useEffect(() => {
    (async () => {
      try {
        setShowLoading(true);
        await getPercentChange();
        getTrackers();
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await sortAndSearchTracks();
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, [originalTracks, loaded, sortMode, sortField, startSearch]);

  useEffect(() => {
    (async () => {
      try {
        if (timer > 0) {
          fetchPercentChange();
        }
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, [timer]);

  return (
    <>
      <PageInfo>
        <Box
          sx={{
            display: `flex`,
            justifyContent: `flex-end`,
            flexGrow: 1
          }}
        >
          <Box
            sx={{
              width: `100%`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `right`
            }}
          >
            <AddPlus
              sx={{
                width: `1.75rem`,
                height: `1.75rem`,
                mr: 1,
                '&:hover': {
                  cursor: `pointer !important`,
                  opacity: 0.7
                },
                color: `white`
              }}
              onClick={async () => {
                await addCollection();
              }}
            />
            <Autocomplete
              multiple
              id="tags-outlined"
              options={collectibles}
              getOptionLabel={(option: { name: string, symbol: string, image: string }) => option.name}
              renderOption={(props, option: any) => (
                <li {...props} key={option.symbol}  >{option.name}</li>
                // <Typography   {...props} key={option.symbol} style={{ fontSize: '0.75rem !important ' }}>{option.name}</Typography>
              )}
              renderInput={(params) => (

                <TextField
                  {...params}
                  sx={{
                    background: theme => theme.palette.background.default,
                    '& input': {
                      fontSize: `0.75rem`,
                    },
                  }}
                  placeholder={`add project`}
                >

                </TextField>

              )}
              PopperComponent={StyledPopper}
              size={`small`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>, newValue) => {
                setRegistCollection([...newValue]);
              }}
              onInputChange={async (event, newInputValue) => {
                if (newInputValue.length > 2) {
                  await getSelectibles(newInputValue);
                }
                else {
                  if (newInputValue.length < 1) {
                    setCollectibles([]);
                  }
                }

              }}
              sx={{
                width: `100%`,
                mx: 2,
                border: `none`,
                '& .MuiFormControl-root .MuiInputBase-root': {
                  py: `4px !important`,
                  background: theme => theme.palette.background.paper,
                },
              }}

              value={registCollection}
            />
          </Box>

          <Box
            sx={{
              width: `100%`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `right`
            }}
          >
            <ZoomGlass
              sx={{
                width: `1.75rem`,
                height: `1.75rem`,
                ml: 3,
                mr: 1,
                '&:hover': {
                  cursor: `pointer`,
                  opacity: 0.7
                },
                color: `white`
              }}
              onClick={async () => {
                setStartSearch(!startSearch)
              }}
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={trackSearch}
              size={`small`}
              sx={{
                width: `100%`,
                ml: 2,
                border: `none`,
                '& input': {
                  fontSize: `0.75rem`,
                  py: 0.875,
                  borderRadius: `4px`,
                  background: theme => theme.palette.background.paper,
                }
              }}
              placeholder={`search tracker`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTrackSearch(event.target.value);
              }}

              onKeyDown={async (event) => {
                if (event.keyCode == 13) {
                  setStartSearch(!startSearch)
                }
              }}
            />
          </Box>
        </Box>
      </PageInfo>

      <Box
        sx={{
          mx: `auto`,
          py: 3,
          px: 13,
          background: `none`,
          position: `relative`,
          overflow: `hidden !important`,
          '& *': {
            overflow: `hidden !important`
          }
        }}
      >
        <TableContainer
          component={`div`}
          sx={{
            overflow: `hidden !important`,
            position: `relative`
          }}
        >
          <InfiniteScroll
            dataLength={tempOriginalData.length}
            next={async () => { await fetchScrollTrack() }}
            hasMore={hasMore}
            loader={
              <Typography variant={`h6`} sx={{ mt: 2, mx: `auto`, textAlign: `center` }}>
                {tempOriginalData.length < 1 ? `` : `Loading...`}
              </Typography>
            }
          >
            <Table sx={{ overflow: `hidden !important` }}>
              <TableHead
                sx={{
                  background: theme => `${theme.palette.background.paper}`
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      border: `none`,
                      width: `5%`,
                      py: 1,
                      background: theme => theme.palette.neutral.paper
                    }}
                  >

                  </TableCell>

                  <TableCell
                    sx={{
                      border: `none`,
                      py: 1,
                      px: 1,
                      background: theme => theme.palette.neutral.paper
                    }}
                  >

                  </TableCell>

                  {
                    trackFields.map((menu: any, index: number) => {
                      return (
                        <TableCell
                          sx={{
                            width: index == 0 ? `15%` : `auto`,
                            border: `none`,
                            py: 1,
                            px: 1,
                            pl: index == 0 ? 3 : 1,
                            borderRight: [3, 5].includes(index) ? theme => `solid 1px ${theme.palette.common.white}` : `none`,
                            background: theme => theme.palette.neutral.paper
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
                                      setSortField(menu?.field);
                                      setSortMode(!sortMode);
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
                                      setSortField(menu?.field);
                                      setSortMode(!sortMode);
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
                                      setSortField(menu?.field);
                                      setSortMode(!sortMode);
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
                      border: `none`,
                      py: 1,
                      px: 1,
                      background: theme => theme.palette.neutral.paper
                    }}
                  >

                  </TableCell>

                  <TableCell
                    sx={{
                      border: `none`,
                      width: `5%`,
                      py: 1,
                      background: theme => theme.palette.neutral.paper
                    }}
                  >

                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {myTracks.map((track: any, index: number) => (
                  <TableRow
                    key={track?.symbol}
                    sx={{
                      '&:hover': {
                        cursor: `pointer`
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        border: `none`,
                        background: theme => `${theme.palette.neutral.common}`,
                        py: 1,
                      }}
                    >

                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                        background: theme => `${theme.palette.neutral.common}`,
                        py: 1,
                        px: 1
                      }}
                      onClick={(e: any) => {
                        e.preventDefault();
                        router.push(`/tracker/nfts/${userName}/${track.symbol}`);
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
                        onError={handleImageError}
                      >
                      </Box>
                    </TableCell>
                    {
                      trackFields.map((field: any, _index: number) => {
                        return (
                          <TableCell
                            align="center"
                            key={_index}
                            sx={{
                              borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                              borderRight: [3, 5].includes(_index) ? theme => `solid 1px ${theme.palette.neutral.main}` : `none`,
                              background: theme => `${theme.palette.neutral.common}`,
                              py: 1,
                              px: 1,
                              pl: _index == 0 ? 3 : 1,
                            }}
                            onClick={(e: any) => {
                              e.preventDefault();
                              router.push(`/tracker/nfts/${userName}/${track.symbol}`);
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
                                  (field.isStatistic && track[field.field] != undefined && track[field.field] > 0) ? <GreenUp sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} /> : ``
                                }

                                {
                                  (field.isStatistic && track[field.field] != undefined && track[field.field] < 0) ? <RedDown sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} /> : ``
                                }

                                <Typography variant={`subtitle2`} color={`inherit`}>
                                  {
                                    (field.isStatistic && track[field.field] != undefined) ? `${numberToFix(parseNumber(track[field.field]))}%` : ``
                                  }

                                  {
                                    (!field.isStatistic && !field.isLamport && track[field.field] != undefined && isNaN(parseFloat(track[field.field]))) ? track[field.field] : ``
                                  }

                                  {
                                    (!field.isStatistic && !field.isLamport && track[field.field] != undefined && !isNaN(parseFloat(track[field.field]))) ? parseInt(track[field.field]) : ``
                                  }

                                  {
                                    (!field.isStatistic && field.isLamport && track[field.field] != undefined) ? numberToFix((track[field.field])) : ``
                                  }
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                        );
                      })
                    }
                    <TableCell
                      sx={{
                        border: `none`,
                        borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                        background: theme => `${theme.palette.neutral.common}`,
                        py: 1,
                      }}
                    >
                      <CloseCancel
                        sx={{
                          width: `1rem`,
                          height: `1rem`,
                          '&:hover': {
                            cursor: `pointer`,
                            opacity: 0.7
                          },
                          color: theme => theme.palette.neutral.main
                        }}
                        onClick={async (event: any) => {
                          event.preventDefault();
                          setDeleteCollection(track?.symbol);
                          setOpenConf(true);
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: `none`,
                        background: theme => `${theme.palette.neutral.common}`,
                        py: 1,
                      }}
                    >

                    </TableCell>
                  </TableRow>

                ))}
              </TableBody>

            </Table>
          </InfiniteScroll>
        </TableContainer>

        <Dialog
          open={openConf}
          onClose={closeConfDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to delete this collecion?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={closeConfDialog}><Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.text.primary }} >Cancel</Typography></Button>
            <Button onClick={() => { deleteOneCollection() }} autoFocus>
              <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.text.primary }} >Delete</Typography>
            </Button>
          </DialogActions>
        </Dialog>

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
    </>

  );
}

export default Nfts;
