import React, { useMemo } from 'react';
import { Room, Order, User, SysLog } from '../../types';
import { 
  Hotel, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  BedDouble
} from 'lucide-react';

interface Props {
  rooms: Room[];
  orders: Order[];
  users: User[];
  logs: SysLog[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  rooms,
  orders,
  users,
  logs,
  onNavigateTab,
}) => {
  // Statistics
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const reservedCount = rooms.filter(r => r.status === 'reserved').length;
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const cleaningCount = rooms.filter(r => r.status === 'cleaning').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  // Financial stats
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status === 'completed' || o.status === 'occupied')
      .reduce((sum, o) => sum + o.totalPrice, 0);
  }, [orders]);

  const customerCount = users.filter(u => u.role === 'customer').length;

  // Mock 7-day trend
  const sevenDayRevenue = [
    { day: '10-31', amount: 3280 },
    { day: '11-01', amount: 4860 },
    { day: '11-02', amount: 5690 },
    { day: '11-03', amount: 4120 },
    { day: '11-04', amount: 6240 },
    { day: '11-05', amount: 5880 },
    { day: '今日', amount: 6896 },
  ];

  const maxRev = Math.max(...sevenDayRevenue.map(d => d.amount));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <Hotel className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>智能客房综合管理中枢 (PMS Console)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            欢迎登录民宿酒店预订管理控制台
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            实时监控全店房态排房、入住接待与财务流水。系统已依据开源项目规范，全面打通「权重排序-前台排房-入住退房-评价反哺」闭环。
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Rooms */}
        <div 
          onClick={() => onNavigateTab('rooms')}
          className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">客房总数</span>
            <Hotel className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{totalRooms} <span className="text-xs font-normal text-stone-400">间</span></div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-0.5">
            <span>空闲可用: {availableCount} 间</span>
          </div>
        </div>

        {/* Card 2: Occupancy Rate */}
        <div 
          onClick={() => onNavigateTab('rack')}
          className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">今日入住率</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{occupancyRate}%</div>
          <div className="text-[11px] text-blue-600 mt-1 flex items-center gap-0.5">
            <span>在住中: {occupiedCount} 间</span>
          </div>
        </div>

        {/* Card 3: Pending Reservations */}
        <div 
          onClick={() => onNavigateTab('checkin')}
          className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-amber-600 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">待办理预订</span>
            <CalendarCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{reservedCount} <span className="text-xs font-normal text-stone-400">单</span></div>
          <div className="text-[11px] text-amber-600 mt-1">
            待前台核验到店
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div 
          onClick={() => onNavigateTab('finance')}
          className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-rose-600 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">累计营收入账</span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">¥{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-stone-400 mt-1">
            总计完成/在住订单
          </div>
        </div>

        {/* Card 5: Registered Customers */}
        <div 
          onClick={() => onNavigateTab('system')}
          className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:border-purple-600 hover:shadow-md transition-all cursor-pointer col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">注册住客会员</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{customerCount} <span className="text-xs font-normal text-stone-400">人</span></div>
          <div className="text-[11px] text-purple-600 mt-1">
            平台活跃散客
          </div>
        </div>

      </div>

      {/* Main Charts & Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Room Status Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">客房实时状态分布</h3>
            <button
              onClick={() => onNavigateTab('rack')}
              className="text-xs text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              房态沙盘 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 空闲就绪 (可订)
                </span>
                <span className="font-bold text-stone-900">{availableCount} 间 ({totalRooms > 0 ? Math.round((availableCount/totalRooms)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(availableCount/totalRooms)*100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 预订待入住
                </span>
                <span className="font-bold text-stone-900">{reservedCount} 间 ({totalRooms > 0 ? Math.round((reservedCount/totalRooms)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(reservedCount/totalRooms)*100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> 住客入住中
                </span>
                <span className="font-bold text-stone-900">{occupiedCount} 间 ({totalRooms > 0 ? Math.round((occupiedCount/totalRooms)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(occupiedCount/totalRooms)*100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> 保洁打扫中
                </span>
                <span className="font-bold text-stone-900">{cleaningCount} 间 ({totalRooms > 0 ? Math.round((cleaningCount/totalRooms)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(cleaningCount/totalRooms)*100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400" /> 维护/维修中
                </span>
                <span className="font-bold text-stone-900">{maintenanceCount} 间 ({totalRooms > 0 ? Math.round((maintenanceCount/totalRooms)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-400 rounded-full" style={{ width: `${(maintenanceCount/totalRooms)*100}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>总上架率: {Math.round((rooms.filter(r => r.isOnShelf).length / totalRooms) * 100)}%</span>
            <span className="text-emerald-700 font-medium">客房周转正常</span>
          </div>
        </div>

        {/* Center/Right: 7-Day Revenue Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">近7日营收走势分析</h3>
              <p className="text-xs text-stone-400 mt-0.5">每日房费入账与已结算押金明细趋势</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full">
              日均: ¥5,195
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {sevenDayRevenue.map((item, idx) => {
              const heightPercent = Math.round((item.amount / maxRev) * 100);
              const isToday = idx === sevenDayRevenue.length - 1;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-stone-500 group-hover:text-emerald-700 transition-colors">
                    ¥{item.amount}
                  </div>
                  <div className="w-full max-w-[42px] bg-stone-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 group-hover:opacity-90 ${
                        isToday ? 'bg-gradient-to-t from-emerald-700 to-teal-500' : 'bg-stone-800'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className={`text-[11px] font-medium ${isToday ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>数据源: 订单完成流水实时汇总</span>
            <button
              onClick={() => onNavigateTab('finance')}
              className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
            >
              查看完整财务大表 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Real-time System Logs & Quick Operational Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions Shortcuts */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">前台高频业务直通车</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('checkin')}
              className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-colors group"
            >
              <CalendarCheck className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-emerald-900">办理入住</div>
              <div className="text-[10px] text-emerald-700">散客到店 / 预订核验</div>
            </button>

            <button
              onClick={() => onNavigateTab('checkin')}
              className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-colors group"
            >
              <Clock className="w-5 h-5 text-blue-700 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-blue-900">续住退房</div>
              <div className="text-[10px] text-blue-700">延期 / 押金结算</div>
            </button>

            <button
              onClick={() => onNavigateTab('rack')}
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-colors group"
            >
              <BedDouble className="w-5 h-5 text-stone-700 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-stone-900">房态沙盘</div>
              <div className="text-[10px] text-stone-500">楼层网格卡片管理</div>
            </button>

            <button
              onClick={() => onNavigateTab('rooms')}
              className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-colors group"
            >
              <Hotel className="w-5 h-5 text-purple-700 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-purple-900">房源上下架</div>
              <div className="text-[10px] text-purple-700">价格 / 权重排序</div>
            </button>
          </div>
        </div>

        {/* Real-time Operation Logs Stream */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>系统实时操作与业务流水审计</span>
            </h3>
            <button
              onClick={() => onNavigateTab('system')}
              className="text-xs text-stone-400 hover:text-stone-800"
            >
              查看全部日志
            </button>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${
                    log.status === '成功' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <div>
                    <span className="font-semibold text-stone-800">{log.action}</span>
                    <span className="text-stone-400 mx-1.5">•</span>
                    <span className="text-stone-600">{log.details}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-[10px] text-stone-400">{log.createTime.split(' ')[1]}</div>
                  <div className="text-[10px] text-stone-500">{log.username} ({log.role})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
