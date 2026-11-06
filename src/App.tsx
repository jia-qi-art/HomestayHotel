import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Navbar } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { ProjectAnalysisModal } from './components/ProjectAnalysisModal';
import { AuthModal } from './views/front/AuthModal';

// Front views
import { RoomListView } from './views/front/RoomListView';
import { MyOrdersView } from './views/front/MyOrdersView';
import { UserProfileView } from './views/front/UserProfileView';

// Back views (PMS)
import { DashboardView } from './views/admin/DashboardView';
import { RoomRackView } from './views/admin/RoomRackView';
import { RoomManagementView } from './views/admin/RoomManagementView';
import { FrontDeskBookingView } from './views/admin/FrontDeskBookingView';
import { OrderManagementView } from './views/admin/OrderManagementView';
import { FinancialView } from './views/admin/FinancialView';
import { SystemUsersView } from './views/admin/SystemUsersView';
import { SystemSettingsView } from './views/admin/SystemSettingsView';

import { 
  Hotel, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink,
  Heart,
  CalendarCheck,
  Compass,
  ArrowRightLeft
} from 'lucide-react';

export default function App() {
  const [, setTick] = useState(0);

  // View state
  const [currentMode, setCurrentMode] = useState<'front' | 'back'>('front');
  const [frontTab, setFrontTab] = useState<'home' | 'orders' | 'profile'>('home');
  const [backTab, setBackTab] = useState<string>('dashboard');

  // Modals
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Subscribe to store updates
  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  const rooms = store.getRooms();
  const orders = store.getOrders();
  const users = store.getUsers();
  const logs = store.getLogs();
  const menus = store.getMenus();
  const files = store.getFiles();
  const currentUser = store.getCurrentUser();

  const activeOrdersCount = orders.filter(
    o => (o.userId === currentUser.id || o.customerPhone === currentUser.phone) && 
         (o.status === 'reserved' || o.status === 'occupied')
  ).length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Dual Portal Responsive Navbar */}
      <Navbar
        currentUser={currentUser}
        currentMode={currentMode}
        onToggleMode={setCurrentMode}
        frontTab={frontTab}
        onSelectFrontTab={setFrontTab}
        backTab={backTab}
        onSelectBackTab={setBackTab}
        onOpenAnalysis={() => setIsAnalysisOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20">
        
        {/* Render Front-End Customer Portal */}
        {currentMode === 'front' && (
          <div>
            {frontTab === 'home' && (
              <RoomListView
                rooms={rooms}
                onBookSuccess={() => {
                  setFrontTab('orders');
                }}
              />
            )}

            {frontTab === 'orders' && (
              <MyOrdersView
                orders={orders}
                onRefresh={() => setTick(t => t + 1)}
              />
            )}

            {frontTab === 'profile' && (
              <UserProfileView
                currentUser={currentUser}
                onUserUpdated={() => setTick(t => t + 1)}
              />
            )}
          </div>
        )}

        {/* Render Back-End Management Portal (PMS) */}
        {currentMode === 'back' && (
          <div className="space-y-6">
            {/* Admin Subheader Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                <span>管理系统 (PMS)</span>
                <span>/</span>
                <span className="text-stone-900 font-bold">
                  {backTab === 'dashboard' && '控制台 (Dashboard)'}
                  {backTab === 'rack' && '客房沙盘看板 (Room Rack)'}
                  {backTab === 'rooms' && '房源参数与上下架 (HRoom)'}
                  {backTab === 'checkin' && '前台预订与入住办理 (HOrderSubscribe)'}
                  {backTab === 'orders' && '订单汇总台账 (HOrder)'}
                  {backTab === 'finance' && '财务统计报表 (HOrderECharts)'}
                  {backTab === 'system' && '用户管理 (SysUser)'}
                  {backTab === 'files' && '文件与相册 (SysFile)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400">
                  当前操作员: <strong className="text-stone-700">{currentUser.realName}</strong> ({currentUser.role === 'admin' ? '管理员' : '前台主管'})
                </span>
              </div>
            </div>

            {/* Back View Content */}
            {backTab === 'dashboard' && (
              <DashboardView
                rooms={rooms}
                orders={orders}
                users={users}
                logs={logs}
                onNavigateTab={setBackTab}
              />
            )}

            {backTab === 'rack' && (
              <RoomRackView
                rooms={rooms}
                onRefresh={() => setTick(t => t + 1)}
              />
            )}

            {backTab === 'rooms' && (
              <RoomManagementView
                rooms={rooms}
                onRefresh={() => setTick(t => t + 1)}
              />
            )}

            {backTab === 'checkin' && (
              <FrontDeskBookingView
                rooms={rooms}
                orders={orders}
                onRefresh={() => setTick(t => t + 1)}
              />
            )}

            {backTab === 'orders' && (
              <OrderManagementView
                orders={orders}
                onRefresh={() => setTick(t => t + 1)}
              />
            )}

            {backTab === 'finance' && (
              <FinancialView
                orders={orders}
                rooms={rooms}
              />
            )}

            {backTab === 'system' && (
              <div className="space-y-8">
                <SystemUsersView
                  users={users}
                  onRefresh={() => setTick(t => t + 1)}
                />
                <SystemSettingsView
                  logs={logs}
                  menus={menus}
                  files={files}
                  onRefresh={() => setTick(t => t + 1)}
                />
              </div>
            )}

            {backTab === 'files' && (
              <SystemSettingsView
                logs={logs}
                menus={menus}
                files={files}
                onRefresh={() => setTick(t => t + 1)}
              />
            )}
          </div>
        )}

      </main>

      {/* Global Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <Hotel className="w-4 h-4 text-emerald-400" />
              <span>栖云美宿 · 民宿酒店预订管理系统</span>
            </div>
            <p className="text-stone-400 text-[11px]">
              深度还原开源项目 <a href="https://github.com/giteecode/homestayHotelPublic" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">giteecode/homestayHotelPublic</a> 的业务闭环与技术架构
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setIsAnalysisOpen(true)}
              className="text-stone-300 hover:text-white flex items-center gap-1.5 bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>查看源码架构分析</span>
            </button>
            <button
              onClick={() => setCurrentMode(currentMode === 'front' ? 'back' : 'front')}
              className="text-stone-300 hover:text-white flex items-center gap-1.5 bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>切换至{currentMode === 'front' ? '管理后台' : '前台预订'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Quick Role & Mode Floating Switcher */}
      <RoleSwitcher
        currentUser={currentUser}
        onOpenAnalysis={() => setIsAnalysisOpen(true)}
        currentMode={currentMode}
        onToggleMode={setCurrentMode}
      />

      {/* Project Source Code & Architecture Modal */}
      <ProjectAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
      />

      {/* Auth Modal (Login / Register / Switch Account) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setTick(t => t + 1)}
      />

    </div>
  );
}
