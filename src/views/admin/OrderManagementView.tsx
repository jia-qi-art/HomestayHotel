import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { store } from '../../services/store';
import { 
  Receipt, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  Download,
  Eye,
  X
} from 'lucide-react';

interface Props {
  orders: Order[];
  onRefresh: () => void;
}

export const OrderManagementView: React.FC<Props> = ({ orders, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.roomNumber.toLowerCase().includes(q) ||
        o.roomName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = '订单号,客房编号,客房名称,住客姓名,住客手机,入住日期,离店日期,天数,房费总计,押金,支付方式,订单状态,下单时间\n';
    const rows = filteredOrders.map(o => 
      `"${o.orderNumber}","${o.roomNumber}","${o.roomName}","${o.customerName}","${o.customerPhone}","${o.checkInDate}","${o.checkOutDate}",${o.days},${o.totalPrice},${o.deposit},"${o.payMethod}","${o.status}","${o.createTime}"`
    ).join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `民宿订单导出_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-700" />
            <span>所有订单管理 (HOrderView)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            汇总全平台所有渠道预约与到店订单，支持按订单号、姓名、手机号快速检索与明细追溯
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>导出订单报表 (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 min-w-[240px] items-center relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索单号、住客姓名、手机号、房号..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 font-medium"
          >
            <option value="all">全部状态订单</option>
            <option value="reserved">待入住 (已预订)</option>
            <option value="occupied">客人正在入住中</option>
            <option value="completed">已离店结账完成</option>
            <option value="cancelled">已取消作废订单</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <th className="p-4">订单号与下单时间</th>
                <th className="p-4">预订房号 / 房型</th>
                <th className="p-4">住客信息</th>
                <th className="p-4">入住周期</th>
                <th className="p-4">金额核算</th>
                <th className="p-4">支付方式</th>
                <th className="p-4">订单状态</th>
                <th className="p-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map(order => {
                const isReserved = order.status === 'reserved';
                const isOccupied = order.status === 'occupied';
                const isCompleted = order.status === 'completed';
                const isCancelled = order.status === 'cancelled';

                return (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-stone-900">{order.orderNumber}</div>
                      <div className="text-[10px] text-stone-400">{order.createTime}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-stone-800">房号 {order.roomNumber}</div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[140px]">{order.roomName}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-stone-800">{order.customerName}</div>
                      <div className="text-[10px] text-stone-500 font-mono">{order.customerPhone}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-stone-800">{order.checkInDate} ~ {order.checkOutDate}</div>
                      <div className="text-[10px] text-stone-400">共 {order.days} 晚</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-rose-600">¥{order.totalPrice}</div>
                      <div className="text-[10px] text-stone-400">含押金: ¥{order.actualPaid}</div>
                    </td>

                    <td className="p-4 text-stone-700">
                      {order.payMethod}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isReserved
                          ? 'bg-amber-100 text-amber-800'
                          : isOccupied
                          ? 'bg-blue-100 text-blue-800'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-500'
                      }`}>
                        {isReserved && '🟡 待入住'}
                        {isOccupied && '🔵 入住中'}
                        {isCompleted && '🟢 已完成'}
                        {isCancelled && '⚪ 已取消'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  订单流水详情
                </h3>
                <span className="font-mono text-stone-400 text-xs">{selectedOrder.orderNumber}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">客房信息:</span>
                  <span className="font-bold text-stone-800">房号 {selectedOrder.roomNumber} ({selectedOrder.roomType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">所属民宿:</span>
                  <span className="text-stone-800">{selectedOrder.homestayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">住客姓名:</span>
                  <span className="font-bold text-stone-800">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">住客手机:</span>
                  <span className="font-mono text-stone-800">{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">身份证号:</span>
                  <span className="font-mono text-stone-800">{selectedOrder.customerIdCard}</span>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">入住周期:</span>
                  <span className="font-medium text-stone-800">{selectedOrder.checkInDate} 至 {selectedOrder.checkOutDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">入住晚数:</span>
                  <span className="font-bold text-stone-800">{selectedOrder.days} 晚</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">单价标准:</span>
                  <span>¥{selectedOrder.unitPrice} / 晚</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">总房费:</span>
                  <span className="font-bold text-stone-900">¥{selectedOrder.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">已收押金:</span>
                  <span className="text-emerald-700 font-bold">¥{selectedOrder.deposit}</span>
                </div>
                <div className="border-t border-stone-200 pt-1.5 flex justify-between font-bold text-sm">
                  <span>实收总额:</span>
                  <span className="text-rose-600">¥{selectedOrder.actualPaid}</span>
                </div>
              </div>

              {selectedOrder.remarks && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <strong>客人备注：</strong> {selectedOrder.remarks}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
