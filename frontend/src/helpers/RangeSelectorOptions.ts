import { Dispatch, SetStateAction } from "react";

const RangeSelectorOptions = (
  setDisplayIntra: Dispatch<SetStateAction<boolean>>
) => {
  return {
    allButtonsEnabled: true,
    selected: undefined,
    buttons: [
      {
        type: "day",
        count: 1,
        text: "1d",
        title: "View 1 day",
        events: {
          click: function () {
            setDisplayIntra(true);
          },
        },
      },
      {
        type: "week",
        count: 1,
        text: "1w",
        title: "View 1 week",
        events: {
          click: function () {
            setDisplayIntra(true);
          },
        },
      },
      {
        type: "month",
        count: 1,
        text: "1m",
        title: "View 1 month",
        events: {
          click: function () {
            setDisplayIntra(false);
          },
        },
      },
      {
        type: "month",
        count: 3,
        text: "3m",
        title: "View 3 months",
        events: {
          click: function () {
            setDisplayIntra(false);
          },
        },
      },
      {
        type: "month",
        count: 6,
        text: "6m",
        title: "View 6 months",
        events: {
          click: function () {
            setDisplayIntra(false);
          },
        },
      },
      {
        type: "ytd",
        text: "YTD",
        title: "View year to date",
        events: {
          click: function () {
            setDisplayIntra(false);
          },
        },
      },
      {
        type: "year",
        count: 1,
        text: "1y",
        title: "View 1 year",
        events: {
          click: function () {
            setDisplayIntra(false);
          },
        },
      },
      {
        type: "year",
        count: 5,
        text: "5y",
        title: "View 5 year",
        events: {
          click: function () {
            setDisplayIntra(false);
          },
        },
      },
      {
        type: "all",
        text: "All",
        title: "View all",
      },
    ],
  };
};

export default RangeSelectorOptions;
