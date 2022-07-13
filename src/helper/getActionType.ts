import { TICKER_TYPE } from 'src/common/config';

// export const getActionType = (action: string) => {
//   const toLower = action.toLowerCase();
//   if (toLower.includes(`sale`)) {
//     return TICKER_TYPE.SALE;
//   }

//   if (toLower.includes(`cancel`)) {
//     return TICKER_TYPE.UNLISTINGS;
//   }
//   else {
//     if (toLower.includes(`list`)) {
//       return TICKER_TYPE.LISTINGS;
//     }
//   }

//   return ``;
// };

export const getActionType = (action: string) => {
  const toLower = action.toLowerCase();
  if (toLower == (`sold`)) {
    return TICKER_TYPE.SALE;
  }

  if (toLower == (`delisted`)) {
    return TICKER_TYPE.UNLISTINGS;
  }
  else {
    if (toLower == (`listed`)) {
      return TICKER_TYPE.LISTINGS;
    }
  }

  return ``;
};

// export const getActionColor = (action: string) => {
//   const toLower = action.toLowerCase();
//   if (toLower.includes(`sale`)) {
//     return `success`;
//   }

//   if (toLower.includes(`cancel`)) {
//     return `default`;
//   }
//   else {
//     if (toLower.includes(`list`)) {
//       return `warning`;
//     }
//   }

//   return `default`;
// };

export const getActionColor = (action: string) => {
  const toLower = action.toLowerCase();
  if (toLower == (`sold`)) {
    return `success`;
  }

  if (toLower == (`delisted`)) {
    return `default`;
  }
  else {
    if (toLower == (`listed`)) {
      return `warning`;
    }
  }

  return `default`;
};
