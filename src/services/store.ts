import { Room, Order, User, Review, SysLog, SysMenu, FileItem, UserRole, RoomStatus } from '../types';
import { INITIAL_ROOMS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_REVIEWS, INITIAL_LOGS, INITIAL_MENUS, INITIAL_FILES } from '../data/mockData';

const STORAGE_KEYS = {
  ROOMS: 'homestay_rooms_v1',
  ORDERS: 'homestay_orders_v1',
  USERS: 'homestay_users_v1',
  REVIEWS: 'homestay_reviews_v1',
  LOGS: 'homestay_logs_v1',
  MENUS: 'homestay_menus_v1',
  FILES: 'homestay_files_v1',
  CURRENT_USER: 'homestay_curr_user_v1',
};

class Store {
  private rooms: Room[] = [];
  private orders: Order[] = [];
  private users: User[] = [];
  private reviews: Review[] = [];
  private logs: SysLog[] = [];
  private menus: SysMenu[] = [];
  private files: FileItem[] = [];
  private currentUser: User = INITIAL_USERS[2]; // Default to customer 'user'
  private listeners: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
      this.rooms = storedRooms ? JSON.parse(storedRooms) : INITIAL_ROOMS;

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS;

      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      this.reviews = storedReviews ? JSON.parse(storedReviews) : INITIAL_REVIEWS;

      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      this.logs = storedLogs ? JSON.parse(storedLogs) : INITIAL_LOGS;

      const storedMenus = localStorage.getItem(STORAGE_KEYS.MENUS);
      this.menus = storedMenus ? JSON.parse(storedMenus) : INITIAL_MENUS;

      const storedFiles = localStorage.getItem(STORAGE_KEYS.FILES);
      this.files = storedFiles ? JSON.parse(storedFiles) : INITIAL_FILES;

      const storedCurrUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedCurrUser) {
        this.currentUser = JSON.parse(storedCurrUser);
      } else {
        this.currentUser = this.users.find(u => u.username === 'user') || this.users[0];
      }
    } catch {
      this.rooms = INITIAL_ROOMS;
      this.orders = INITIAL_ORDERS;
      this.users = INITIAL_USERS;
      this.reviews = INITIAL_REVIEWS;
      this.logs = INITIAL_LOGS;
      this.menus = INITIAL_MENUS;
      this.files = INITIAL_FILES;
      this.currentUser = INITIAL_USERS[2];
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(this.rooms));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(this.reviews));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(this.files));
    } catch {
      // ignore quota errors
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Getters
  public getRooms(): Room[] {
    return [...this.rooms];
  }

  public getRoomById(id: string): Room | undefined {
    return this.rooms.find(r => r.id === id);
  }

  public getOrders(): Order[] {
    return [...this.orders];
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public getReviews(): Review[] {
    return [...this.reviews];
  }

  public getLogs(): SysLog[] {
    return [...this.logs];
  }

  public getMenus(): SysMenu[] {
    return [...this.menus];
  }

  public getFiles(): FileItem[] {
    return [...this.files];
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }

  // Auth & Roles
  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.addLog({
      username: user.username,
      role: user.role === 'admin' ? '系统管理员' : user.role === 'staff' ? '前台员工' : '普通用户',
      action: '角色会话切换',
      ip: '127.0.0.1',
      status: '成功',
      details: `切换到账号 [${user.username}] - ${user.realName}`,
    });
    this.persist();
  }

  public switchRoleByRoleName(role: UserRole) {
    const target = this.users.find(u => u.role === role);
    if (target) {
      this.setCurrentUser(target);
    }
  }

  public login(username: string, _password?: string): { success: boolean; message: string; user?: User } {
    const user = this.users.find(u => u.username === username);
    if (!user) {
      return { success: false, message: '账号不存在，请检查或先注册' };
    }
    if (user.status === 'disabled') {
      return { success: false, message: '该账号已被系统禁用，请联系管理员' };
    }
    this.currentUser = user;
    this.addLog({
      username: user.username,
      role: user.role === 'admin' ? '管理员' : user.role === 'staff' ? '前台员工' : '普通用户',
      action: '用户登录',
      ip: '127.0.0.1',
      status: '成功',
      details: `登录成功，角色：${user.role}`,
    });
    this.persist();
    return { success: true, message: '登录成功', user };
  }

  public register(data: { username: string; realName: string; phone: string }): { success: boolean; message: string; user?: User } {
    if (this.users.some(u => u.username === data.username)) {
      return { success: false, message: '该用户名已存在，请更换后重试' };
    }
    const newUser: User = {
      id: `u-${Date.now()}`,
      username: data.username,
      realName: data.realName,
      phone: data.phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'customer',
      status: 'active',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    this.users.push(newUser);
    this.currentUser = newUser;
    this.addLog({
      username: newUser.username,
      role: '普通用户',
      action: '用户注册',
      ip: '127.0.0.1',
      status: '成功',
      details: `新用户注册: ${data.username}`,
    });
    this.persist();
    return { success: true, message: '注册成功，已自动登录', user: newUser };
  }

  public updateUserProfile(updated: Partial<User>) {
    this.users = this.users.map(u => (u.id === this.currentUser.id ? { ...u, ...updated } : u));
    this.currentUser = { ...this.currentUser, ...updated };
    this.addLog({
      username: this.currentUser.username,
      role: this.currentUser.role,
      action: '修改个人信息',
      ip: '127.0.0.1',
      status: '成功',
      details: '更新了个人基本资料',
    });
    this.persist();
  }

  // Booking Flow
  public createBooking(params: {
    roomId: string;
    customerName: string;
    customerPhone: string;
    customerIdCard?: string;
    checkInDate: string;
    checkOutDate: string;
    days: number;
    remarks?: string;
    payMethod?: '微信支付' | '支付宝' | '现金' | '刷卡';
    isDirectCheckIn?: boolean;
  }): { success: boolean; order?: Order; message: string } {
    const room = this.rooms.find(r => r.id === params.roomId);
    if (!room) {
      return { success: false, message: '房间不存在' };
    }
    if (room.status !== 'available') {
      return { success: false, message: `客房当前状态为 [${room.status === 'occupied' ? '已入住' : room.status === 'reserved' ? '已预订' : '维护中'}]，无法办理` };
    }

    const totalPrice = room.price * params.days;
    const actualPaid = totalPrice + room.deposit;
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const orderNumber = `HS${Date.now().toString().slice(-10)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomName: room.name,
      homestayName: room.homestayName,
      roomType: room.roomType,
      userId: this.currentUser.id,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerIdCard: params.customerIdCard || '330106199401011234',
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      days: params.days,
      unitPrice: room.price,
      totalPrice,
      deposit: room.deposit,
      actualPaid,
      status: params.isDirectCheckIn ? 'occupied' : 'reserved',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      payMethod: params.payMethod || '微信支付',
      remarks: params.remarks,
      isReviewed: false,
    };

    // Update Room
    room.status = params.isDirectCheckIn ? 'occupied' : 'reserved';
    room.currentGuest = {
      orderId,
      guestName: params.customerName,
      phone: params.customerPhone,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      idCard: params.customerIdCard,
    };

    this.orders.unshift(newOrder);

    this.addLog({
      username: this.currentUser.username,
      role: this.currentUser.role,
      action: params.isDirectCheckIn ? '前台直接入住' : '民宿预订下单',
      ip: '127.0.0.1',
      status: '成功',
      details: `${params.isDirectCheckIn ? '为' : '预订'}房间 ${room.roomNumber} - ${params.customerName} (${params.days}晚，¥${actualPaid})`,
    });

    this.persist();
    return { success: true, order: newOrder, message: params.isDirectCheckIn ? '入住登记成功' : '预订成功！订单已生成' };
  }

  // Front Desk Check-in (transfer from 'reserved' to 'occupied')
  public checkInReservedOrder(orderId: string, idCard?: string): { success: boolean; message: string } {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: '订单未找到' };

    const room = this.rooms.find(r => r.id === order.roomId);
    if (!room) return { success: false, message: '对应客房不存在' };

    order.status = 'occupied';
    if (idCard) order.customerIdCard = idCard;

    room.status = 'occupied';
    room.currentGuest = {
      orderId: order.id,
      guestName: order.customerName,
      phone: order.customerPhone,
      checkInDate: order.checkInDate,
      checkOutDate: order.checkOutDate,
      idCard: order.customerIdCard,
    };

    this.addLog({
      username: this.currentUser.username,
      role: '前台接待',
      action: '办理预订核验入住',
      ip: '127.0.0.1',
      status: '成功',
      details: `为订单 ${order.orderNumber} (房号 ${room.roomNumber}) 办理核验入住`,
    });

    this.persist();
    return { success: true, message: `客房 ${room.roomNumber} 入住登记已完成！` };
  }

  // Extend Stay
  public extendStay(orderId: string, additionalDays: number): { success: boolean; message: string } {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: '订单未找到' };

    const room = this.rooms.find(r => r.id === order.roomId);
    if (!room) return { success: false, message: '客房未找到' };

    const addedPrice = order.unitPrice * additionalDays;
    order.days += additionalDays;
    order.totalPrice += addedPrice;
    order.actualPaid += addedPrice;

    // Advance checkout date by additionalDays
    const currentOut = new Date(order.checkOutDate);
    currentOut.setDate(currentOut.getDate() + additionalDays);
    const newOutDate = currentOut.toISOString().split('T')[0];
    order.checkOutDate = newOutDate;

    if (room.currentGuest) {
      room.currentGuest.checkOutDate = newOutDate;
    }

    this.addLog({
      username: this.currentUser.username,
      role: '前台接待',
      action: '办理续住手续',
      ip: '127.0.0.1',
      status: '成功',
      details: `房号 ${room.roomNumber} 续住 ${additionalDays} 晚，离店延至 ${newOutDate}，补收 ¥${addedPrice}`,
    });

    this.persist();
    return { success: true, message: `续住办理成功！延住 ${additionalDays} 天，总共至 ${newOutDate}` };
  }

  // Check-out & Settle
  public checkoutOrder(orderId: string, setRoomCleaning: boolean = true): { success: boolean; message: string } {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: '订单未找到' };

    const room = this.rooms.find(r => r.id === order.roomId);
    order.status = 'completed';

    if (room) {
      room.status = setRoomCleaning ? 'cleaning' : 'available';
      room.currentGuest = undefined;
    }

    this.addLog({
      username: this.currentUser.username,
      role: '前台接待',
      action: '办理退房结账',
      ip: '127.0.0.1',
      status: '成功',
      details: `房号 ${order.roomNumber} 已退房，结算退还押金 ¥${order.deposit}，客房变更为 [${setRoomCleaning ? '打扫中' : '空闲'}]`,
    });

    this.persist();
    return { success: true, message: `退房结账成功！已结清退还押金 ¥${order.deposit}，房态已变为 ${setRoomCleaning ? '打扫中' : '空闲'}` };
  }

  // Finish cleaning room
  public finishCleaning(roomId: string) {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.status = 'available';
      this.addLog({
        username: this.currentUser.username,
        role: '前台/保洁',
        action: '完成房间保洁',
        ip: '127.0.0.1',
        status: '成功',
        details: `房号 ${room.roomNumber} 卫生打扫完毕，恢复为可入住空闲状态`,
      });
      this.persist();
    }
  }

  // Cancel order
  public cancelOrder(orderId: string, reason?: string): { success: boolean; message: string } {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: '订单未找到' };
    if (order.status !== 'reserved') {
      return { success: false, message: '仅待入住/已预订状态的订单允许取消' };
    }

    order.status = 'cancelled';
    const room = this.rooms.find(r => r.id === order.roomId);
    if (room && room.status === 'reserved') {
      room.status = 'available';
      room.currentGuest = undefined;
    }

    this.addLog({
      username: this.currentUser.username,
      role: this.currentUser.role,
      action: '取消预订订单',
      ip: '127.0.0.1',
      status: '成功',
      details: `取消订单 ${order.orderNumber} (房号 ${order.roomNumber})，原因: ${reason || '用户主动取消'}`,
    });

    this.persist();
    return { success: true, message: '预订已取消，款项与押金已原路返还' };
  }

  // Rating & Review (评分将直接加给房间权重值 weight)
  public submitReview(orderId: string, rating: number, content: string): { success: boolean; message: string } {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: '未找到对应订单' };
    if (order.isReviewed) return { success: false, message: '该订单已经评价过了' };

    const room = this.rooms.find(r => r.id === order.roomId);
    if (!room) return { success: false, message: '房源不存在' };

    const maskedName = order.customerName.length > 1
      ? order.customerName[0] + '**'
      : order.customerName + '*';

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      roomId: room.id,
      orderId: order.id,
      userId: this.currentUser.id,
      userNameMasked: maskedName,
      userAvatar: this.currentUser.avatar,
      rating,
      content,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      roomType: room.roomType,
    };

    this.reviews.unshift(newRev);
    order.isReviewed = true;

    // Update room rating and WEIGHT!
    // Project spec: "评分将直接加给房间权重值"
    const oldTotalScore = room.rating * room.reviewCount;
    room.reviewCount += 1;
    room.rating = Number(((oldTotalScore + rating) / room.reviewCount).toFixed(2));
    room.weight = Math.min(100, Math.round(room.weight + rating)); // Rating adds directly to weight!

    this.addLog({
      username: this.currentUser.username,
      role: '普通用户',
      action: '发表房源评价',
      ip: '127.0.0.1',
      status: '成功',
      details: `为房号 ${room.roomNumber} 给出 ${rating} 星好评，评价内容已收录，房间权重值提升 +${rating} (当前 ${room.weight})`,
    });

    this.persist();
    return { success: true, message: `评价成功！房间权重值已根据您的 ${rating} 星评分提升至 ${room.weight}` };
  }

  // Room Management (Admin)
  public saveRoom(roomData: Partial<Room>): { success: boolean; message: string; room?: Room } {
    if (roomData.id) {
      const idx = this.rooms.findIndex(r => r.id === roomData.id);
      if (idx !== -1) {
        this.rooms[idx] = { ...this.rooms[idx], ...roomData } as Room;
        this.addLog({
          username: this.currentUser.username,
          role: '管理员',
          action: '编辑房源信息',
          ip: '127.0.0.1',
          status: '成功',
          details: `修改房号 ${this.rooms[idx].roomNumber} 参数及描述`,
        });
        this.persist();
        return { success: true, message: '房源修改成功', room: this.rooms[idx] };
      }
    }

    // New room
    const newRoom: Room = {
      id: `room-${Date.now().toString().slice(-6)}`,
      roomNumber: roomData.roomNumber || `${this.rooms.length + 101}`,
      name: roomData.name || '全新雅致精品客房',
      homestayName: roomData.homestayName || '栖云山居民宿',
      roomType: roomData.roomType || '庭院大床房',
      price: Number(roomData.price) || 580,
      deposit: Number(roomData.deposit) || 300,
      area: Number(roomData.area) || 50,
      bedType: roomData.bedType || '1张1.8米大床',
      maxGuests: Number(roomData.maxGuests) || 2,
      floor: Number(roomData.floor) || 1,
      status: 'available',
      weight: Number(roomData.weight) || 80,
      coverImage: roomData.coverImage || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      images: roomData.images && roomData.images.length > 0 ? roomData.images : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
      tags: roomData.tags || ['阳光露台', '高速WiFi'],
      amenities: roomData.amenities || ['高速WiFi', '独立卫浴', '空调', '电吹风'],
      description: roomData.description || '舒适宜人的客房环境，让您感受宾至如归的温馨体验。',
      isOnShelf: roomData.isOnShelf ?? true,
      rating: 5.0,
      reviewCount: 0,
    };

    this.rooms.push(newRoom);
    this.addLog({
      username: this.currentUser.username,
      role: '管理员',
      action: '新增房源',
      ip: '127.0.0.1',
      status: '成功',
      details: `新建客房 ${newRoom.roomNumber} - ${newRoom.name}`,
    });
    this.persist();
    return { success: true, message: '房源创建成功！', room: newRoom };
  }

  public toggleRoomShelf(roomId: string) {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.isOnShelf = !room.isOnShelf;
      this.addLog({
        username: this.currentUser.username,
        role: '管理员',
        action: '上下架变更',
        ip: '127.0.0.1',
        status: '成功',
        details: `房号 ${room.roomNumber} 变更为 [${room.isOnShelf ? '已上架' : '已下架'}]`,
      });
      this.persist();
    }
  }

  public deleteRoom(roomId: string): { success: boolean; message: string } {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return { success: false, message: '房源不存在' };
    if (room.status === 'occupied' || room.status === 'reserved') {
      return { success: false, message: '客房处于预订或入住状态，无法直接删除！请先办理退房或取消' };
    }
    this.rooms = this.rooms.filter(r => r.id !== roomId);
    this.addLog({
      username: this.currentUser.username,
      role: '管理员',
      action: '删除房源',
      ip: '127.0.0.1',
      status: '成功',
      details: `已移除房源 ${room.roomNumber} - ${room.name}`,
    });
    this.persist();
    return { success: true, message: '房源已成功删除' };
  }

  public setRoomStatus(roomId: string, status: RoomStatus) {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.status = status;
      this.addLog({
        username: this.currentUser.username,
        role: this.currentUser.role,
        action: '手动调整房态',
        ip: '127.0.0.1',
        status: '成功',
        details: `房号 ${room.roomNumber} 房态调整为 ${status}`,
      });
      this.persist();
    }
  }

  // User Management (Admin)
  public saveUser(userData: Partial<User>): { success: boolean; message: string } {
    if (userData.id) {
      this.users = this.users.map(u => (u.id === userData.id ? ({ ...u, ...userData } as User) : u));
    } else {
      const newUser: User = {
        id: `u-${Date.now()}`,
        username: userData.username || `user_${Math.floor(Math.random() * 9000 + 1000)}`,
        realName: userData.realName || '新员工',
        phone: userData.phone || '13800000000',
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: userData.role || 'staff',
        status: userData.status || 'active',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      this.users.push(newUser);
    }
    this.persist();
    return { success: true, message: '用户信息保存成功' };
  }

  public toggleUserStatus(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'active' ? 'disabled' : 'active';
      this.persist();
    }
  }

  public deleteUser(userId: string) {
    if (userId === this.currentUser.id) return;
    this.users = this.users.filter(u => u.id !== userId);
    this.persist();
  }

  // Delete file
  public deleteFile(fileId: string) {
    this.files = this.files.filter(f => f.id !== fileId);
    this.persist();
  }

  public addFile(file: Partial<FileItem>) {
    const newFile: FileItem = {
      id: `f-${Date.now()}`,
      name: file.name || 'uploaded_image.jpg',
      url: file.url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      size: file.size || '1.8 MB',
      type: file.type || 'image/jpeg',
      uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      roomId: file.roomId,
    };
    this.files.unshift(newFile);
    this.persist();
    return newFile;
  }

  // Log
  public addLog(log: Omit<SysLog, 'id' | 'createTime'>) {
    const newLog: SysLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...log,
    };
    this.logs.unshift(newLog);
    if (this.logs.length > 80) {
      this.logs.pop();
    }
  }

  // Reset to initial demo data
  public resetToDefault() {
    this.rooms = JSON.parse(JSON.stringify(INITIAL_ROOMS));
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.reviews = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
    this.logs = JSON.parse(JSON.stringify(INITIAL_LOGS));
    this.menus = JSON.parse(JSON.stringify(INITIAL_MENUS));
    this.files = JSON.parse(JSON.stringify(INITIAL_FILES));
    this.currentUser = this.users.find(u => u.username === 'user') || this.users[0];
    this.persist();
  }
}

export const store = new Store();
