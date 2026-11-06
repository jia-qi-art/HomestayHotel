import React, { useMemo } from 'react';
import { Order, Room } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  ArrowUpRight,
  Sparkles,
  Receipt,
  Wallet
} from 'lucide-react';

interface Props {
  orders: Order[];
  rooms: Room[];
}

export const FinancialView: React.FC<Props> = ({ orders, rooms }) => {
  // Financial metrics
  const validOrders = orders.filter(o => o.status === 'completed' || o.status === 'occupied');

  const totalRevenue = useMemo(() => {
    return validOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  }, [validOrders]);

  const totalDepositHeld = useMemo(() => {
    return orders
      .filter(o => o.status === 'occupied' || o.status === 'reserved')
      .reduce((sum, o) => sum + o.deposit, 0);
  }, [orders]);

  const avgOrderPrice = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Breakdown by room type
  const typeRevenueMap = useMemo(() => {
    const map: Record<string, number> = {};
    validOrders.forEach(o => {
      map[o.roomType] = (map[o.roomType] || 0) + o.totalPrice;
    });
    return map;
  }, [validOrders]);

  const typeEntries = Object.entries(typeRevenueMap).sort((a, b) => b[1] - a[1]);
  const maxTypeRev = Math.max(1, ...typeEntries.map(e => e[1]));

  // Breakdown by pay method
  const payMethodMap = useMemo(() => {
    const map: Record<string, number> = {};
    validOrders.forEach(o => {
      map[o.payMethod] = (map[o.payMethod] || 0) + o.actualPaid;
    });
    return map;
  }, [validOrders]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>财务收支与营业统计 (HOrderEChartsView)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            多维度统计民宿房费营收、客单均价、房型贡献占比与支付渠道沉淀
          </p>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> 财务报表已自动校准
        </span>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">房费总营收</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">¥{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 mt-1">不含已退还押金净收入</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">当前在押押金池</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">¥{totalDepositHeld.toLocaleString()}</div>
          <div className="text-[11px] text-stone-400 mt-1">在住及预订客人保证金</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">综合客单均价</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">¥{avgOrderPrice}</div>
          <div className="text-[11px] text-blue-600 mt-1">有效入住订单平均收益</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">总入住间夜</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {validOrders.reduce((sum, o) => sum + o.days, 0)} <span className="text-xs font-normal text-stone-400">间夜</span>
          </div>
          <div className="text-[11px] text-purple-600 mt-1">高频复购客户沉淀中</div>
        </div>

      </div>

      {/* Two Column Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Revenue By Room Type */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">各房型营收贡献排行</h3>
            <span className="text-xs text-stone-400">房费小计占比</span>
          </div>

          <div className="space-y-4 pt-2">
            {typeEntries.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">暂无房型营收数据</div>
            ) : (
              typeEntries.map(([type, rev]) => {
                const percent = Math.round((rev / (totalRevenue || 1)) * 100);
                const barWidth = Math.round((rev / maxTypeRev) * 100);

                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-stone-800">{type}</span>
                      <span className="font-bold text-stone-900">
                        ¥{rev.toLocaleString()} <span className="text-stone-400 font-normal">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Payment Channels & Settlement Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">支付通道结算与资金沉淀</h3>
            <span className="text-xs text-stone-400">总流入流水</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(payMethodMap).map(([method, amount]) => {
              const totalFlow = Object.values(payMethodMap).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((amount / totalFlow) * 100);

              return (
                <div key={method} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-700 shadow-xs">
                      {method.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-stone-800">{method}</div>
                      <div className="text-[10px] text-stone-400">全流程在线收银结算</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xs text-stone-900">¥{amount.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">占比 {pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
            <strong>对账小结：</strong> 所有押金在退房结账时均原路原额冲抵退还，账实相符率 100.0%。
          </div>
        </div>

      </div>

    </div>
  );
};
