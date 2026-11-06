import React, { useState } from 'react';
import { SysLog, SysMenu, FileItem, UserRole } from '../../types';
import { store } from '../../services/store';
import { 
  ShieldCheck, 
  Menu, 
  History, 
  FolderTree, 
  Lock, 
  Check, 
  Trash2, 
  Upload, 
  Sparkles,
  ExternalLink,
  Layers,
  FileImage
} from 'lucide-react';

interface Props {
  logs: SysLog[];
  menus: SysMenu[];
  files: FileItem[];
  onRefresh: () => void;
}

export const SystemSettingsView: React.FC<Props> = ({ logs, menus, files, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'roles' | 'menus' | 'logs' | 'files'>('roles');

  // Role permissions simulation
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState<UserRole>('staff');

  // New file upload state
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !newFileUrl.trim()) {
      alert('请填写文件名与图片URL');
      return;
    }

    store.addFile({
      name: newFileName.trim(),
      url: newFileUrl.trim(),
      size: '2.1 MB',
      type: 'image/jpeg',
    });

    setNewFileName('');
    setNewFileUrl('');
    alert('房源实景图已加入相册文件库！');
    onRefresh();
  };

  const handleDeleteFile = (id: string) => {
    if (window.confirm('确认删除该文件吗？')) {
      store.deleteFile(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>系统设置与基础运维 (SysSettings)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            包含角色权限分配 (sys_role)、动态菜单树 (sys_menu)、全链路审计日志 (sys_log) 与房源相册文件库 (sys_file)
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex bg-stone-100 p-1 rounded-2xl text-xs overflow-x-auto">
          {[
            { key: 'roles', label: '角色权限绑定 (SysRole)' },
            { key: 'menus', label: '菜单路由树 (SysMenu)' },
            { key: 'logs', label: '系统日志审计 (SysLog)' },
            { key: 'files', label: '房源图片相册 (SysFile)' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveSubTab(t.key as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeSubTab === t.key
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subtab 1: Role Permissions (RBAC) */}
      {activeSubTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">选择系统角色</h3>
            <p className="text-xs text-stone-400">选择角色后可查看或指定该角色被授权访问的后台菜单</p>

            <div className="space-y-2 pt-2">
              {[
                { key: 'admin', label: '超级管理员 (Admin)', desc: '拥有系统全部功能与菜单配置权限' },
                { key: 'staff', label: '前台接待员工 (Staff)', desc: '负责客房沙盘、直接入住、续住与退房' },
                { key: 'customer', label: '前台注册住客 (Customer)', desc: '仅开放前台房源浏览、下单与个人订单' },
              ].map(r => (
                <button
                  key={r.key}
                  onClick={() => setSelectedRoleForPerms(r.key as any)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    selectedRoleForPerms === r.key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="text-xs">{r.label}</div>
                  <div className="text-[10px] text-stone-500 font-normal mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">
                分配可访问的系统菜单 (绑定至: {selectedRoleForPerms})
              </h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                RBAC sys_role_menu
              </span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {menus.map(menu => {
                const isPermitted = menu.roles.includes(selectedRoleForPerms);

                return (
                  <div key={menu.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isPermitted ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'
                      }`}>
                        {isPermitted ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </span>
                      <div>
                        <div className="font-semibold text-stone-800">{menu.title}</div>
                        <div className="font-mono text-[10px] text-stone-400">路由路径: {menu.path}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isPermitted ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-400'
                    }`}>
                      {isPermitted ? '已授权访问' : '无权访问'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Menu Management Tree */}
      {activeSubTab === 'menus' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">系统菜单配置表 (SysMenu)</h3>
            <span className="text-xs text-stone-400">对应原项目 Spring Boot sys_menu 表定义</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                  <th className="p-3">菜单标识</th>
                  <th className="p-3">菜单名称</th>
                  <th className="p-3">路由路径 (Path)</th>
                  <th className="p-3">Element / Lucide 图标</th>
                  <th className="p-3">允许角色列表</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {menus.map(m => (
                  <tr key={m.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-stone-900">{m.id}</td>
                    <td className="p-3 font-sans font-semibold text-stone-800">{m.title}</td>
                    <td className="p-3 text-emerald-700">{m.path}</td>
                    <td className="p-3 text-stone-500">{m.icon}</td>
                    <td className="p-3">
                      <div className="flex gap-1 font-sans">
                        {m.roles.map(r => (
                          <span key={r} className="px-1.5 py-0.2 rounded text-[10px] bg-stone-100 text-stone-700">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: System Logs */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              <span>操作与登录审计日志 (SysLog)</span>
            </h3>
            <span className="text-xs text-stone-400">实时记录近 {logs.length} 条关键操作</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                  <th className="p-3">操作人</th>
                  <th className="p-3">角色</th>
                  <th className="p-3">操作模块</th>
                  <th className="p-3">详细记录</th>
                  <th className="p-3">来源 IP</th>
                  <th className="p-3">状态</th>
                  <th className="p-3">记录时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-stone-900 font-mono">{log.username}</td>
                    <td className="p-3 text-stone-600">{log.role}</td>
                    <td className="p-3 font-semibold text-emerald-800">{log.action}</td>
                    <td className="p-3 text-stone-700 max-w-xs">{log.details}</td>
                    <td className="p-3 font-mono text-stone-400">{log.ip}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-stone-400 text-[11px]">{log.createTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 4: Files and Homestay Images */}
      {activeSubTab === 'files' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">上传新房源实景图片 (模拟上传到静态服务器)</h3>
            <form onSubmit={handleUploadFile} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                required
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                placeholder="图片名称，如: moganshan-terrace.jpg"
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
              <input
                type="text"
                required
                value={newFileUrl}
                onChange={e => setNewFileUrl(e.target.value)}
                placeholder="图片URL地址 (https://...)"
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
              <button
                type="submit"
                className="py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>确认入库上传</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">已归档房源相册文件 ({files.length} 个文件)</h3>
              <span className="text-xs text-stone-400">支持预览与批量清理</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {files.map(file => (
                <div
                  key={file.id}
                  className="group relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 aspect-square flex flex-col justify-between"
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-[10px]">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                        title="删除文件"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <div className="font-bold truncate">{file.name}</div>
                      <div className="text-stone-300">{file.size}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
