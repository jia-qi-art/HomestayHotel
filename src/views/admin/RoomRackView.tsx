import React, { useState, useMemo } from 'react';
import { Room, RoomStatus } from '../../types';
import { store } from '../../services/store';
import { 
  Grid, 
  BedDouble, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  X, 
  User, 
  Phone, 
  LogOut, 
  Brush, 
  Wrench, 
  PlusCircle,
  Maximize2,
  Calendar
} from 'lucide-react';

interface Props {
  rooms: Room[];
  onRefresh: () => void;
}

export const RoomRackView: React.FC<Props> = ({ rooms, onRefresh }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionModalType, setActionModalType] = useState<'checkin' | 'checkout' | 'extend' | null>(null);

  // Direct checkin form states
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinIdCard, setWalkinIdCard] = useState('');
  const [walkinDays, setWalkinDays] = useState(1);
  const [walkinPay, setWalkinPay] = useState<'微信支付' | '支付宝' | '现金'>('微信支付');

  // Extend days state
  const [extendDaysCount, setExtendDaysCount] = useState(1);

  // Group by floor
  const roomsByFloor = useMemo(() => {
    const map: Record<number, Room[]> = {};
    rooms
      .filter(r => (filterStatus === 'all' ? true : r.status === filterStatus))
      .forEach(r => {
        const f = r.floor || 1;
        if (!map[f]) map[f] = [];
        map[f].push(r);
      });
    return map;
  }, [rooms, filterStatus]);

  const floors = Object.keys(roomsByFloor).map(Number).sort();

  const handleOpenRoomAction = (room: Room) => {
    setSelectedRoom(room);
  };

  // Direct Walk-in Check-in
  const handleWalkInCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;
    if (!walkinName.trim()) {
      alert('请输入住客姓名');
      return;
    }
    if (!walkinPhone.trim()) {
      alert('请输入住客联系手机');
      return;
    }

    const outDate = new Date(Date.now() + walkinDays * 86400000).toISOString().split('T')[0];

    const res = store.createBooking({
      roomId: selectedRoom.id,
      customerName: walkinName,
      customerPhone: walkinPhone,
      customerIdCard: walkinIdCard || '330106199201011234',
      checkInDate: today,
      checkOutDate: outDate,
      days: walkinDays,
      isDirectCheckIn: true,
      payMethod: walkinPay as any,
    });

    if (res.success) {
      alert(`已成功为客房 ${selectedRoom.roomNumber} 办理散客入住！`);
      setSelectedRoom(null);
      setActionModalType(null);
      setWalkinName('');
      setWalkinPhone('');
      setWalkinIdCard('');
      onRefresh();
    } else {
      alert(res.message);
    }
  };

  // Reserved to Occupied
  const handleReservedToOccupied = (room: Room) => {
    const orders = store.getOrders();
    const order = orders.find(o => o.roomId === room.id && o.status === 'reserved');
    if (!order) {
      alert('未找到该房间的对应预订订单');
      return;
    }

    const res = store.checkInReservedOrder(order.id);
    if (res.success) {
      alert(res.message);
      setSelectedRoom(null);
      onRefresh();
    } else {
      alert(res.message);
    }
  };

  // Extend Stay
  const handleConfirmExtend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !selectedRoom.currentGuest) return;
    const res = store.extendStay(selectedRoom.currentGuest.orderId, extendDaysCount);
    if (res.success) {
      alert(res.message);
      setSelectedRoom(null);
      setActionModalType(null);
      onRefresh();
    } else {
      alert(res.message);
    }
  };

  // Checkout
  const handleConfirmCheckout = (room: Room) => {
    if (!room.currentGuest) {
      alert('当前客房无在住登记信息');
      return;
    }
    if (window.confirm(`确认办理房号 ${room.roomNumber} 的退房结账手续吗？押金将自动结算，客房将转为打扫中。`)) {
      const res = store.checkoutOrder(room.currentGuest.orderId, true);
      if (res.success) {
        alert(res.message);
        setSelectedRoom(null);
        onRefresh();
      } else {
        alert(res.message);
      }
    }
  };

  // Finish Cleaning
  const handleFinishCleaning = (room: Room) => {
    store.finishCleaning(room.id);
    setSelectedRoom(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner and Quick Status Counts */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Grid className="w-5 h-5 text-emerald-700" />
            <span>前台房态实时看板 (Room Rack 沙盘)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            按楼层排列网格房卡，点击任意卡片即可直接办理【散客入住】、【预订转入住】、【续住办理】或【退房打扫】
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { key: 'all', label: '全部房态', count: rooms.length, color: 'bg-stone-800 text-white' },
            { key: 'available', label: '空闲就绪', count: rooms.filter(r => r.status === 'available').length, color: 'bg-emerald-600 text-white' },
            { key: 'reserved', label: '预订待到店', count: rooms.filter(r => r.status === 'reserved').length, color: 'bg-amber-500 text-white' },
            { key: 'occupied', label: '客人入住中', count: rooms.filter(r => r.status === 'occupied').length, color: 'bg-blue-600 text-white' },
            { key: 'cleaning', label: '保洁打扫中', count: rooms.filter(r => r.status === 'cleaning').length, color: 'bg-orange-500 text-white' },
            { key: 'maintenance', label: '例行维护', count: rooms.filter(r => r.status === 'maintenance').length, color: 'bg-stone-500 text-white' },
          ].map(pill => (
            <button
              key={pill.key}
              onClick={() => setFilterStatus(pill.key)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterStatus === pill.key
                  ? pill.color + ' shadow-xs font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      {/* Floors Display */}
      {floors.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-400 text-xs">
          暂无此状态的客房
        </div>
      ) : (
        <div className="space-y-6">
          {floors.map(floor => (
            <div key={floor} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-xs">
                    {floor}F
                  </span>
                  <div>
                    <h2 className="font-bold text-stone-900 text-sm">{floor} 楼客房专区</h2>
                    <span className="text-[10px] text-stone-400">共 {roomsByFloor[floor].length} 间客房</span>
                  </div>
                </div>
              </div>

              {/* Floor Room Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {roomsByFloor[floor].map(room => {
                  const isAvailable = room.status === 'available';
                  const isReserved = room.status === 'reserved';
                  const isOccupied = room.status === 'occupied';
                  const isCleaning = room.status === 'cleaning';
                  const isMaintenance = room.status === 'maintenance';

                  return (
                    <div
                      key={room.id}
                      onClick={() => handleOpenRoomAction(room)}
                      className={`rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:scale-[1.02] shadow-xs hover:shadow-md ${
                        isAvailable
                          ? 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-500'
                          : isReserved
                          ? 'border-amber-300 bg-amber-50/40 hover:border-amber-500'
                          : isOccupied
                          ? 'border-blue-400 bg-blue-50/50 hover:border-blue-600'
                          : isCleaning
                          ? 'border-orange-300 bg-orange-50/40 hover:border-orange-500'
                          : 'border-stone-300 bg-stone-50 hover:border-stone-400'
                      }`}
                    >
                      {/* Top Bar: Room Number & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-stone-900 tracking-tight">
                            {room.roomNumber}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-white font-medium text-stone-600 shadow-xs border border-stone-100">
                            {room.roomType.slice(0, 4)}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAvailable
                            ? 'bg-emerald-600 text-white'
                            : isReserved
                            ? 'bg-amber-500 text-white'
                            : isOccupied
                            ? 'bg-blue-600 text-white'
                            : isCleaning
                            ? 'bg-orange-500 text-white'
                            : 'bg-stone-500 text-white'
                        }`}>
                          {isAvailable && '🟢 空闲'}
                          {isReserved && '🟡 预订'}
                          {isOccupied && '🔵 在住'}
                          {isCleaning && '🟠 打扫'}
                          {isMaintenance && '⚪ 维护'}
                        </span>
                      </div>

                      {/* Middle Details */}
                      <div className="space-y-1 text-xs">
                        <div className="text-stone-700 font-medium truncate" title={room.name}>
                          {room.name}
                        </div>

                        {/* If occupied, show guest name and phone */}
                        {isOccupied && room.currentGuest && (
                          <div className="bg-white/80 p-2 rounded-xl border border-blue-200/60 text-[11px] text-blue-900 space-y-0.5">
                            <div className="font-semibold flex items-center gap-1">
                              <User className="w-3 h-3" /> 住客: {room.currentGuest.guestName}
                            </div>
                            <div className="text-[10px] text-stone-500">
                              离店: {room.currentGuest.checkOutDate}
                            </div>
                          </div>
                        )}

                        {/* If reserved, show guest name */}
                        {isReserved && room.currentGuest && (
                          <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 space-y-0.5">
                            <div className="font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> 预订客: {room.currentGuest.guestName}
                            </div>
                            <div className="text-[10px] text-stone-500">
                              预定入住: {room.currentGuest.checkInDate}
                            </div>
                          </div>
                        )}

                        {/* If cleaning */}
                        {isCleaning && (
                          <div className="bg-white/80 p-2 rounded-xl border border-orange-200/60 text-[11px] text-orange-900 flex items-center gap-1">
                            <Brush className="w-3 h-3 text-orange-600" />
                            <span>客房清洁消杀作业中</span>
                          </div>
                        )}

                        {/* If available */}
                        {isAvailable && (
                          <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
                            <span>¥{room.price}/晚</span>
                            <span className="text-emerald-700 font-medium">随时可入住</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Hint */}
                      <div className="pt-2 border-t border-stone-200/40 text-[10px] text-stone-400 flex items-center justify-between">
                        <span>权重 {room.weight}</span>
                        <span className="font-medium text-stone-700 hover:text-emerald-700">点击办理 ➜</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Action Popup Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-stone-900">
                    房号 {selectedRoom.roomNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedRoom.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedRoom.status === 'reserved'
                      ? 'bg-amber-100 text-amber-800'
                      : selectedRoom.status === 'occupied'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedRoom.status === 'cleaning'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {selectedRoom.status === 'available' && '🟢 空闲可订'}
                    {selectedRoom.status === 'reserved' && '🟡 预订待入住'}
                    {selectedRoom.status === 'occupied' && '🔵 客人入住中'}
                    {selectedRoom.status === 'cleaning' && '🟠 保洁打扫中'}
                    {selectedRoom.status === 'maintenance' && '⚪ 例行维护中'}
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {selectedRoom.homestayName} • {selectedRoom.name}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedRoom(null);
                  setActionModalType(null);
                }}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Room Basic Specs */}
            <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl text-center text-xs">
              <div>
                <div className="text-stone-400 text-[10px]">房型单价</div>
                <div className="font-bold text-rose-600">¥{selectedRoom.price}/晚</div>
              </div>
              <div>
                <div className="text-stone-400 text-[10px]">押金标准</div>
                <div className="font-bold text-stone-800">¥{selectedRoom.deposit}</div>
              </div>
              <div>
                <div className="text-stone-400 text-[10px]">床型面积</div>
                <div className="font-bold text-stone-800">{selectedRoom.area}m²</div>
              </div>
            </div>

            {/* If In Action Mode: Walk-in Checkin Form */}
            {actionModalType === 'checkin' && (
              <form onSubmit={handleWalkInCheckin} className="space-y-3 text-xs bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
                <div className="font-bold text-emerald-900 text-sm">办理散客现场直接入住</div>
                
                <div>
                  <label className="block text-stone-600 font-medium mb-1">住客姓名</label>
                  <input
                    type="text"
                    required
                    value={walkinName}
                    onChange={e => setWalkinName(e.target.value)}
                    placeholder="如: 赵小峰"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">联系手机</label>
                    <input
                      type="tel"
                      required
                      value={walkinPhone}
                      onChange={e => setWalkinPhone(e.target.value)}
                      placeholder="13800138000"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">入住天数</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={walkinDays}
                      onChange={e => setWalkinDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">身份证号 (公安联网备查)</label>
                  <input
                    type="text"
                    value={walkinIdCard}
                    onChange={e => setWalkinIdCard(e.target.value)}
                    placeholder="330106199201011234"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-stone-900 pt-1">
                  <span>应收金额 (房费 ¥{selectedRoom.price * walkinDays} + 押金 ¥{selectedRoom.deposit})</span>
                  <span className="text-rose-600 text-sm">¥{selectedRoom.price * walkinDays + selectedRoom.deposit}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActionModalType(null)}
                    className="flex-1 py-2 rounded-xl border border-stone-200 bg-white text-stone-600"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    确认收银并入住
                  </button>
                </div>
              </form>
            )}

            {/* If In Action Mode: Extend Stay Form */}
            {actionModalType === 'extend' && selectedRoom.currentGuest && (
              <form onSubmit={handleConfirmExtend} className="space-y-3 text-xs bg-blue-50/50 p-4 rounded-2xl border border-blue-200">
                <div className="font-bold text-blue-900 text-sm">办理续住手续</div>
                <div className="text-stone-600">当前在request住客：{selectedRoom.currentGuest.guestName}</div>
                <div className="text-stone-500">原计划离店日期：{selectedRoom.currentGuest.checkOutDate}</div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">追加延长天数</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 5].map(d => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setExtendDaysCount(d)}
                        className={`px-3 py-1.5 rounded-xl border font-bold ${
                          extendDaysCount === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-stone-700 border-stone-200'
                        }`}
                      >
                        +{d}天
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-xs font-bold text-stone-900 pt-1">
                  <span>追加房费 ({extendDaysCount}晚)</span>
                  <span className="text-rose-600 text-sm">¥{selectedRoom.price * extendDaysCount}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActionModalType(null)}
                    className="flex-1 py-2 rounded-xl border border-stone-200 bg-white text-stone-600"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    确认续住并结算
                  </button>
                </div>
              </form>
            )}

            {/* Default Quick Operational Buttons based on current room status */}
            {!actionModalType && (
              <div className="space-y-2">
                {selectedRoom.status === 'available' && (
                  <button
                    onClick={() => setActionModalType('checkin')}
                    className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>办理散客直接入住登记</span>
                  </button>
                )}

                {selectedRoom.status === 'reserved' && (
                  <button
                    onClick={() => handleReservedToOccupied(selectedRoom)}
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>核验证件并一键办理转入住</span>
                  </button>
                )}

                {selectedRoom.status === 'occupied' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActionModalType('extend')}
                      className="py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" />
                      <span>办理客人续住</span>
                    </button>
                    <button
                      onClick={() => handleConfirmCheckout(selectedRoom)}
                      className="py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>办理退房结算</span>
                    </button>
                  </div>
                )}

                {selectedRoom.status === 'cleaning' && (
                  <button
                    onClick={() => handleFinishCleaning(selectedRoom)}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Brush className="w-4 h-4" />
                    <span>保洁消杀完毕，恢复为空闲可订</span>
                  </button>
                )}

                {/* Status Toggle Override */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400">房态手动标记:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        store.setRoomStatus(selectedRoom.id, 'available');
                        setSelectedRoom(null);
                        onRefresh();
                      }}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px]"
                    >
                      置为空闲
                    </button>
                    <button
                      onClick={() => {
                        store.setRoomStatus(selectedRoom.id, 'cleaning');
                        setSelectedRoom(null);
                        onRefresh();
                      }}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px]"
                    >
                      置为打扫
                    </button>
                    <button
                      onClick={() => {
                        store.setRoomStatus(selectedRoom.id, 'maintenance');
                        setSelectedRoom(null);
                        onRefresh();
                      }}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px]"
                    >
                      置为维护
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
