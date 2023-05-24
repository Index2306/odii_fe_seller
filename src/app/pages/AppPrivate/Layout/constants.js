import {
  dashboard,
  order,
  product,
  // warehouse,
  home,
  employee,
  cart,
  wallet,
  search,
  cskh,
  messenger,
  affiliate,
} from 'assets/images/icons';

import constants from 'assets/constants';
const { roles } = constants;

export const menus = [
  {
    name: 'Tổng quan',
    icon: dashboard,
    link: '/dashboard',
    requiredRoles: [roles.owner],
  },
  {
    name: 'Tìm sản phẩm',
    icon: search,
    link: '/products',
    requiredRoles: [roles.partnerProduct, roles.owner],
  },
  {
    name: 'Sản phẩm đã chọn',
    icon: cart,
    link: '/selected-products',
    requiredRoles: [roles.partnerProduct, roles.owner],
  },
  {
    name: 'Sản phẩm đang bán',
    icon: product,
    link: '/selling-products',
    requiredRoles: [roles.partnerProduct, roles.owner],
  },
  {
    name: 'Đơn hàng',
    icon: order,
    link: '/orders',
    requiredRoles: [roles.partnerOrder, roles.owner],
  },
  {
    name: 'Báo cáo & phân tích',
    icon: dashboard,
    link: '/analysis',
    requiredRoles: [roles.owner],
  },
  {
    name: 'Cửa hàng đã kết nối',
    icon: home,
    link: '/stores',
    requiredRoles: [roles.partnerStore, roles.owner],
  },

  // {
  //   name: 'Kho hàng',
  //   icon: warehouse,
  //   link: '/warehousing',
  // },
  {
    name: 'Nhân viên',
    icon: employee,
    link: '/employees',
    requiredRoles: [roles.partnerMember, roles.owner],
  },
  {
    name: 'Tài chính',
    subMenus: [
      {
        name: 'Ví của tôi',
        icon: wallet,
        link: '/mywallet',
        requiredRoles: [roles.partnerBalance, roles.owner],
      },
      {
        name: 'Tổng quan công nợ',
        icon: dashboard,
        link: '/accountant/debt-overview',
        requiredRoles: [roles.partnerBalance, roles.owner],
      },
    ],
  },
  {
    name: 'Tiếp thị',
    subMenus: [
      {
        name: 'Tổng quan tiếp thị',
        icon: affiliate,
        link: '/affiliate',
        requiredRoles: [roles.owner],
      },
    ],
  },
];

export const menusCSKH = [
  {
    key: 1,
    name: 'Trung tâm trợ giúp',
    icon: cskh,
    link: 'https://odii.asia/trung-tam-tro-giup',
  },
  {
    key: 2,
    name: 'Nhắn tin Messenger',
    icon: messenger,
    link: 'https://www.facebook.com/Odiiplatform',
  },
];

export const DEFAULT_ITEM = {
  sellingProduct: 'Sản phẩm đang bán',
  selectedProduct: 'Sản phẩm đã chọn',
};
