import React from 'react';
import { User } from '../types';
import { 
  Hotel, 
  LayoutDashboard, 
  Grid, 
  CalendarCheck, 
  Receipt, 
  BarChart3, 
  Users, 
  Sparkles,
  BookOpen,
  ArrowRightLeft,
  Compass,
  BookmarkCheck,
  User as UserIcon,
  LogOut,
  FolderTree
} from 'lucide-react';

interface Props {
  currentUser: User;
  currentMode: 'front' | 'back';
  onToggleMode: (mode: 'front' | 'back') => void;
  frontTab: 'home' | 'orders' | 'profile';
  onSelectFrontTab: (tab: 'home' | 'orders' | 'profile') => void;
  backTab: string;
  onSelectBackTab: (tab: string) => void;
  onOpenAnalysis: () => void;
  onOpenAuth: () => void;
  activeOrdersCount: number;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  currentMode,
  onToggleMode,
  frontTab,
  onSelectFrontTab,
  backTab,
  onSelectBackTab,
  onOpenAnalysis,
  onOpenAuth,
  activeOrdersCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            基于 giteecode/homestayHotelPublic 架构还原
          </span>
          <span className="hidden md:inline text-stone-500">•</span>
          <span className="hidden md:inline text-stone-400">
            前后端分离架构 • 支持用户端预订、前台房态沙盘、续住退房与系统权限
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAnalysis}
            className="text-stone-300 hover:text-white flex items-center gap-1 text-[11px] bg-stone-800 hover:bg-stone-700 px-2.5 py-0.5 rounded-full transition-colors"
          >
            <BookOpen className="w-3 h-3 text-emerald-400" />
            项目架构与设计解析
          </button>

          <button
            onClick={() => onToggleMode(currentMode === 'front' ? 'back' : 'front')}
            className="text-emerald-300 hover:text-emerald-200 flex items-center gap-1 text-[11px] font-medium transition-colors"
          >
            <ArrowRightLeft className="w-3 h-3" />
            切至{currentMode === 'front' ? '【管理后台 PMS】' : '【前台游客预订端】'}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              if (currentMode === 'front') onSelectFrontTab('home');
              else onSelectBackTab('dashboard');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-lg tracking-tight">栖云美宿</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/60">
                  {currentMode === 'front' ? '前台预订端' : 'PMS 综合管理系统'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-none">Homestay & Hotel Management</p>
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {currentMode === 'front' ? (
            <>
              <button
                onClick={() => onSelectFrontTab('home')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  frontTab === 'home'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>民宿房源精选</span>
              </button>

              <button
                onClick={() => onSelectFrontTab('orders')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative ${
                  frontTab === 'orders'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>我的预订与订单</span>
                {activeOrdersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600 text-white font-bold">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectFrontTab('profile')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  frontTab === 'profile'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>个人中心</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectBackTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backTab === 'dashboard'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>控制台</span>
              </button>

              <button
                onClick={() => onSelectBackTab('rack')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backTab === 'rack'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>房态看板 (沙盘)</span>
              </button>

              <button
                onClick={() => onSelectBackTab('rooms')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backTab === 'rooms'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Hotel className="w-3.5 h-3.5" />
                <span>房源管理</span>
              </button>

              <button
                onClick={() => onSelectBackTab('checkin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backTab === 'checkin'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>业务办理 (入住/退房)</span>
              </button>

              <button
                onClick={() => onSelectBackTab('orders')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backTab === 'orders'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>订单汇总</span>
              </button>

              <button
                onClick={() => onSelectBackTab('finance')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backTab === 'finance'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>财务报表</span>
              </button>

              <button
                onClick={() => onSelectBackTab('system')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backTab === 'system'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>系统管理</span>
              </button>

              <button
                onClick={() => onSelectBackTab('files')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backTab === 'files'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>文件相册</span>
              </button>
            </>
          )}
        </nav>

        {/* User Account / Auth Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pl-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.realName}
              className="w-8 h-8 rounded-full object-cover border border-stone-200"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-stone-900 leading-tight flex items-center gap-1">
                {currentUser.realName}
              </div>
              <div className="text-[10px] text-stone-500 flex items-center gap-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                  currentUser.role === 'admin' ? 'bg-purple-500' : currentUser.role === 'staff' ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
                <span>{currentUser.role === 'admin' ? '超级管理员' : currentUser.role === 'staff' ? '前台接待主管' : '预订住客'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            title="登录 / 切换账号"
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">换账号</span>
          </button>
        </div>
      </div>
    </header>
  );
};
