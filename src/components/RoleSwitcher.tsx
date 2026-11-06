import React, { useState } from 'react';
import { store } from '../services/store';
import { User } from '../types';
import { 
  User as UserIcon, 
  ShieldCheck, 
  RotateCcw, 
  BookOpen, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

interface Props {
  currentUser: User;
  onOpenAnalysis: () => void;
  currentMode: 'front' | 'back';
  onToggleMode: (mode: 'front' | 'back') => void;
}

export const RoleSwitcher: React.FC<Props> = ({ 
  currentUser, 
  onOpenAnalysis, 
  currentMode, 
  onToggleMode 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleRoleSelect = (roleName: 'customer' | 'staff' | 'admin') => {
    store.switchRoleByRoleName(roleName);
    if (roleName === 'customer') {
      onToggleMode('front');
    } else {
      onToggleMode('back');
    }
    triggerToast(`已切换至：${roleName === 'admin' ? '👑 超级管理员' : roleName === 'staff' ? '🛎️ 前台主管/接待' : '👤 普通预订住客'}`);
  };

  const handleReset = () => {
    if (window.confirm('确定要重置体验数据为初始默认演示数据吗？')) {
      store.resetToDefault();
      triggerToast('✨ 数据已重置为初始演示状态！');
    }
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 text-white px-5 py-2.5 rounded-full text-xs font-medium shadow-xl backdrop-blur-md border border-stone-700/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {expanded && (
          <div className="mb-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/80 p-3 text-stone-800 text-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 font-medium text-stone-500">
              <span className="flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" /> 角色与门户一键切换
              </span>
              <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-500">DEMO</span>
            </div>

            <div className="space-y-1.5 py-2">
              <button
                onClick={() => handleRoleSelect('customer')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                  currentUser.role === 'customer' && currentMode === 'front'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    客
                  </div>
                  <div>
                    <div className="text-xs">普通住客 (C端预订)</div>
                    <div className="text-[10px] text-stone-400">账号: user / 123456</div>
                  </div>
                </div>
                {currentUser.role === 'customer' && currentMode === 'front' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                )}
              </button>

              <button
                onClick={() => handleRoleSelect('staff')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                  currentUser.role === 'staff' && currentMode === 'back'
                    ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    台
                  </div>
                  <div>
                    <div className="text-xs">前台接待 (业务办理)</div>
                    <div className="text-[10px] text-stone-400">账号: staff / 123456</div>
                  </div>
                </div>
                {currentUser.role === 'staff' && currentMode === 'back' && (
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                )}
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                  currentUser.role === 'admin' && currentMode === 'back'
                    ? 'bg-purple-50 text-purple-900 font-semibold border border-purple-200'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    管
                  </div>
                  <div>
                    <div className="text-xs">超级管理员 (系统全权限)</div>
                    <div className="text-[10px] text-stone-400">账号: admin / admin</div>
                  </div>
                </div>
                {currentUser.role === 'admin' && currentMode === 'back' && (
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-1.5">
              <button
                onClick={onOpenAnalysis}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" /> 架构解析导读
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-[11px] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 重置演示数据
              </button>
            </div>
          </div>
        )}

        {/* Floating trigger pill */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-900/95 hover:bg-stone-900 text-white text-xs font-medium shadow-xl hover:shadow-2xl border border-stone-700 transition-all active:scale-95 backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5">
            {currentUser.role === 'admin' ? (
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            ) : currentUser.role === 'staff' ? (
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            ) : (
              <UserIcon className="w-4 h-4 text-emerald-400" />
            )}
            <span className="font-semibold">
              {currentUser.role === 'admin'
                ? '管理员模式'
                : currentUser.role === 'staff'
                ? '前台接待模式'
                : '前台游客端'}
            </span>
          </div>

          <span className="text-stone-400 text-[11px]">|</span>
          <span className="text-stone-300">
            {currentMode === 'front' ? 'C端门户' : 'PMS后台'}
          </span>

          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>
      </div>
    </>
  );
};
