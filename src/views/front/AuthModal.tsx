import React, { useState } from 'react';
import { store } from '../../services/store';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  User as UserIcon, 
  Lock, 
  Phone, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('user');
  const [loginPassword, setLoginPassword] = useState('123456');

  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regRealName, setRegRealName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = store.login(loginUsername, loginPassword);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regUsername.trim() || regUsername.length < 3) {
      setErrorMsg('用户名至少需要 3 个字符');
      return;
    }
    if (!regRealName.trim()) {
      setErrorMsg('请填写真实姓名');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 8) {
      setErrorMsg('请填写正确的手机号码');
      return;
    }

    const res = store.register({
      username: regUsername.trim(),
      realName: regRealName.trim(),
      phone: regPhone.trim(),
    });

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const fillQuickAccount = (username: string, pass: string) => {
    setLoginUsername(username);
    setLoginPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              {mode === 'login' ? '用户 / 管理员登录' : '新住客注册'}
            </h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-stone-100 p-1 rounded-2xl text-xs">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            登录账号
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              mode === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            注册新用户
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">用户名</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="请输入账号"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">登录密码</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              登 录
            </button>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[11px] text-stone-400 block mb-2 font-medium">一键填入演示账号测试：</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickAccount('user', '123456')}
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-left transition-colors"
                >
                  <div className="font-bold text-[11px]">普通住客</div>
                  <div className="text-[10px] text-emerald-600">user</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickAccount('staff', '123456')}
                  className="p-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 text-left transition-colors"
                >
                  <div className="font-bold text-[11px]">前台接待</div>
                  <div className="text-[10px] text-blue-600">staff</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickAccount('admin', 'admin')}
                  className="p-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-left transition-colors"
                >
                  <div className="font-bold text-[11px]">超级管理员</div>
                  <div className="text-[10px] text-purple-600">admin</div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">用户名 (登录账号)</label>
              <input
                type="text"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                placeholder="设置账号，如: lisi2024"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">真实姓名</label>
              <input
                type="text"
                value={regRealName}
                onChange={e => setRegRealName(e.target.value)}
                placeholder="入住人实名，如: 李四"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">联系手机号</label>
              <input
                type="tel"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                placeholder="13800000000"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">设置密码</label>
              <input
                type="password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                placeholder="不少于6位密码"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              注 册 并 登 录
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
