import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { store } from '../../services/store';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  Lock, 
  X,
  Mail,
  Phone
} from 'lucide-react';

interface Props {
  users: User[];
  onRefresh: () => void;
}

export const SystemUsersView: React.FC<Props> = ({ users, onRefresh }) => {
  const currentUser = store.getCurrentUser();
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'staff' | 'customer'>('all');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newRealName, setNewRealName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('staff');

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.username.toLowerCase().includes(q) ||
        u.realName.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newRealName.trim() || !newPhone.trim()) {
      alert('请完整填写新账号信息');
      return;
    }

    const res = store.saveUser({
      username: newUsername.trim(),
      realName: newRealName.trim(),
      phone: newPhone.trim(),
      role: newRole,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });

    if (res.success) {
      alert(res.message);
      setIsAddModalOpen(false);
      setNewUsername('');
      setNewRealName('');
      setNewPhone('');
      onRefresh();
    }
  };

  const handleToggleStatus = (userId: string) => {
    if (userId === currentUser.id) {
      alert('无法禁用当前登录的账号');
      return;
    }
    store.toggleUserStatus(userId);
    onRefresh();
  };

  const handleDelete = (userId: string) => {
    if (userId === currentUser.id) {
      alert('无法删除当前自己的登录账号');
      return;
    }
    if (window.confirm('确认删除此账号吗？')) {
      store.deleteUser(userId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>系统用户分类管理 (SysUser / HUser)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            统一维护超级管理员 (Admin)、前台接待人员 (Staff) 与注册散客会员 (Customer)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>添加后台员工账号</span>
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl overflow-x-auto">
          {[
            { key: 'all', label: '全部用户', count: users.length },
            { key: 'admin', label: '管理员 (Admin)', count: users.filter(u => u.role === 'admin').length },
            { key: 'staff', label: '前台接待 (Staff)', count: users.filter(u => u.role === 'staff').length },
            { key: 'customer', label: '前台注册住客 (Customer)', count: users.filter(u => u.role === 'customer').length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                roleFilter === tab.key
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="flex items-center relative min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索账号名、姓名、手机号..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none text-xs"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <th className="p-4">用户头像 / 账号</th>
                <th className="p-4">真实姓名</th>
                <th className="p-4">所属系统角色</th>
                <th className="p-4">手机号码</th>
                <th className="p-4">账号状态</th>
                <th className="p-4">注册创建时间</th>
                <th className="p-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map(user => {
                const isAdmin = user.role === 'admin';
                const isStaff = user.role === 'staff';
                const isSelf = user.id === currentUser.id;

                return (
                  <tr key={user.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.realName}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <span className="font-mono font-bold text-stone-900 block">
                            {user.username} {isSelf && <span className="text-[10px] text-emerald-600 font-normal">(当前账号)</span>}
                          </span>
                          <span className="text-[10px] text-stone-400">{user.email || '未填邮箱'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-stone-800">
                      {user.realName}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : isStaff
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isAdmin && '👑 超级管理员'}
                        {isStaff && '🛎️ 前台主管/员工'}
                        {user.role === 'customer' && '👤 注册预订住客'}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-stone-700">
                      {user.phone}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={isSelf}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        } ${isSelf ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-80'}`}
                      >
                        {user.status === 'active' ? '正常启用' : '已冻结禁用'}
                      </button>
                    </td>

                    <td className="p-4 text-stone-400 text-[11px]">
                      {user.createTime}
                    </td>

                    <td className="p-4 text-right">
                      {!isSelf && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="删除账号"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">添加新后台员工</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-stone-600 font-medium mb-1">登录账号名</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="如: frontdesk_01"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">员工真实姓名</label>
                <input
                  type="text"
                  required
                  value={newRealName}
                  onChange={e => setNewRealName(e.target.value)}
                  placeholder="如: 陈晓琳"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">联系手机号</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="13800000000"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">分配权限角色</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none font-semibold"
                >
                  <option value="staff">前台接待人员 (可办理排房、入住与退房)</option>
                  <option value="admin">系统管理员 (全系统配置与财务权限)</option>
                  <option value="customer">普通住客账号</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  确认创建账号
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
