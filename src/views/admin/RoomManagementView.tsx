import React, { useState } from 'react';
import { Room, RoomType } from '../../types';
import { store } from '../../services/store';
import { 
  Hotel, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Sparkles, 
  X, 
  Upload, 
  Check, 
  Eye, 
  Star,
  Sliders,
  DollarSign
} from 'lucide-react';

interface Props {
  rooms: Room[];
  onRefresh: () => void;
}

const ROOM_TYPES: RoomType[] = [
  '山林独栋木屋',
  '海景度假房',
  '日式榻榻米',
  '亲子家庭套房',
  '轻奢复式Loft',
  '庭院大床房',
];

export const RoomManagementView: React.FC<Props> = ({ rooms, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [shelfFilter, setShelfFilter] = useState('all');

  // Edit / Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);

  const filteredRooms = rooms.filter(r => {
    if (typeFilter !== 'all' && r.roomType !== typeFilter) return false;
    if (shelfFilter === 'on' && !r.isOnShelf) return false;
    if (shelfFilter === 'off' && r.isOnShelf) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.roomNumber.toLowerCase().includes(q) ||
        r.homestayName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingRoom({
      roomNumber: `${rooms.length + 101}`,
      name: '',
      homestayName: '栖云山居民宿',
      roomType: '庭院大床房',
      price: 580,
      deposit: 300,
      area: 50,
      bedType: '1张1.8米大床',
      maxGuests: 2,
      floor: 1,
      weight: 80,
      coverImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
      tags: ['山景露台', '高速WiFi'],
      amenities: ['100寸投影', '独立卫浴', '暖气地暖', '免费早餐'],
      description: '自然静谧的舒适空间，打造别致的旅居体验。',
      isOnShelf: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom({ ...room });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    if (!editingRoom.name?.trim()) {
      alert('请填写房源名称');
      return;
    }
    if (!editingRoom.roomNumber?.trim()) {
      alert('请填写房号');
      return;
    }

    const res = store.saveRoom(editingRoom);
    if (res.success) {
      alert(res.message);
      setIsModalOpen(false);
      setEditingRoom(null);
      onRefresh();
    } else {
      alert(res.message);
    }
  };

  const handleToggleShelf = (roomId: string) => {
    store.toggleRoomShelf(roomId);
    onRefresh();
  };

  const handleDelete = (roomId: string) => {
    if (window.confirm('确认删除此房源吗？不可撤销。')) {
      const res = store.deleteRoom(roomId);
      alert(res.message);
      if (res.success) onRefresh();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Hotel className="w-5 h-5 text-emerald-700" />
            <span>房源信息综合管理 (HRoomView)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            配置房源规格参数、上下架、定价与排序权重值 (权重最高者将在前台首页顶部轮播展示)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>新增民宿房源</span>
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
            placeholder="搜索房号、名称、所属民宿..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">全部房型</option>
            {ROOM_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={shelfFilter}
            onChange={e => setShelfFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">上下架状态 (全部)</option>
            <option value="on">仅已上架</option>
            <option value="off">仅已下架</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <th className="p-4">封面与房号</th>
                <th className="p-4">客房名称 / 所属民宿</th>
                <th className="p-4">房型门类</th>
                <th className="p-4">价格 / 押金</th>
                <th className="p-4">规格参数</th>
                <th className="p-4">权重值 (Top排序)</th>
                <th className="p-4">上架状态</th>
                <th className="p-4">房态</th>
                <th className="p-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRooms.map(room => (
                <tr key={room.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={room.coverImage}
                        alt={room.name}
                        className="w-14 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <span className="font-mono font-bold text-sm text-stone-900 block">
                          {room.roomNumber}
                        </span>
                        <span className="text-[10px] text-stone-400">{room.floor}层</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-stone-800 line-clamp-1">{room.name}</div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">{room.homestayName}</div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      {room.roomType}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-rose-600">¥{room.price} <span className="text-[10px] text-stone-400 font-normal">/晚</span></div>
                    <div className="text-[10px] text-stone-400">押金: ¥{room.deposit}</div>
                  </td>

                  <td className="p-4 text-[11px] text-stone-500">
                    <div>{room.area}m² • 宜住{room.maxGuests}人</div>
                    <div className="text-stone-400 truncate max-w-[120px]">{room.bedType}</div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {room.weight}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleShelf(room.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        room.isOnShelf
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                    >
                      {room.isOnShelf ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{room.isOnShelf ? '已上架' : '已下架'}</span>
                    </button>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      room.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700'
                        : room.status === 'reserved'
                        ? 'bg-amber-50 text-amber-700'
                        : room.status === 'occupied'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {room.status === 'available' && '空闲'}
                      {room.status === 'reserved' && '预订中'}
                      {room.status === 'occupied' && '入住中'}
                      {room.status === 'cleaning' && '打扫中'}
                      {room.status === 'maintenance' && '维护中'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="编辑房源"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="删除房源"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900">
                {editingRoom.id ? '编辑房源信息' : '新增民宿客房'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">客房编号 (房号)</label>
                  <input
                    type="text"
                    required
                    value={editingRoom.roomNumber}
                    onChange={e => setEditingRoom({ ...editingRoom, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">所属民宿客栈品牌</label>
                  <input
                    type="text"
                    required
                    value={editingRoom.homestayName}
                    onChange={e => setEditingRoom({ ...editingRoom, homestayName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">客房标题 / 描述名称</label>
                <input
                  type="text"
                  required
                  value={editingRoom.name}
                  onChange={e => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  placeholder="如：莫干山·栖云林岚独栋山景木屋"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">房型类别</label>
                  <select
                    value={editingRoom.roomType}
                    onChange={e => setEditingRoom({ ...editingRoom, roomType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    {ROOM_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">日单价 (¥/晚)</label>
                  <input
                    type="number"
                    required
                    value={editingRoom.price}
                    onChange={e => setEditingRoom({ ...editingRoom, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">住房押金 (¥)</label>
                  <input
                    type="number"
                    required
                    value={editingRoom.deposit}
                    onChange={e => setEditingRoom({ ...editingRoom, deposit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">面积 (m²)</label>
                  <input
                    type="number"
                    value={editingRoom.area}
                    onChange={e => setEditingRoom({ ...editingRoom, area: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">床型描述</label>
                  <input
                    type="text"
                    value={editingRoom.bedType}
                    onChange={e => setEditingRoom({ ...editingRoom, bedType: e.target.value })}
                    placeholder="如: 1张2.0米大床"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">排序权重 (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingRoom.weight}
                    onChange={e => setEditingRoom({ ...editingRoom, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-bold text-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">封面图片 URL (或实景照地址)</label>
                <input
                  type="text"
                  required
                  value={editingRoom.coverImage}
                  onChange={e => setEditingRoom({ ...editingRoom, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">详细介绍</label>
                <textarea
                  rows={3}
                  value={editingRoom.description}
                  onChange={e => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={editingRoom.isOnShelf}
                    onChange={e => setEditingRoom({ ...editingRoom, isOnShelf: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>立即上架至前台展示</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 text-stone-600 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  保存房源配置
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
