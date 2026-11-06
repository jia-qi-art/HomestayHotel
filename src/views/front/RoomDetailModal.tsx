import React, { useState } from 'react';
import { Room, Review } from '../../types';
import { store } from '../../services/store';
import { 
  X, 
  Star, 
  MapPin, 
  Users, 
  Maximize2, 
  BedDouble, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Heart,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  UserCheck
} from 'lucide-react';

interface Props {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
  allRooms: Room[];
  onSelectOtherRoom: (room: Room) => void;
}

export const RoomDetailModal: React.FC<Props> = ({
  room,
  isOpen,
  onClose,
  onBookingSuccess,
  allRooms,
  onSelectOtherRoom,
}) => {
  if (!isOpen || !room) return null;

  const currentUser = store.getCurrentUser();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Booking Form State
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [customerName, setCustomerName] = useState(currentUser.realName || '张敏思');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '18688889999');
  const [customerIdCard, setCustomerIdCard] = useState('330106199401011234');
  const [remarks, setRemarks] = useState('');
  const [payMethod, setPayMethod] = useState<'微信支付' | '支付宝'>('微信支付');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const nights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  const totalRoomPrice = room.price * nights;
  const totalPayAmount = totalRoomPrice + room.deposit;

  // Filter reviews for this room
  const reviews = store.getReviews().filter(r => r.roomId === room.id);

  // Same homestay recommendations (系统概述要求：还有推荐同属于一家民宿的其他room)
  const relatedRooms = allRooms.filter(r => r.homestayName === room.homestayName && r.id !== room.id);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('请输入入住人姓名');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMsg('请输入正确的联系手机号');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = store.createBooking({
        roomId: room.id,
        customerName,
        customerPhone,
        customerIdCard,
        checkInDate,
        checkOutDate,
        days: nights,
        remarks,
        payMethod,
      });

      setIsSubmitting(false);
      if (res.success) {
        onBookingSuccess();
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const images = room.images && room.images.length > 0 ? room.images : [room.coverImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {room.homestayName}
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-xs font-medium text-stone-600">房号 {room.roomNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('已复制房源分享链接！');
              }}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
              title="分享房源"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Main Title & Tags */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                综合权重热度: {room.weight}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">
                {room.roomType}
              </span>
              {room.tags.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-700">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{room.name}</h1>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {room.rating.toFixed(1)}分 ({room.reviewCount}条住客真实点评)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                浙江省湖州市德清县莫干山风景区
              </span>
            </p>
          </div>

          {/* Photo Gallery & Carousel */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 group aspect-[16/9] max-h-[380px]">
            <img
              src={images[activeImgIndex] || room.coverImage}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImgIndex((activeImgIndex - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImgIndex((activeImgIndex + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeImgIndex === idx ? 'bg-white w-5' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
              实景图 {activeImgIndex + 1} / {images.length}
            </div>
          </div>

          {/* Grid Layout: Left Details vs Right Booking Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Room Specs, Amenities, Description, Reviews */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Specs Bar */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
                <div className="p-2">
                  <div className="flex justify-center text-emerald-700 mb-1">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-stone-500">客房面积</div>
                  <div className="text-xs font-semibold text-stone-800">{room.area} m²</div>
                </div>

                <div className="p-2">
                  <div className="flex justify-center text-emerald-700 mb-1">
                    <BedDouble className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-stone-500">床型配置</div>
                  <div className="text-xs font-semibold text-stone-800 truncate" title={room.bedType}>
                    {room.bedType}
                  </div>
                </div>

                <div className="p-2">
                  <div className="flex justify-center text-emerald-700 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-stone-500">宜住人数</div>
                  <div className="text-xs font-semibold text-stone-800">最多 {room.maxGuests} 人</div>
                </div>

                <div className="p-2">
                  <div className="flex justify-center text-emerald-700 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-stone-500">押金保证</div>
                  <div className="text-xs font-semibold text-stone-800">¥{room.deposit} (离店秒退)</div>
                </div>
              </div>

              {/* Room Description */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-2">房源介绍</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-white border border-stone-100 p-4 rounded-xl">
                  {room.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-3">客房配套设施</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {room.amenities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/60 text-xs text-stone-700"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Reviews Section (脱敏评价) */}
              <div className="pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span>住客真实体验点评</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {reviews.length} 条
                    </span>
                  </h3>
                  <span className="text-xs text-stone-400">已自动完成实名隐私脱敏</span>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs bg-stone-50 rounded-xl">
                    暂无该房间评价，完成入住退房后即可发表您的第一篇体验评价！
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map(rev => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.userAvatar}
                              alt={rev.userNameMasked}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-semibold text-stone-800">{rev.userNameMasked}</div>
                              <div className="text-[10px] text-stone-400">{rev.roomType} • {rev.createTime}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            {Array.from({ length: rev.rating }).map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="ml-1 text-xs">{rev.rating}.0</span>
                          </div>
                        </div>

                        <p className="text-stone-700 leading-relaxed pt-1">
                          {rev.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Same Homestay Recommendations (推荐同属于一家民宿的其他room) */}
              {relatedRooms.length > 0 && (
                <div className="pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-900 mb-3">
                    同属「{room.homestayName}」其他推荐房型
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedRooms.map(rel => (
                      <div
                        key={rel.id}
                        onClick={() => onSelectOtherRoom(rel)}
                        className="p-3 rounded-xl border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex gap-3 group bg-white"
                      >
                        <img
                          src={rel.coverImage}
                          alt={rel.name}
                          className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="text-xs font-bold text-stone-900 truncate">{rel.name}</div>
                            <div className="text-[10px] text-stone-500 mt-0.5">{rel.bedType} • {rel.area}m²</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-600">¥{rel.price} <span className="text-[10px] text-stone-400 font-normal">/晚</span></span>
                            <span className="text-[10px] text-emerald-600 font-medium">查看</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Sticky Booking Card */}
            <div>
              <div className="sticky top-20 bg-white border border-stone-200 rounded-3xl p-6 shadow-xl space-y-5">
                
                <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-2xl font-black text-rose-600">¥{room.price}</span>
                    <span className="text-xs text-stone-500"> / 晚</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      room.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : room.status === 'reserved'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {room.status === 'available' ? '🟢 当前可订' : room.status === 'reserved' ? '🟡 已被预订' : '🔴 已入住'}
                    </span>
                  </div>
                </div>

                {room.status !== 'available' ? (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> 该房间当前不可预订
                    </div>
                    <p>
                      客房目前处于【{room.status === 'reserved' ? '已预订待入住' : room.status === 'occupied' ? '客人入住中' : '保洁清洁中'}】状态。
                      您可以在下方选择同属于该民宿的其他可用房间，或通过右下角角色切换到前台直接管理。
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4 text-xs">
                    
                    {errorMsg && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                        {errorMsg}
                      </div>
                    )}

                    {/* Date pickers */}
                    <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                      <div>
                        <label className="text-[10px] text-stone-400 font-medium block">入住日期</label>
                        <input
                          type="date"
                          value={checkInDate}
                          min={today}
                          onChange={e => setCheckInDate(e.target.value)}
                          className="w-full bg-transparent font-medium text-stone-800 text-xs focus:outline-none mt-0.5"
                        />
                      </div>
                      <div className="border-l border-stone-200 pl-2">
                        <label className="text-[10px] text-stone-400 font-medium block">离店日期 ({nights}晚)</label>
                        <input
                          type="date"
                          value={checkOutDate}
                          min={checkInDate}
                          onChange={e => setCheckOutDate(e.target.value)}
                          className="w-full bg-transparent font-medium text-stone-800 text-xs focus:outline-none mt-0.5"
                        />
                      </div>
                    </div>

                    {/* Guest Information */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-stone-600 font-medium mb-1">入住人姓名</label>
                        <div className="relative">
                          <UserCheck className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            placeholder="如：张敏思"
                            className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-600 font-medium mb-1">联系手机号</label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={e => setCustomerPhone(e.target.value)}
                            placeholder="如：18688889999"
                            className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-600 font-medium mb-1">身份证号 (用于实名报备)</label>
                        <input
                          type="text"
                          value={customerIdCard}
                          onChange={e => setCustomerIdCard(e.target.value)}
                          placeholder="330106199401011234"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-600 font-medium mb-1">入住特殊要求 (选填)</label>
                        <input
                          type="text"
                          value={remarks}
                          onChange={e => setRemarks(e.target.value)}
                          placeholder="如：需要安静房间、准备无糖早餐等"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-stone-600 font-medium mb-1.5">支付方式</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['微信支付', '支付宝'] as const).map(method => (
                          <button
                            type="button"
                            key={method}
                            onClick={() => setPayMethod(method)}
                            className={`py-2 px-3 rounded-xl border text-center transition-all ${
                              payMethod === method
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold'
                                : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70 space-y-1.5 text-stone-600">
                      <div className="flex justify-between">
                        <span>房费 (¥{room.price} × {nights}晚)</span>
                        <span>¥{totalRoomPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>住房押金 (可退)</span>
                        <span>¥{room.deposit}</span>
                      </div>
                      <div className="border-t border-stone-200 pt-1.5 flex justify-between font-bold text-stone-900 text-sm">
                        <span>应付总计 (含押金)</span>
                        <span className="text-rose-600">¥{totalPayAmount}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>正在生成订单...</span>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>立即预订 (¥{totalPayAmount})</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-stone-400 text-center">
                      预订成功后可在「我的订单」随时查看状态并办理取消，入住完成后支持评分
                    </p>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
