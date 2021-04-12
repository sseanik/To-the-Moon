import alpaca_backtrader_api as alpaca
import backtrader as bt
import pandas as pd
import datetime
from strategies.StrategyHelper import StrategyHelper

# Adapted from Leo Smigel - Alpaca & Backtrader: Tools of the Trade
#    - Part Two (2020)
# https://alpaca.markets/learn/backtrader-02/
class RSIStack(StrategyHelper):
    params = dict(
        rsi_overbought=70,
        rsi_oversold=30,
        rrr=2
    )

    def __init__(self, timeframes={'1D': 1}):
        self.orefs = None
        super(RSIStack, self).__init__()
        self.timeframes = timeframes
        for d in self.datas:
            self.inds[d] = {}
            self.inds[d]['rsi'] = bt.ind.RSI(d)
            self.inds[d]['rsiob'] = self.inds[d]['rsi'] >= self.p.rsi_overbought
            self.inds[d]['rsios'] = self.inds[d]['rsi'] <= self.p.rsi_oversold
        for i in range(len(self.timeframes)-1, len(self.datas), len(self.timeframes)):
            self.inds[self.datas[i]]['atr'] = bt.ind.ATR(self.datas[i])
        self.make_ind_keys()

    def start(self):
        # Timeframes must be entered from highest to lowest frequency.
        # Getting the length of the lowest frequency timeframe will
        # show us how many periods have passed
        self.lenlowtframe = len(self.datas[-1])
        self.stacks = {}

    def next(self):
        # Reset all of the stacks if a bar has passed on our
        # lowest frequency timeframe
        if not self.lenlowtframe == len(self.datas[-1]):
            self.lenlowtframe += 1
            self.stacks = {}

        for i, d in enumerate(self.datas):
            # Create a dictionary for each new symbol.
            ticker = d.p.dataname
            if i % len(self.timeframes) == 0:
                self.stacks[ticker] = {}
                self.stacks[ticker]['rsiob'] = 0
                self.stacks[ticker]['rsios'] = 0
            if i % len(self.timeframes) == len(self.timeframes) -1:
                self.stacks[ticker]['data'] = d
            self.stacks[ticker]['rsiob'] += self.inds[d]['rsiob'][0]
            self.stacks[ticker]['rsios'] += self.inds[d]['rsios'][0]

        for k,v in list(self.stacks.items()):
            if v['rsiob'] < len(self.timeframes) and v['rsios'] < len(self.timeframes):
                del self.stacks[k]

        # Check if there are any stacks from the previous period
        # And buy/sell stocks if there are no existing positions or open orders
        positions = [d for d, pos in self.getpositions().items() if pos]
        if self.stacks and not positions and not self.orefs:
                for k,v in self.stacks.items():
                    d = v['data']
                    size = self.broker.get_cash() // d
                    if v['rsiob'] == len(self.timeframes) and \
                                     d.close[0] < d.close[-1]:
                        print(f"{d.p.dataname} overbought")
                        risk = d + self.inds[d]['atr'][0]
                        reward = d - self.inds[d]['atr'][0] * self.p.rrr
                        os = self.sell_bracket(data=d,
                                               price=d.close[0],
                                               size=size,
                                               stopprice=risk,
                                               limitprice=reward)
                        self.orefs = [o.ref for o in os]
                    elif v['rsios'] == len(self.timeframes) and d.close[0] > d.close[-1]:
                        print(f"{d.p.dataname} oversold")
                        risk = d - self.inds[d]['atr'][0]
                        reward = d + self.inds[d]['atr'][0] * self.p.rrr
                        os = self.buy_bracket(data=d,
                                              price=d.close[0],
                                              size=size,
                                              stopprice=risk,
                                              limitprice=reward)
                        self.orefs = [o.ref for o in os]

    def notify_order(self, order):
        self.log(f'Order - {order.getordername()} {order.ordtypename()} {order.getstatusname()} for {order.size} shares @ ${order.price:.2f}')

        if not order.alive() and order.ref in self.orefs:
            self.orefs.remove(order.ref)

        dt = self.data.datetime[0]
        dt = bt.num2date(dt)
        order_time = (dt - datetime.datetime.fromtimestamp(0)).total_seconds() * 1000

        order_formatted = {"time": order_time, "name": order.getordername(), "type": order.ordtypename(), "status": order.getstatusname(), "size": order.size, "price": order.price}

        self.orders.append(order_formatted)
        if order.getstatusname() == "Completed":
            self.completed_orders.append(order_formatted)

    def get_indicator(self, index=0):
        return self.inds[self.ind_keys[index]]['rsi'].array
