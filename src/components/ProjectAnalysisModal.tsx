import React, { useState } from 'react';
import { 
  BookOpen, 
  Database, 
  Layers, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  TrendingUp, 
  CalendarCheck, 
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectAnalysisModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'roles' | 'database' | 'eval'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 border border-white/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">项目深度解析：homestayHotelPublic</h2>
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">开源架构还原</span>
              </div>
              <p className="text-xs text-stone-300 mt-1 flex items-center gap-2">
                <span>原项目：giteecode/homestayHotelPublic</span>
                <span>•</span>
                <a 
                  href="https://github.com/giteecode/homestayHotelPublic" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 text-emerald-300 hover:underline"
                >
                  GitHub 仓库 <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 gap-2 pt-2">
          {[
            { key: 'overview', label: '项目概况', icon: Sparkles },
            { key: 'architecture', label: '前后端架构', icon: Layers },
            { key: 'roles', label: '三角色与业务闭环', icon: ShieldCheck },
            { key: 'database', label: '数据模型与算法', icon: Database },
            { key: 'eval', label: '技术亮点与优化建议', icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                  active
                    ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-700 text-sm leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900">
                <h3 className="font-semibold text-base mb-1">系统定位</h3>
                <p>
                  <strong>homestayHotelPublic</strong> 是一套专为<strong>中小型精品民宿、度假酒店及客栈</strong>打造的全栈式预约管理与前台收银排房系统（PMS）。
                  系统采用经典的<strong>前后端分离架构</strong>，同时覆盖<strong>C端游客线上选房预订</strong>与<strong>B端前台员工/管理员的客房沙盘排房与财务全局管控</strong>。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="text-emerald-700 font-semibold mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 游客端 (前台)
                  </div>
                  <ul className="text-xs space-y-1.5 text-stone-600">
                    <li>• 免密浏览房源 & 权重最高Top6轮播</li>
                    <li>• 多图详情、设施标配与真实住客脱敏评价</li>
                    <li>• 在线选房预订、押金与房费自动核算</li>
                    <li>• 个人订单管理、取消预订与评分反哺权重</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="text-teal-700 font-semibold mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 前台端 (业务办理)
                  </div>
                  <ul className="text-xs space-y-1.5 text-stone-600">
                    <li>• 房态看板 (空闲/预订/在住/打扫/维修)</li>
                    <li>• 散客到店直接入住办理 (身份证/押金)</li>
                    <li>• 线上预订订单核验转入住</li>
                    <li>• 在住客人续住延期 & 离店退房结账</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="text-indigo-700 font-semibold mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 管理员端 (系统全局)
                  </div>
                  <ul className="text-xs space-y-1.5 text-stone-600">
                    <li>• 房源增删改查、上下架与详情相册</li>
                    <li>• 经营数据大盘与近7日收入折线分析</li>
                    <li>• RBAC权限体系：用户/角色/动态菜单</li>
                    <li>• 全平台操作日志审计与文件批管</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl text-amber-900 text-xs">
                <strong>核心特色机制：</strong> 系统独创<strong>「房间权重排序与评价反哺体系」</strong>。系统根据房间的初始权重决定排名，首页轮播图直接自动挑选当前系统中<strong>权重最高的 6 间精选房</strong>；住客退房后发表的评价打分（1~5星）将直接增幅该房间的权重值，形成了正向经营口碑驱动机制！
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-900 text-base">技术栈分层解析</h3>
              
              <div className="space-y-3">
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                  <div className="flex items-center justify-between font-semibold text-stone-900 mb-2">
                    <span className="flex items-center gap-2 text-emerald-800">
                      <Code2 className="w-4 h-4" /> 后端服务 (Spring Boot)
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">JDK 1.8 + Maven 3.6</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <strong>Spring Boot:</strong> 简化微服务配置与内嵌 Tomcat 容器
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <strong>Spring MVC:</strong> RESTful API 设计与拦截器鉴权
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <strong>MyBatis-Plus:</strong> CRUD 增强与条件构造器分页
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <strong>MySQL 5.7+:</strong> 事务支持与数据持久化
                    </div>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                  <div className="flex items-center justify-between font-semibold text-stone-900 mb-2">
                    <span className="flex items-center gap-2 text-teal-800">
                      <Code2 className="w-4 h-4" /> 前端工程 (Vue 3 + TS)
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-teal-100 text-teal-800 rounded">Vue 3.x + Vite / Webpack</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <strong>Vue 3 Composition API:</strong> 响应式数据绑定
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <strong>Element Plus:</strong> 表单、表格与弹窗组件库
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <strong>Vue Router 4:</strong> 嵌套路由与动态菜单鉴权守卫
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <strong>Axios & Pinia/Vuex:</strong> 拦截器与用户状态全局管理
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-100 rounded-xl border border-stone-200">
                <h4 className="font-semibold text-xs text-stone-800 uppercase tracking-wider mb-2">交互时序与前后端通信模式</h4>
                <div className="font-mono text-xs bg-stone-900 text-stone-100 p-3 rounded-lg overflow-x-auto space-y-1">
                  <div>1. 客户端发起请求 -&gt; 请求头携带 Token (JWT)</div>
                  <div>2. 后端拦截器 (HandlerInterceptor) 核对用户身份与角色的 sys_menu 权限</div>
                  <div>3. Service 层处理业务事务 (如：生成订单 -&gt; 扣减/锁定客房空闲状态 -&gt; 记录操作日志)</div>
                  <div>4. 响应统一格式统一包装: <span className="text-emerald-400">Result.success(data)</span> 或 <span className="text-rose-400">Result.fail(msg)</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-900 text-base">三级角色权限与业务状态流转</h3>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl border-l-4 border-l-amber-500 bg-amber-50/50 border border-stone-200">
                  <h4 className="font-semibold text-amber-900">1. 普通游客 (Customer)</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    系统入口面向散客。支持自主注册与手机号查重；浏览民宿房源时按权重展示，可查看其他已入住住客的脱敏评价。预订下单无需管理员即时审批即可生成订单；离店后可针对订单给房间评价，直接增加房间权重。
                  </p>
                </div>

                <div className="p-4 rounded-xl border-l-4 border-l-blue-500 bg-blue-50/50 border border-stone-200">
                  <h4 className="font-semibold text-blue-900">2. 前台员工 (Reception / Staff)</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    聚焦<strong>日常前台接待与客房流转</strong>。核心功能包含：
                    <strong>「预订/入住办理」</strong>（办理散客一键入住登记并收取押金）；
                    <strong>「预订处理」</strong>（线上预订客人到店核验证件后一键办理入住）；
                    <strong>「在住管理」</strong>（为常住客办理续住补缴房费，退房时核算并退还押金，并把房态转为打扫中）。
                  </p>
                </div>

                <div className="p-4 rounded-xl border-l-4 border-l-purple-500 bg-purple-50/50 border border-stone-200">
                  <h4 className="font-semibold text-purple-900">3. 超级管理员 (Admin)</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    拥有系统的全量控制权。负责房源上下架、定价、上传高清实景图、管理系统员工与角色分配；可自由配置菜单树与角色关联，查看全局经营图表（今日入住率、近7天营业额走势），以及审计全平台的登录与操作日志。
                  </p>
                </div>
              </div>

              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                <h4 className="font-semibold text-stone-900 text-xs uppercase mb-2">客房生命周期与状态机</h4>
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-medium">空闲 (Available)</span>
                  <span>➜ (预订/入住) ➜</span>
                  <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 font-medium">预订中 (Reserved)</span>
                  <span>➜ (到店核验) ➜</span>
                  <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 font-medium">入住中 (Occupied)</span>
                  <span>➜ (办理退房) ➜</span>
                  <span className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 font-medium">保洁打扫中 (Cleaning)</span>
                  <span>➜ (保洁完成) ➜</span>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-medium">空闲 (Available)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-900 text-base">核心数据库表结构</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 text-sm">room (客房/房源表)</div>
                  <div className="text-stone-500">• id (主键 bigint)</div>
                  <div className="text-stone-500">• room_number (客房编号 varchar)</div>
                  <div className="text-stone-500">• name (房间标题 / 房型描述)</div>
                  <div className="text-stone-500">• price (日均单价 decimal)</div>
                  <div className="text-stone-500">• deposit (押金金额 decimal)</div>
                  <div className="text-stone-500">• status (空闲/已预订/已入住/打扫)</div>
                  <div className="text-emerald-600 font-semibold">• weight (权重值 int，用于首页Top6与排序)</div>
                  <div className="text-stone-500">• is_shelf (是否上架 0/1)</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 text-sm">orders (订单表)</div>
                  <div className="text-stone-500">• id / order_number (唯一流水号)</div>
                  <div className="text-stone-500">• room_id / room_number</div>
                  <div className="text-stone-500">• user_id / customer_name / phone</div>
                  <div className="text-stone-500">• check_in_date / check_out_date</div>
                  <div className="text-stone-500">• days (入住天数)</div>
                  <div className="text-stone-500">• total_price (总房费)</div>
                  <div className="text-stone-500">• deposit (押金)</div>
                  <div className="text-stone-500">• status (待入住/入住中/已完成/已取消)</div>
                  <div className="text-emerald-600 font-semibold">• is_reviewed (是否已评价 0/1)</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 text-sm">sys_user (用户表)</div>
                  <div className="text-stone-500">• id, username, password (加密存储)</div>
                  <div className="text-stone-500">• real_name, phone, avatar</div>
                  <div className="text-stone-500">• role (admin, staff, customer)</div>
                  <div className="text-stone-500">• status (0禁用, 1正常)</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 text-sm">RBAC 权限三件套</div>
                  <div className="text-stone-500">• sys_role (角色定义：管理员/前台员工)</div>
                  <div className="text-stone-500">• sys_menu (菜单路由、组件路径、图标)</div>
                  <div className="text-stone-500">• sys_role_menu (角色与菜单多对多绑定)</div>
                  <div className="text-stone-500">• sys_log (操作模块、IP、执行时间)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eval' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-900 text-base">项目技术亮点与现代化升级建议</h3>

              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="font-semibold text-emerald-900 mb-1">原项目三大优秀设计：</div>
                  <ul className="list-disc list-inside text-xs space-y-1 text-emerald-800">
                    <li><strong>业务贴近真实民宿场景：</strong>不是简单增删改查，包含了前台房态排房、押金结算、续住延期、退房清洁的真实闭环。</li>
                    <li><strong>评价驱动权重自增长算法：</strong>利用用户满意度星级动态提升房间权重，高频好评房间自动登上首页轮播。</li>
                    <li><strong>清晰的权限解耦：</strong>区分前台运营角色与后台系统管理，保证营业前台不会误改系统菜单或管理员账号。</li>
                  </ul>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">现代化生产级演进方向（本应用已增强实现）：</div>
                  <ul className="list-disc list-inside text-xs space-y-1 text-stone-600">
                    <li><strong>可视化房态看板 (Room Rack)：</strong>前台接待人员需要一目了然的楼层网格房态图，无需在列表中寻找空房。</li>
                    <li><strong>双门户无缝角色切换体验：</strong>在当前应用中可随时一键切换为普通游客、前台接待员或超级管理员，体验完整端到端链路。</li>
                    <li><strong>更完善的退房清洁流程：</strong>退房后自动触发房间保洁流转，保洁完成后一键恢复可订状态。</li>
                    <li><strong>财务明细图表增强：</strong>直观展示多房型营收占比、近7天营业额走势与客单价统计。</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            提示：您可以通过右上角或底部的角色切换按钮，在【游客预订端】、【前台接待业务端】和【超级管理后台】之间无缝切换体验。
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-xl transition-all shadow-xs"
          >
            开始体验系统
          </button>
        </div>

      </div>
    </div>
  );
};
