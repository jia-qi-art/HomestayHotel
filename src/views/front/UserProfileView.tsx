import React, { useState } from 'react';
import { User, SysLog } from '../../types';
import { store } from '../../services/store';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Phone, 
  Mail, 
  History, 
  Lock, 
  Save, 
  Sparkles,
  Camera,
  CheckCircle2
} from 'lucide-react';

interface Props {
  currentUser: User;
  onUserUpdated: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
];

export const UserProfileView: React.FC<Props> = ({ currentUser, onUserUpdated }) => {
  const [realName, setRealName] = useState(currentUser.realName);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateUserProfile({
      realName,
      phone,
      email,
      avatar,
    });
    showToast('个人资料已更新成功！');
    onUserUpdated();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('新密码长度不能少于 6 位');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致，请重新检查');
      return;
    }

    store.addLog({
      username: currentUser.username,
      role: currentUser.role,
      action: '修改账户密码',
      ip: '127.0.0.1',
      status: '成功',
      details: '自主完成账户安全密码修改',
    });

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('密码修改成功！');
  };

  // User logs
  const userLogs = store.getLogs().filter(l => l.username === currentUser.username).slice(0, 8);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={avatar}
            alt={realName}
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 shadow-md"
          />
          <span className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full shadow-xs">
            <Camera className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{realName}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {currentUser.role === 'admin' ? '系统管理员' : currentUser.role === 'staff' ? '前台接待主管' : '认证会员住客'}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            登录账号: <span className="font-mono text-stone-700">{currentUser.username}</span> • 注册时间: {currentUser.createTime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Edit Form */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-emerald-700" />
            <span>基本信息修改</span>
          </h2>

          {/* Select Avatar Preset */}
          <div>
            <label className="block text-xs text-stone-500 mb-2">快速选择常用头像</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(av)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                    avatar === av ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">真实姓名</label>
              <input
                type="text"
                value={realName}
                onChange={e => setRealName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">联系手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">电子邮箱</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourname@domain.com"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>保存基本信息</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>安全与密码修改</span>
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">原密码</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="输入当前密码 (演示环境可任意)"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">新密码</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="不少于6位密码"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">确认新密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>确认修改密码</span>
            </button>
          </form>
        </div>

      </div>

      {/* User Login & Action Logs */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-700" />
          <span>个人操作与登录历史</span>
        </h2>

        {userLogs.length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-xs">
            暂无日志记录
          </div>
        ) : (
          <div className="divide-y divide-stone-100 text-xs">
            {userLogs.map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-800">{log.action}</div>
                  <div className="text-[11px] text-stone-500">{log.details}</div>
                </div>
                <div className="text-right">
                  <div className="text-stone-400 text-[10px]">{log.createTime}</div>
                  <span className="text-[10px] text-emerald-600 font-medium">状态: {log.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
