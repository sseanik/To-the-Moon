import datetime
import backtrader as bt

class StrategyHelper(bt.Strategy):
    def __init__(self):
        self.inds = {}

        self.orders = []
        self.completed_orders = []

    def make_ind_keys(self):
        self.ind_keys = list(self.inds.keys())

    def log(self, txt, dt=None):
        ''' Logging function fot this strategy'''
        dt = dt or self.data.datetime[0]
        if isinstance(dt, float):
            dt = bt.num2date(dt)
        print(f'{dt.isoformat()}: {txt}')

    def notify_trade(self, trade):
        if not trade.size:
            print(f'Trade PNL: ${trade.pnlcomm:.2f}')

    def notify_order(self, order):
        # import pdb; pdb.set_trace()
        self.log(f'Order - {order.getordername()} {order.ordtypename()} {order.getstatusname()} for {order.size} shares @ ${order.price if order.price else 0}')

        dt = bt.num2date(self.data.datetime[0])
        order_time = (dt - datetime.datetime.fromtimestamp(0)).total_seconds() * 1000

        order_formatted = {"time": order_time, "name": order.getordername(), "type": order.ordtypename(), "status": order.getstatusname(), "size": order.size, "price": order.price}

        self.orders.append(order_formatted)
        if order.getstatusname() == "Completed":
            self.completed_orders.append(order_formatted)

    def get_timestamps(self):
        result = list(map(bt.num2date, self.data.datetime.array))
        result = list(map(lambda x: \
            (x - datetime.datetime.fromtimestamp(0)).total_seconds() * 1000, \
            result))
        return result

    def get_formatted_trades(self):
        return self.completed_orders
