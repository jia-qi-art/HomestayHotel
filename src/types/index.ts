export type UserRole = 'customer' | 'staff' | 'admin';

export interface User {
  id: string;
  username: string;
  realName: string;
  phone: string;
  avatar: string;
  email?: string;
  role: UserRole;
  status: 'active' | 'disabled';
  createTime: string;
}

export type RoomStatus = 'available' | 'reserved' | 'occupied' | 'cleaning' | 'maintenance';

export type RoomType = '海景度假房' | '山林独栋木屋' | '庭院大床房' | '日式榻榻米' | '亲子家庭套房' | '轻奢复式Loft';

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  homestayName: string;
  roomType: RoomType;
  price: number;
  deposit: number;
  area: number; // 面积 m²
  bedType: string; // 如 "1张2.0米大床"
  maxGuests: number;
  floor: number;
  status: RoomStatus;
  weight: number; // 权重值，决定排序及Top6首页轮播
  coverImage: string;
  images: string[];
  tags: string[];
  amenities: string[];
  description: string;
  isOnShelf: boolean; // 是否上架
  rating: number;
  reviewCount: number;
  currentGuest?: {
    orderId: string;
    guestName: string;
    phone: string;
    checkInDate: string;
    checkOutDate: string;
    idCard?: string;
  };
}

export type OrderStatus = 'reserved' | 'occupied' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  roomId: string;
  roomNumber: string;
  roomName: string;
  homestayName: string;
  roomType: RoomType;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerIdCard: string;
  checkInDate: string;
  checkOutDate: string;
  days: number;
  unitPrice: number;
  totalPrice: number;
  deposit: number;
  actualPaid: number;
  status: OrderStatus;
  createTime: string;
  payMethod: '微信支付' | '支付宝' | '现金' | '刷卡';
  remarks?: string;
  isReviewed?: boolean;
}

export interface Review {
  id: string;
  roomId: string;
  orderId: string;
  userId: string;
  userNameMasked: string; // 张**
  userAvatar: string;
  rating: number; // 1-5
  content: string;
  createTime: string;
  roomType: string;
}

export interface SysLog {
  id: string;
  username: string;
  role: string;
  action: string;
  ip: string;
  status: '成功' | '失败';
  createTime: string;
  details?: string;
}

export interface SysMenu {
  id: string;
  title: string;
  path: string;
  icon: string;
  roles: UserRole[];
  parentId?: string;
}

export interface FileItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadTime: string;
  roomId?: string;
}
