export const durationOptionsObj = {
  durDays3: { dur: 3, display: "3", units: "days" },
  durWeeks1: { dur: 5, display: "5", units: "days" },
  durWeeks2: { dur: 10, display: "10", units: "days" },
  durMonths1: { dur: 20, display: "20", units: "days" },
  durMonths2: { dur: 40, display: "40", units: "days" },
  durMonths3: { dur: 60, display: "60", units: "days" },
};

export const predictionOptionsObj = {
  lstm_wlf: { idtype: "walk_forward", name: "Vanilla LSTM (Walk-Forward)" },
  lstm_ser: { idtype: "multistep_series", name: "Vanilla LSTM (Series)" },
  lcnn_wlf: { idtype: "cnn", name: "CNN-LSTM (Walk-Forward)" },
};
