import backtrader as bt

class SMACrossOver2(bt.SignalStrategy):
    def __init__(self):
        sma1, sma2 = bt.ind.SMA(period=10), bt.ind.SMA(period=30)
        crossover = bt.ind.CrossOver(sma1, sma2)
        self.signal_add(bt.SIGNAL_LONG, crossover)

    def get_indicator(self, index=0):
        return self.inds[self.ind_keys[index]]['rsi'].array

    def get_timestamps(self):
        result = list(map(bt.num2date, self.data.datetime.array))
        result = list(map(lambda x: \
            (x - datetime.datetime.fromtimestamp(0)).total_seconds() * 1000, \
            result))
        return result

    def get_formatted_trades(self):
        return self.completed_orders
