import backtrader as bt

class SMACrossOver2(StrategyHelper):
    params = dict(
        fast=5,
        slow=20,
    )

    def __init__(self):
        super(SmaCross, self).__init__()
        for d in self.datas:
            self.inds[d] = {}
            self.inds[d]['sma1'] = bt.ind.SMA(period=self.p.fast)
            self.inds[d]['sma2'] = bt.ind.SMA(period=self.p.slow)
            self.inds[d]['crossover'] = bt.ind.CrossOver(self.inds[d]['sma1'],
                self.inds[d]['sma2'])
            self.inds[d]['bbands'] = bt.ind.BBands(period=self.p.slow)
            self.inds[d]['crclose'] = \
                self.data.close > self.inds[d]['bbands'].top
        self.make_ind_keys()

    def next(self):
        for d in self.datas:
            crossover_last_p = [i for i, e in \
                enumerate(self.inds[d]['crossover'].get(size=self.p.fast)) \
                if e > 0]
            crossover_cond = self.inds[d]['crclose'] > 0 and crossover_last_p
            if not self.position and crossover_cond:
                size = int(self.broker.get_cash() / self.data)
                self.buy(data=d, price=d.close[0], size=size)
            elif self.inds[d]['crossover'] < 0:
                self.sell(data=d, price=d.close[0], size=self.getposition().size)

    def get_indicator(self, index=0, ind_index=1):
        if ind_index < 1:
            ind_index = 1
        elif ind_index > 2:
            ind_index = 2
        return self.inds[self.ind_keys[index]][f'sma{str(ind_index)}'].array
