import React, { useState, useMemo } from 'react';
import { Room, RoomType } from '../../types';
import { RoomDetailModal } from './RoomDetailModal';
import { 
  Sparkles, 
  Star, 
  MapPin, 
  Users, 
  Maximize2, 
  Search, 
  SlidersHorizontal, 
  Flame, 
  ChevronRight, 
  ChevronLeft,
  BedDouble,
  Heart,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface Props {
  rooms: Room[];
  onBookSuccess: () => void;
}

export const RoomListView: React.FC<Props> = ({ rooms, onBookSuccess }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHomestay, setSelectedHomestay] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'weight' | 'priceAsc' | 'priceDesc' | 'rating'>('weight');

  // Top 6 Highest-Weighted Rooms for Top Banner Carousel
  // "系统概述：1. 首页顶部轮播图来源：默认权重最高的6个room"
  const top6Rooms = useMemo(() => {
    return [...rooms]
      .filter(r => r.isOnShelf)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 6);
  }, [rooms]);

  // Unique homestay brands
  const homestays = useMemo(() => {
    const list = Array.from(new Set(rooms.map(r => r.homestayName)));
    return ['all', ...list];
  }, [rooms]);

  // Filtered & Sorted room list
  // "2. 剩下的room列表依据权重从上到下排列"
  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room => {
        if (!room.isOnShelf) return false;
        if (selectedHomestay !== 'all' && room.homestayName !== selectedHomestay) return false;
        if (selectedType !== 'all' && room.roomType !== selectedType) return false;
        if (priceRange === 'under500' && room.price >= 500) return false;
        if (priceRange === '500to800' && (room.price < 500 || room.price > 800)) return false;
        if (priceRange === 'over800' && room.price <= 800) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = room.name.toLowerCase().includes(q);
          const matchHs = room.homestayName.toLowerCase().includes(q);
          const matchType = room.roomType.toLowerCase().includes(q);
          const matchTags = room.tags.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchHs && !matchType && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'weight') return b.weight - a.weight;
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [rooms, selectedHomestay, selectedType, priceRange, searchQuery, sortBy]);

  const handleOpenRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsDetailOpen(true);
  };

  const currentBannerRoom = top6Rooms[activeBannerIdx] || top6Rooms[0];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Top Carousel: 默认权重最高的6个room (依据原项目系统概述规划) */}
      {currentBannerRoom && (
        <section className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-900 text-white min-h-[380px] sm:min-h-[440px] flex items-end">
          <img
            src={currentBannerRoom.coverImage}
            alt={currentBannerRoom.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Banner Floating Badge */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-stone-950 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Top {activeBannerIdx + 1} 首页高权精选
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white/90 backdrop-blur-md border border-white/10">
              权重分: {currentBannerRoom.weight}
            </span>
          </div>

          {/* Carousel Controls */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
            <button
              onClick={() => setActiveBannerIdx((activeBannerIdx - 1 + top6Rooms.length) % top6Rooms.length)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono px-2 text-stone-300">
              {activeBannerIdx + 1} / {top6Rooms.length}
            </span>
            <button
              onClick={() => setActiveBannerIdx((activeBannerIdx + 1) % top6Rooms.length)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Content Info */}
          <div className="relative z-10 p-6 sm:p-10 max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentBannerRoom.homestayName} • 房号 {currentBannerRoom.roomNumber}</span>
              <span>•</span>
              <span>{currentBannerRoom.roomType}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              {currentBannerRoom.name}
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
              {currentBannerRoom.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-stone-400">每晚优惠价</span>
                <span className="text-2xl font-black text-emerald-400">¥{currentBannerRoom.price}</span>
                <span className="text-xs text-stone-400">起</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-400/30">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{currentBannerRoom.rating.toFixed(1)}分 ({currentBannerRoom.reviewCount}人真实好评)</span>
              </div>

              <button
                onClick={() => handleOpenRoom(currentBannerRoom)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 group cursor-pointer"
              >
                <span>立即查看详情与预订</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search Bar */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
        
        {/* Top Search Input & Sort Options */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索房源名称、房型、配套设施 (如: 私汤、投影、木屋、滑梯)..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>排序:</span>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="weight">🔥 按权重热度推荐 (Top)</option>
              <option value="rating">⭐ 评分优先 (高分)</option>
              <option value="priceAsc">💰 价格从低到高</option>
              <option value="priceDesc">💎 价格从高到低</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-2 border-t border-stone-100 space-y-3">
          
          {/* Homestay Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 font-medium shrink-0">民宿品牌:</span>
            {homestays.map(hs => (
              <button
                key={hs}
                onClick={() => setSelectedHomestay(hs)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  selectedHomestay === hs
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {hs === 'all' ? '全部品牌客栈' : hs}
              </button>
            ))}
          </div>

          {/* Room Type Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 font-medium shrink-0">房型分类:</span>
            {[
              { key: 'all', label: '全部门类' },
              { key: '山林独栋木屋', label: '山林独栋木屋' },
              { key: '海景度假房', label: '海景度假房' },
              { key: '日式榻榻米', label: '日式榻榻米' },
              { key: '亲子家庭套房', label: '亲子家庭套房' },
              { key: '轻奢复式Loft', label: '轻奢复式Loft' },
              { key: '庭院大床房', label: '庭院大床房' },
            ].map(type => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  selectedType === type.key
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Price Range Selector */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-stone-400 font-medium shrink-0">价位区间:</span>
            {[
              { key: 'all', label: '不限预算' },
              { key: 'under500', label: '¥500 以下' },
              { key: '500to800', label: '¥500 - ¥800' },
              { key: 'over800', label: '¥800 以上' },
            ].map(p => (
              <button
                key={p.key}
                onClick={() => setPriceRange(p.key)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  priceRange === p.key
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

        </div>

      </section>

      {/* Room Listing Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <span>探索精品美宿房源</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              共 {filteredRooms.length} 间
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            默认按房源权重自上而下呈现，每一条真实住客五星好评都将直接回流增幅房源权重
          </p>
        </div>
      </div>

      {/* Room Cards Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-stone-800">没有找到符合条件的房源</h3>
          <p className="text-xs text-stone-500">建议尝试重置筛选条件或清空关键词搜索</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedHomestay('all');
              setSelectedType('all');
              setPriceRange('all');
            }}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl"
          >
            重置所有筛选
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => {
            const isAvailable = room.status === 'available';

            return (
              <div
                key={room.id}
                onClick={() => handleOpenRoom(room)}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={room.coverImage}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top Status & Weight Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      权重 {room.weight}
                    </span>
                    <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-white/80 text-stone-800 backdrop-blur-md">
                      房号 {room.roomNumber}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md ${
                      isAvailable
                        ? 'bg-emerald-600/90 text-white shadow-sm'
                        : room.status === 'reserved'
                        ? 'bg-amber-600/90 text-white'
                        : 'bg-rose-600/90 text-white'
                    }`}>
                      {isAvailable ? '可预订' : room.status === 'reserved' ? '已预订' : '已入住'}
                    </span>
                  </div>

                  {/* Homestay Tag */}
                  <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-lg">
                    {room.homestayName}
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {room.roomType}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {room.rating.toFixed(1)} ({room.reviewCount})
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {room.name}
                    </h3>

                    {/* Room Meta Specs */}
                    <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3 h-3 text-stone-400" />
                        {room.area}m²
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3 h-3 text-stone-400" />
                        {room.bedType}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-stone-400" />
                        宜住{room.maxGuests}人
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {room.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-rose-600">¥{room.price}</span>
                        <span className="text-xs text-stone-400">/ 晚</span>
                      </div>
                      <div className="text-[10px] text-stone-400">
                        押金 ¥{room.deposit} (退房原路退回)
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRoom(room);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isAvailable
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white group-hover:shadow-md'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      {isAvailable ? '立即预订' : '查看详情'}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBookingSuccess={() => {
          onBookSuccess();
          setIsDetailOpen(false);
        }}
        allRooms={rooms}
        onSelectOtherRoom={(newRoom) => {
          setSelectedRoom(newRoom);
        }}
      />

    </div>
  );
};
