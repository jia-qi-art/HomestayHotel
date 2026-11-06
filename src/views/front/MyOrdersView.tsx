import React, { useState } from 'react';
import { Order } from '../../types';
import { store } from '../../services/store';
import { 
  Receipt, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Sparkles, 
  MessageSquarePlus, 
  X,
  CreditCard,
  MapPin,
  Hotel
} from 'lucide-react';

interface Props {
  orders: Order[];
  onRefresh: () => void;
}

export const MyOrdersView: React.FC<Props> = ({ orders, onRefresh }) => {
  const currentUser = store.getCurrentUser();
  const [statusFilter, setStatusFilter] = useState<'all' | 'reserved' | 'occupied' | 'completed' | 'cancelled'>('all');
  
  // Rating Modal
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filter orders for current user
  const userOrders = orders
    .filter(o => o.userId === currentUser.id || o.customerPhone === currentUser.phone)
    .filter(o => {
      if (statusFilter === 'all') return true;
      return o.status === statusFilter;
    });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCancelOrder = (order: Order) => {
    if (window.confirm(`确定要取消房号 ${order.roomNumber} 的预订吗？押金与房费将原路退还。`)) {
      const res = store.cancelOrder(order.id, '住客行程变更取消');
      if (res.success) {
        showToast(res.message);
        onRefresh();
      } else {
        alert(res.message);
      }
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder) return;
    if (!reviewContent.trim()) {
      alert('请填写您的入住体验评价内容');
      return;
    }

    const res = store.submitReview(reviewOrder.id, ratingVal, reviewContent);
    if (res.success) {
      showToast(res.message);
      setReviewOrder(null);
      setReviewContent('');
      onRefresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-emerald-700" />
            <span>我的预订与入住订单</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            当前住客账号: <span className="font-semibold text-stone-800">{currentUser.realName}</span> ({currentUser.phone})
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl text-xs overflow-x-auto">
          {[
            { key: 'all', label: '全部订单' },
            { key: 'reserved', label: '待入住(已预订)' },
            { key: 'occupied', label: '在住中' },
            { key: 'completed', label: '已完成' },
            { key: 'cancelled', label: '已取消' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                statusFilter === tab.key
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Receipt className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-stone-800">暂无相关订单</h3>
          <p className="text-xs text-stone-500">挑选您心仪的房源，开启一段难忘的民宿之旅吧</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => {
            const isReserved = order.status === 'reserved';
            const isOccupied = order.status === 'occupied';
            const isCompleted = order.status === 'completed';
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs hover:border-emerald-600/50 hover:shadow-md transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-stone-400">单号: {order.orderNumber}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-500">{order.createTime}</span>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isReserved
                        ? 'bg-amber-100 text-amber-800'
                        : isOccupied
                        ? 'bg-blue-100 text-blue-800'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}>
                      {isReserved && '🟡 待到店入住 (已预订)'}
                      {isOccupied && '🔵 客人正在入住中'}
                      {isCompleted && '🟢 已完成离店'}
                      {isCancelled && '⚪ 订单已取消'}
                    </span>
                  </div>
                </div>

                {/* Main Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold">
                        {order.homestayName}
                      </span>
                      <span className="text-xs text-stone-500">房号 {order.roomNumber}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">{order.roomName}</h3>

                    <div className="flex items-center gap-4 text-xs text-stone-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>入住：{order.checkInDate} 至 {order.checkOutDate} ({order.days}晚)</span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-500 flex items-center gap-4">
                      <span>住客：{order.customerName} ({order.customerPhone})</span>
                      <span>支付方式：{order.payMethod}</span>
                    </div>

                    {order.remarks && (
                      <div className="text-xs text-stone-500 bg-stone-50 p-2 rounded-xl">
                        备注：{order.remarks}
                      </div>
                    )}
                  </div>

                  {/* Financials & Actions */}
                  <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-stone-100 pt-3 md:pt-0 md:pl-4 space-y-3">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-stone-400">已付总额 (含¥{order.deposit}押金)</div>
                      <div className="text-xl font-black text-rose-600">¥{order.actualPaid}</div>
                      <div className="text-[11px] text-stone-500">房费小计: ¥{order.totalPrice}</div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      {isReserved && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                        >
                          取消预订
                        </button>
                      )}

                      {isCompleted && !order.isReviewed && (
                        <button
                          onClick={() => {
                            setReviewOrder(order);
                            setRatingVal(5);
                            setReviewContent('');
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>评价打分 (+权重)</span>
                        </button>
                      )}

                      {isCompleted && order.isReviewed && (
                        <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 已完成评分评价
                        </span>
                      )}

                      {isCancelled && (
                        <span className="text-xs text-stone-400">款项已原路退回</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>住客体验评分与评价</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  房源：{reviewOrder.roomName} (房号 {reviewOrder.roomNumber})
                </p>
              </div>
              <button
                onClick={() => setReviewOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>权重反哺机制：</strong> 您的评分将直接增加该客房的<strong>综合权重值</strong>，帮助优质民宿登上系统首页精选！
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-2">服务与入住满意度打分</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingVal(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= ratingVal
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-stone-800 ml-2">
                    {ratingVal === 5 ? '5.0 超棒非常满意' : `${ratingVal}.0 分`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">真实入住体验分享</label>
                <textarea
                  rows={4}
                  value={reviewContent}
                  onChange={e => setReviewContent(e.target.value)}
                  placeholder="房间卫生如何？周边风景与设施是否满意？管家服务是否周到？写下您的真实体验..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors text-xs"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  评价提交后将自动在房源详情页以脱敏名称（如：{currentUser.realName.slice(0, 1)}**）公开展示。
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewOrder(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 text-stone-600 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  确认提交评价并提升权重
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
