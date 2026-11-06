import React, { useState } from 'react';
import { Room, Order } from '../../types';
import { store } from '../../services/store';
import { 
  CalendarCheck, 
  Clock, 
  LogOut, 
  CheckCircle2, 
  X, 
  User, 
  Phone, 
  CreditCard, 
  Search, 
  Plus, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface Props {
  rooms: Room[];
  orders: Order[];
  onRefresh: () => void;
}

export const FrontDeskBookingView: React.FC<Props> = ({ rooms, orders, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'subscribe' | 'check' | 'checkout'>('subscribe');
  
  // Available rooms for Tab 1 (民宿预订/入住)
  const availableRooms = rooms.filter(r => r.status === 'available');

  // Reserved rooms for Tab 2 (预订处理)
  const reservedOrders = orders.filter(o => o.status === 'reserved');

  // Occupied rooms for Tab 3 (入住管理 / 续住退房)
  const occupiedOrders = orders.filter(o => o.status === 'occupied');

  // Direct checkin modal
  const [checkinModalRoom, setCheckinModalRoom] = useState<Room | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestIdCard, setGuestIdCard] = useState('');
  const [stayNights, setStayNights] = useState(1);
  const [payMethod, setPayMethod] = useState<'微信支付' | '支付宝' | '现金'>('微信支付');

  // Extend stay modal
  const [extendOrder, setExtendOrder] = useState<Order | null>(null);
  const [additionalDays, setAdditionalDays] = useState(1);

  const handleOpenCheckin = (room: Room) => {
    setCheckinModalRoom(room);
    setGuestName('');
    setGuestPhone('');
    setGuestIdCard('330106199401011234');
    setStayNights(1);
  };

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkinModalRoom) return;
    if (!guestName.trim()) {
      alert('请填写真实住客姓名');
      return;
    }
    if (!guestPhone.trim()) {
      alert('请填写住客联系手机');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const outDate = new Date(Date.now() + stayNights * 86400000).toISOString().split('T')[0];

    const res = store.createBooking({
      roomId: checkinModalRoom.id,
      customerName: guestName,
      customerPhone: guestPhone,
      customerIdCard: guestIdCard,
      checkInDate: today,
      checkOutDate: outDate,
      days: stayNights,
      isDirectCheckIn: true,
      payMethod,
    });

    if (res.success) {
      alert(res.message);
      setCheckinModalRoom(null);
      onRefresh();
    } else {
      alert(res.message);
    }
  };

  // Convert reserved order to occupied
  const handleTurnReservedToOccupied = (order: Order) => {
    const res = store.checkInReservedOrder(order.id);
    alert(res.message);
    if (res.success) onRefresh();
  };

  // Cancel reservation
  const handleCancelReservation = (order: Order) => {
    if (window.confirm(`确认取消订单 ${order.orderNumber} (房号 ${order.roomNumber}) 吗？`)) {
      const res = store.cancelOrder(order.id, '前台核验后取消');
      alert(res.message);
      if (res.success) onRefresh();
    }
  };

  // Submit Extend Stay
  const handleExtendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendOrder) return;
    const res = store.extendStay(extendOrder.id, additionalDays);
    alert(res.message);
    if (res.success) {
      setExtendOrder(null);
      onRefresh();
    }
  };

  // Checkout order
  const handleCheckoutOrder = (order: Order) => {
    if (window.confirm(`确认办理房号 ${order.roomNumber} 的退房结账吗？退还押金 ¥${order.deposit}`)) {
      const res = store.checkoutOrder(order.id, true);
      alert(res.message);
      if (res.success) onRefresh();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header and Sub Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-700" />
            <span>前台业务办理工作台 (业务办理三阶段)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            涵盖民宿预订/直接入住登记、预订订单审核流转、在住管理与续住退房押金结算
          </p>
        </div>

        {/* 3 Subtabs matching original system */}
        <div className="flex border-b border-stone-100 gap-2 text-xs">
          {[
            { key: 'subscribe', label: '1. 民宿预订/现场入住', count: availableRooms.length, desc: '仅展示空闲房间' },
            { key: 'check', label: '2. 预订处理与转入住', count: reservedOrders.length, desc: '待到店核验' },
            { key: 'checkout', label: '3. 在住管理与续住退房', count: occupiedOrders.length, desc: '入住中办理' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`pb-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeSubTab === tab.key
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeSubTab === tab.key ? 'bg-emerald-100 text-emerald-900 font-extrabold' : 'bg-stone-100 text-stone-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Subtab 1: 民宿预订 / 现场入住办理 (空闲房间) */}
      {activeSubTab === 'subscribe' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>当前可用空闲客房列表：点击【直接办理入住】即可录入身份证并办理现场收银入住</span>
            <span className="font-semibold text-emerald-700">可住房源: {availableRooms.length} 间</span>
          </div>

          {availableRooms.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-400 text-xs">
              暂无空闲房源，所有客房目前均在住或被预订
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRooms.map(room => (
                <div
                  key={room.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs hover:border-emerald-600 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={room.coverImage}
                      alt={room.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-stone-900">
                          {room.roomNumber}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          空闲可订
                        </span>
                      </div>
                      <div className="font-bold text-xs text-stone-800 truncate" title={room.name}>
                        {room.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {room.roomType} • {room.area}m² • {room.floor}层
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-rose-600">¥{room.price}</span>
                      <span className="text-[10px] text-stone-400">/晚 (押金¥{room.deposit})</span>
                    </div>

                    <button
                      onClick={() => handleOpenCheckin(room)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      现场登记入住
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: 预订处理 (当前状态为预订的房间，可编辑信息、办理转入住、取消) */}
      {activeSubTab === 'check' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>线上或电话预约待到店订单：核验住客身份后点击【确认转入住】</span>
            <span className="font-semibold text-amber-700">待办预订: {reservedOrders.length} 单</span>
          </div>

          {reservedOrders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-400 text-xs">
              当前暂无待核验的预订订单
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                    <th className="p-4">订单单号</th>
                    <th className="p-4">房号与房型</th>
                    <th className="p-4">预订住客信息</th>
                    <th className="p-4">预定入住时间</th>
                    <th className="p-4">天数 / 房费 / 押金</th>
                    <th className="p-4">支付方式</th>
                    <th className="p-4 text-right">前台操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {reservedOrders.map(order => (
                    <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-stone-800">
                        {order.orderNumber}
                        <div className="text-[10px] text-stone-400 font-normal">{order.createTime}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-stone-900">
                          房号 {order.roomNumber} ({order.roomType})
                        </div>
                        <div className="text-[10px] text-stone-500">{order.roomName}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-stone-800">{order.customerName}</div>
                        <div className="text-[10px] text-stone-500 font-mono">{order.customerPhone}</div>
                        <div className="text-[10px] text-stone-400 font-mono">证件: {order.customerIdCard}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-medium text-stone-800">{order.checkInDate} 至 {order.checkOutDate}</div>
                        <div className="text-[10px] text-amber-700 font-semibold">共 {order.days} 晚</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-rose-600">¥{order.totalPrice}</div>
                        <div className="text-[10px] text-stone-400">已收押金: ¥{order.deposit}</div>
                      </td>

                      <td className="p-4 font-medium text-stone-700">
                        {order.payMethod}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTurnReservedToOccupied(order)}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-xs"
                          >
                            核验转入住
                          </button>
                          <button
                            onClick={() => handleCancelReservation(order)}
                            className="px-2.5 py-1.5 border border-stone-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: 在住管理与续住退房 (展示入驻中的房间，可续住、退房) */}
      {activeSubTab === 'checkout' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>在住宾客列表：支持办理续住加住，或办理退房并结清退还押金</span>
            <span className="font-semibold text-blue-700">在住房间: {occupiedOrders.length} 间</span>
          </div>

          {occupiedOrders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-400 text-xs">
              当前暂无正在入住的客人
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {occupiedOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-blue-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-black text-stone-900">
                          {order.roomNumber}
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">
                          在住中
                        </span>
                      </div>
                      <span className="text-xs font-mono text-stone-400">{order.orderNumber}</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-stone-800">{order.roomName}</div>
                      <div className="text-stone-600 font-medium">住客：{order.customerName} ({order.customerPhone})</div>
                      <div className="text-[11px] text-stone-500">入住周期：{order.checkInDate} 至 {order.checkOutDate} ({order.days}晚)</div>
                      <div className="text-[11px] text-stone-500">押金担保：<span className="font-bold text-emerald-700">¥{order.deposit}</span> (退房退回)</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setExtendOrder(order);
                        setAdditionalDays(1);
                      }}
                      className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition-colors"
                    >
                      办理续住
                    </button>

                    <button
                      onClick={() => handleCheckoutOrder(order)}
                      className="py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      办理退房结账
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Direct Checkin Modal */}
      {checkinModalRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                房号 {checkinModalRoom.roomNumber} - 现场直接入住登记
              </h3>
              <button
                onClick={() => setCheckinModalRoom(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckinSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">住客真实姓名</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="如: 李振华"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">联系手机</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    placeholder="13900000000"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">计划入住天数</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={stayNights}
                    onChange={e => setStayNights(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">身份证号 (登记报备)</label>
                <input
                  type="text"
                  value={guestIdCard}
                  onChange={e => setGuestIdCard(e.target.value)}
                  placeholder="330106199401011234"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">收银收款方式</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="微信支付">微信支付</option>
                  <option value="支付宝">支付宝</option>
                  <option value="现金">现金收银</option>
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span>房费小计 ({stayNights}晚 × ¥{checkinModalRoom.price})</span>
                  <span>¥{checkinModalRoom.price * stayNights}</span>
                </div>
                <div className="flex justify-between">
                  <span>客房押金</span>
                  <span>¥{checkinModalRoom.deposit}</span>
                </div>
                <div className="border-t border-stone-200 pt-1 flex justify-between font-bold text-stone-900">
                  <span>总计收款</span>
                  <span className="text-rose-600">¥{checkinModalRoom.price * stayNights + checkinModalRoom.deposit}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckinModalRoom(null)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  确认办理并入住
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Stay Modal */}
      {extendOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                房号 {extendOrder.roomNumber} - 续住延期办理
              </h3>
              <button
                onClick={() => setExtendOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExtendSubmit} className="space-y-4 text-xs">
              <div className="space-y-1 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>在住客人: <span className="font-bold text-stone-800">{extendOrder.customerName}</span></div>
                <div>现离店日期: {extendOrder.checkOutDate}</div>
                <div>客房日单价: ¥{extendOrder.unitPrice}/晚</div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">延长天数</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 7].map(d => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setAdditionalDays(d)}
                      className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                        additionalDays === d
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      +{d}天
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>应补收续住房费</span>
                <span className="text-rose-600 text-base">¥{extendOrder.unitPrice * additionalDays}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendOrder(null)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  确认续住收银
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
