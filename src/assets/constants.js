/* eslint-disable import/no-anonymous-default-export */

import {
  ShopifyIcon,
  ShopeeIcon,
  // EtsyIcon,
  LazadaIcon,
  TiktokIcon,
  logoGHTK,
  logoGHN,
} from 'assets/images/platform';
import { denyProd, sellProd, totalProd } from './images/dashboards';

export default {
  roles: {
    owner: 'owner',
    superAdmin: 'super_admin',

    partnerProduct: 'partner_product',
    partnerOrder: 'partner_order',
    partnerBalance: 'partner_balance',
    partnerMember: 'partner_member',
    partnerStore: 'partner_store',

    adminProduct: 'admin_product',
    adminOrder: 'admin_order',
    adminUser: 'admin_user',
    adminBalance: 'admin_balance',
  },
  ERRORS__AUTH: {
    invalid_recaptcha_token: 'Có lỗi xảy ra vui lòng thử lại sau!',
    token_invalid: 'Đường dẫn đã hết hạn hoặc không tồn tại!',
    EMAIL_NOT_FOUND: 'Email không tồn tại',
    email_not_found: 'Tài khoản email không tồn tại!',
    user_activated: 'Tài khoản đã được kích hoạt thành công từ trước',
    get_social_info_error:
      'Không thể lấy thông tin từ tài khoản mạng xã hội của bạn',
    user_does_not_exist: 'Tài khoản không tồn tại',
    domain_does_not_exist: 'Tên miền không tồn tại',
    you_are_not_supplier: 'Tài khoản không phải là Supplier',
    supplier_pending_for_review: 'Tài khoản Supplier đang được review',
    invalid_account_type: 'Tài khoản không hợp lệ',
    password_incorrect: 'Mật khẩu không chính xác',
    wrong_account_or_password: 'Tài khoản hoặc mật khẩu không chính xác',
    user_already_exist: 'Người dùng đã tồn tại',
    registered_gmail_linked_to_facebook:
      'Gmail liên kết với tài khoản Facebook này đã được sử dụng, vui lòng lấy lại mật khẩu hoặc đăng ký bằng tài khoản Facebook khác',
    SOCIAL_EMAIL_NOT_FOUND:
      'Tài khoản Facebook này chưa được liên kết với gmail, vui lòng liên kết gmail hoặc đăng ký bằng tài khoản Facebook khác',
    USER_INACTIVE:
      'Tài khoản đã được đăng ký. Vui lòng kích hoạt tài khoản qua đường dẫn được gửi trong email',
    user_inactive:
      'Tài khoản đã được đăng ký. Vui lòng kích hoạt tài khoản qua đường dẫn được gửi trong email',
    INVALID_PASSWORD: 'Mật khẩu không chính xác ',
    invalid_password: 'Mật khẩu không chính xác ',
    user_already_supplier: 'Bạn đã là 1 nhà cung cấp, vui lòng đăng nhập',

    user_status_inactive: 'Tài khoản đã bị vô hiệu hóa',
    pending_for_review: 'Tài khoản đang chờ được duyệt',
    pending_for_active: 'Vui lòng kiểm tra email và kích hoạt tài khoản',
    '"old_password" length must be at least 8 characters long':
      ' Mật khẩu cũ không chính xác',
    '"email" must be a valid email': 'Email không hợp lệ',
    'new password must be different from last 4 passwords':
      'Mật khẩu mới không trùng 4 mật khẩu cũ gần nhất',
    seller_has_reached_maximum:
      'Số tài khoản seller hoạt động đã đạt mức tối đa cho phép của gói, vui lòng liên hệ admin để được hỗ trợ',
    subscription_has_expired: 'Gói đăng ký đã hết hạn',
  },

  COMMON_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm ẩn', color: 'secondary2' },
    { id: 'pending_for_review', name: 'Đang chờ', color: 'primary' },
    {
      id: 'pending_for_review_after_update',
      name: 'Chờ duyệt lại',
      color: 'primary',
    },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'succeeded', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    { id: 'failed', name: 'Đã hủy', color: 'blackPrimary' },
    { id: 'reject', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'cancelled', name: 'Đã hủy', color: 'blackPrimary' },

    { id: 'platform_cancelled', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'platform_confirmed', name: 'Đã duyệt', color: 'greenMedium' },

    { id: 'accountant_confirm', name: 'Đang chờ', color: 'primary' },
    { id: 'chief_accountant_confirm', name: 'Đã duyệt', color: 'greenMedium' },

    { id: 'accountant_confirmed', name: 'Đang chờ', color: 'primary' },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    { id: 'accountant_rejected', name: 'Đã từ chối', color: 'blackPrimary' },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'blackPrimary',
    },

    { id: 'seller_cancelled', name: 'Seller đã hủy', color: 'blackPrimary' },
    {
      id: 'platform_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },
    {
      id: 'seller_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },

    {
      id: 'supplier_cancelled',
      name: 'Supplier đã hủy',
      color: 'blackPrimary',
    },
    {
      id: 'platform_cancelled',
      name: 'Hệ thống đã hủy',
      color: 'blackPrimary',
    },
    {
      id: 'supplier_confirmed',
      name: 'Chờ đối soát',
      color: 'primary',
    },

    { id: 'rejected', name: 'Đã từ chối', color: 'blackPrimary' },
    { id: 'completed', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirm', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'confirmed', name: 'Đã duyệt', color: 'greenMedium' },
  ],
  EMPLOYEE_STATUS: [
    { id: 'active', name: 'Hoạt động', color: 'greenMedium' },
    { id: 'inactive', name: 'Tạm khóa', color: 'grayBlue' },
    { id: true, name: 'Hoạt động', color: 'greenMedium' },
    { id: false, name: 'Tạm khóa', color: 'grayBlue' },
  ],
  ORDER_STATUS: [
    // { id: 'OPEN', name: 'Đang chờ', color: 'darkBlue2' },
    // { id: 'CLOSE', name: 'Đã hoàn thành', color: 'greenMedium1' },
    { id: 'PENDING', name: 'Đang chờ', color: 'gray3' },
    { id: 'ACTIVE', name: 'Đã xác nhận', color: 'greenMedium1' },
    { id: 'CANCELED', name: 'Đã huỷ', color: 'secondary2' },
  ],
  ORDER_PAYMENT_STATUS: [
    { id: 'PENDING', name: 'Đang chờ', color: 'darkBlue2', value: 'pending' },
    {
      id: 'PARTIAL_PAID',
      name: 'Thanh toán 1 phần',
      color: 'grayBlue',
      value: 'partially_paid',
    },
    {
      id: 'PAID',
      name: 'Đã thanh toán',
      color: 'greenMedium1',
      value: 'paid',
    },
    {
      id: 'PARTIAL_REFUNDED',
      name: 'Hoàn trả 1 phần',
      color: 'secondary2',
      value: 'partially_refunded',
    },
    {
      id: 'SELLER_CANCELED',
      name: 'Seller huỷ',
      color: 'secondary2',
      value: 'seller_canceled',
    },
    {
      id: 'REFUNDED',
      name: 'Đã hoàn tiền',
      color: 'secondary2',
      value: 'refunded',
    },
    { id: 'VOIDED', name: 'Vô hiệu', color: 'secondary2', value: 'voided' },
  ],

  ORDER_FULFILLMENT_STATUS: {
    PENDING: { id: 'pending', name: 'Đang chờ', color: 'grayBlue' },
    SELLER_CONFIRM: {
      id: 'seller_confirm',
      name: 'Chờ Seller xác nhận  ',
      color: 'grayBlue',
    },
    SELLER_CONFIRMED: {
      id: 'seller_confirmed',
      name: 'Chờ NCC xác nhận',
      color: 'grayBlue',
    },
    SELLER_IGNORED: {
      id: 'seller_ignored',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SELLER_CANCELLED: {
      id: 'seller_cancelled',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SUPPLIER_CONFIRM: {
      id: 'supplier_confirm',
      name: 'Chờ NCC xác nhận',
      color: 'grayBlue',
    },
    SUPPLIER_CONFIRMED: {
      id: 'supplier_confirmed',
      name: 'Chờ NCC đóng gói',
      color: 'grayBlue',
    },
    SUPPLIER_PACKED: {
      id: 'supplier_packed',
      name: 'Đã đóng hàng',
      color: 'grayBlue',
    },
    SELLER_DELIVERED: {
      id: 'seller_delivered',
      name: 'seller đã nhận hàng',
      color: 'greenMedium1',
    },
    PLATFORM_DELIVERED: {
      id: 'platform_delivered',
      name: 'Đã giao vận chuyển',
      color: 'greenMedium1',
    },
    PLATFORM_CANCELLED: {
      id: 'platform_cancelled',
      name: 'Kênh bán huỷ',
      color: '#8D8D8D',
    },
    SUPPLIER_DELIVERED: {
      id: 'supplier_delivered',
      name: 'Đã giao vận chuyển',
      color: 'greenMedium1',
    },
    READY_TO_SHIP: {
      id: 'ready_to_ship',
      name: 'Sẵn sàng giao',
      color: 'greenMedium1',
    },
    SUP_REJECTED: {
      id: 'sup_rejected',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    SUP_CANCELLED: {
      id: 'sup_cancelled',
      name: 'Đã hủy',
      color: '#8D8D8D',
    },
    BUYER_CANCELLED: {
      id: 'buyer_cancelled',
      name: 'Người mua huỷ',
      color: 'secondary2',
    },
    COMPLETED: { id: 'completed', name: 'Đã giao hàng', color: 'greenMedium1' },
    FULFILLED: { id: 'fulfilled', name: 'Hoàn thành', color: 'greenMedium1' },
    CANCEL: { id: 'cancel', name: 'Đã hủy', color: '#8D8D8D' },
  },

  ORDER_SHOP_STATUS: [
    { id: 'pending', name: 'Đang chờ', color: 'grayBlue' },
    { id: 'unpaid', name: 'Chưa thanh toán', color: 'grayBlue' },
    { id: 'packed', name: 'Đã đóng gói', color: 'darkBlue2' },
    {
      id: 'ready_to_ship',
      name: 'Chờ vận chuyển',
      color: 'darkBlue2',
    },
    { id: 'shipped', name: 'Đang vận chuyển', color: 'greenMedium1' },
    { id: 'delivered', name: 'Đã giao hàng', color: 'greenMedium1' },
    { id: 'returned', name: 'Bị trả lại', color: 'secondary2' },
    {
      id: 'canceled',
      name: 'Đã hủy',
      color: 'secondary2',
    },
    { id: 'failed', name: 'Thất bại', color: 'secondary2' },
  ],
  SHOPEE_ORDER_SHOP_STATUS: {
    UNPAID: { id: 'UNPAID', name: 'Chưa thanh toán', color: 'grayBlue' },
    READY_TO_SHIP: {
      id: 'READY_TO_SHIP',
      name: 'Chờ vận chuyển',
      color: 'darkBlue2',
    },
    PROCESSED: { id: 'PROCESSED', name: 'Chờ vận chuyển', color: 'darkBlue2' },
    READY_TO_CREATE_DOCUMENT: {
      id: 'READY_TO_CREATE_DOCUMENT',
      name: 'Chờ vận chuyển',
      color: 'darkBlue2',
    },
    READY_TO_PRINT: {
      id: 'READY_TO_PRINT',
      name: 'Đang vận chuyển',
      color: 'greenMedium1',
    },
    SHIPPED: { id: 'SHIPPED', name: 'Đang vận chuyển', color: 'greenMedium1' },
    TO_CONFIRM_RECEIVE: {
      id: 'TO_CONFIRM_RECEIVE',
      name: 'Đang vận chuyển',
      color: 'greenMedium1',
    },
    IN_CANCEL: { id: 'IN_CANCEL', name: 'Đang hủy', color: 'secondary2' },
    CANCELLED: { id: 'CANCELLED', name: 'Đã hủy', color: 'secondary2' },
    COMPLETED: { id: 'COMPLETED', name: 'Hoàn thành', color: 'greenMedium1' },
  },
  SELLER_FULFILLMENT_ACTION: {
    CONFIRM: 'seller_confirmed',
    CANCEL: 'seller_cancelled',
    IGNORE: 'seller_ignored',
  },
  PRODUCT_STATUS: [
    {
      id: 'all',
      name: 'Tổng sản phẩm',
      color: 'secondary2',
      status: 'total',
      icon: totalProd,
      keys: '2',
    },
    {
      id: 'active',
      name: 'Đang hoạt động',
      color: 'greenMedium',
      status: 'active',
      icon: sellProd,
      keys: '1',
    },
    {
      id: 'inactive',
      name: 'Không hoạt động',
      color: 'secondary2',
      status: 'deactive',
      icon: denyProd,
      keys: '0',
    },
  ],
  LIST_OPTION_VARIATIONS: [
    'Kích cỡ',
    'Màu sắc',
    'Chất liệu',
    'Kiểu dáng',
    'Tiêu đề',
  ],
  PRODUCT_ODII_STATUS: [
    { id: 1, name: 'Đang hoạt động', color: 'greenMedium' },
    { id: 0, name: 'Không hoạt động', color: 'grayBlue' },
  ],
  PUBLISH_STATUS: [
    { id: 'draft', name: 'Nháp', color: 'grayBlue' },
    { id: 'inactive/inactive', name: 'Đang sửa', color: 'grayBlue' },
    {
      id: 'inactive/pending_for_review',
      name: 'Chờ duyệt',
      color: 'secondary2',
    },
    { id: 'active/active', name: 'Đang bán', color: 'greenMedium' },
    { id: 'inactive/active', name: 'Dừng bán', color: 'grayBlue' },
    { id: 'inactive/deactive', name: 'Dừng bán', color: 'grayBlue' },
    { id: 'inactive/deleted', name: 'Dừng bán', color: 'grayBlue' },
    { id: 'inactive/rejected', name: 'Từ chối', color: 'secondary2' },
  ],
  SALE_CHANNEL: [
    { id: 'PERSONAL', name: 'personal', color: 'grayBlue' },
    { id: 'SHOPEE', name: 'Shopee', color: '#EA501F', icon: ShopeeIcon },
    {
      id: 'LAZADA',
      name: 'Lazada',
      color: 'primary',
      icon: LazadaIcon,
    },
    { id: 'SHOPIFY', name: 'Shopify', color: 'orange', icon: ShopifyIcon },
    { id: 'WOO', name: 'Woocommerce', color: 'grayBlue' },
    { id: 'TIKTOK', name: 'Tiktok', color: 'black', icon: TiktokIcon },
    { id: 'OTHER', name: 'Ngoại sàn', color: 'secondary2', icon: '' },
  ],
  PLATFORM_CHANNEL: [
    { id: 'SHOPEE', name: 'Shopee', color: '#EA501F', icon: ShopeeIcon },
    { id: 'LAZADA', name: 'Lazada', color: '#201adb', icon: LazadaIcon },
    { id: 'TIKTOK', name: 'Tiktok', color: 'black', icon: TiktokIcon },
    { id: 'OTHER', name: 'Ngoại sàn', color: '#b7b7b7', icon: '' },
  ],
  MYWALLET_STATUS_SEARCH: [
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    {
      id: 'pending_all',
      name: 'Đang chờ',
      color: 'primary',
    },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },

    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },
  ],
  MYWALLET_STATUS: [
    { id: 'succeeded', name: 'Đã duyệt', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'secondary2' },
    { id: 'cancelled', name: 'Đã hủy', color: 'secondary2' },
    {
      id: 'chief_accountant_confirmed',
      name: 'Đã duyệt',
      color: 'greenMedium',
    },
    {
      id: 'chief_accountant_rejected',
      name: 'Đã từ chối',
      color: 'secondary2',
    },
    { id: 'accountant_confirmed', name: 'Đang chờ', color: 'primary' },
    { id: 'accountant_rejected', name: 'Đã từ chối', color: 'secondary2' },

    { id: 'seller_confirmed', name: 'Đang chờ', color: 'primary' },
    { id: 'platform_cancelled', name: 'Đã hủy', color: 'secondary2' },
    { id: 'platform_confirmed', name: 'Đang chờ', color: 'primary' },
    { id: 'seller_cancelled', name: 'Seller đã hủy', color: 'secondary2' },
    { id: 'seller_returned', name: 'Seller đã hủy', color: 'secondary2' },
    { id: 'supplier_cancelled', name: 'NCC đã hủy', color: 'secondary2' },
    { id: 'rejected', name: 'Đã hủy', color: 'secondary2' },
    { id: 'completed', name: 'Đã duyệt', color: 'primary' },
    { id: 'confirmed', name: 'Đang chờ', color: 'primary' },
  ],
  TRANSACTION_TYPES: [
    { id: 'deposit', name: 'Nạp tiền' },
    { id: 'withdrawal', name: 'Rút tiền' },
    { id: 'confirmed_order', name: 'Thanh toán đơn hàng' },
    { id: 'seller_get_refund', name: 'Hoàn tiền đơn hàng' },
    { id: 'supplier_fulfill_fail', name: 'Hoàn tiền cung cấp' },
    { id: 'affiliate_commission', name: 'Hoa hồng liên kết' },
  ],
  AFFILIATE_STATUS: [
    { id: 'active', name: 'Còn thời hạn', color: 'greenMedium' },
    { id: 'pending', name: 'Chưa kích hoạt', color: 'primary' },
    { id: 'expired', name: 'Đã hết hạn', color: 'secondary2' },
  ],
  AFFILIATE_PAY_STATUS: [
    { id: true, name: 'Đã thanh toán', color: 'greenMedium' },
    { id: false, name: 'Chờ thanh toán', color: 'primary' },
  ],
  ACCOUNT_STATUS: [
    { id: 'active', name: 'Đang hoạt động', color: 'greenMedium' },
    { id: 'pending', name: 'Chưa kích hoạt', color: 'primary' },
    { id: 'inactive', name: 'Dừng hoạt động', color: 'secondary2' },
  ],
  CURRENCY_LIST: [
    {
      id: 'vnd',
      name: 'Việt Nam đồng',
    },
    {
      id: 'usd',
      name: 'Dollar',
    },
  ],
  PERCENT_MONEY: {
    retail_price: 0.1,
    retail_price_compare_at: 0.2,
  },
  KEY_FILTER: [
    { id: 'platform', name: 'Nền tảng' },
    { id: 'store_id', name: 'Cửa hàng' },
    { id: 'odii_status', name: 'Trạng thái' },
  ],

  TAB_PANEL: [
    { id: 'all', name: 'Tất cả' },
    { id: 'pending', name: 'Chờ xác nhận' },
    { id: 'confirmed', name: 'Chờ cung cấp' },
    { id: 'shipping', name: 'Đang vận chuyển' },
    { id: 'delivered', name: 'Đã nhận hàng' },
    { id: 'returned', name: 'Đã trả hàng' },
    { id: 'cancelled', name: 'Hủy đơn hàng' },
  ],

  DATE_ORDER: [
    {
      id: 'time',
      title: 'Ngày đặt hàng',
      range_picker: true,
      child: [
        { name: 'Ngày hôm nay' },
        { name: 'Ngày hôm qua' },
        { name: 'Quá khứ 7 ngày' },
        { name: 'Quá khứ 30 ngày' },
        { name: 'Tùy chọn' },
      ],
    },
    {
      id: 'type',
      title: 'Loại đơn hàng',
      range_picker: false,
      child: [
        { name: 'Tất cả đơn' },
        { name: 'Thông thường' },
        { name: 'Mã giảm giá' },
      ],
    },
  ],

  TIKTOK_ORDER_SHOP_STATUS: {
    // UNPAID: 'UNPAID',
    // AWAITING_SHIPMENT: 'AWAITING_SHIPMENT',
    // AWAITING_COLLECTION: 'AWAITING_COLLECTION',
    // PARTIALLY_SHIPPING: 'PARTIALLY_SHIPPING',
    // IN_TRANSIT: 'IN_TRANSIT',
    // DELIVERED: 'DELIVERED',
    // COMPLETED: 'COMPLETED',
    // CANCELLED: 'CANCELLED',

    100: { id: 'UNPAID', name: 'Chưa thanh toán', color: 'grayBlue' },
    111: {
      id: 'AWAITING_SHIPMENT',
      name: 'Chờ vận chuyển',
      color: 'darkBlue2',
    },
    112: {
      id: 'AWAITING_COLLECTION',
      name: 'Đang chờ lấy hàng',
      color: 'darkBlue2',
    },
    114: {
      id: 'PARTIALLY_SHIPPING',
      name: '',
      color: 'darkBlue2',
    },
    121: {
      id: 'IN_TRANSIT',
      name: '',
      color: 'greenMedium1',
    },
    122: { id: 'DELIVERED', name: 'Đang vận chuyển', color: 'greenMedium1' },
    TO_CONFIRM_RECEIVE: {
      id: 'TO_CONFIRM_RECEIVE',
      name: 'Đang vận chuyển',
      color: 'greenMedium1',
    },
    130: { id: 'COMPLETED', name: 'Hoàn thành', color: 'grayBlue' },
    140: { id: 'CANCELLED', name: 'Đã hủy', color: 'secondary2' },
  },

  ORDER_FILTER_STATUS: [
    {
      id: '',
      name: 'Tất cả',
      color: 'grayBlue',
      tooltip: 'Tất cả trạng thái đơn hàng',
    },
    {
      id: 1,
      name: 'Chưa thanh toán',
      color: 'grayBlue',
      tooltip: 'Chờ khách hàng thanh toán online',
    },
    {
      id: 2,
      name: 'Chờ xử lý',
      color: 'grayBlue',
      tooltip: 'Chờ Seller/Supplier xác nhận, đóng gói & in đơn',
    },
    {
      id: 3,
      name: 'Chờ lấy hàng',
      color: 'darkBlue2',
      tooltip: 'Đơn hàng đã sẵn sàng giao và chờ giao vận đến lấy',
    },
    {
      id: 4,
      name: 'Đang vận chuyển',
      color: 'greenMedium1',
      tooltip: 'Đơn hàng đang trên đường giao bởi giao vận',
    },
    {
      id: 5,
      name: 'Đã giao hàng',
      color: 'greenMedium1',
      tooltip: 'Đã giao thành công tới khách hàng',
    },
    {
      id: 6,
      name: 'Đã hủy',
      color: 'secondary2',
      tooltip: 'Đơn hàng bị hủy (kèm lý do)',
    },
    {
      id: 7,
      name: 'Chưa xác định',
      color: 'grayBlue',
      tooltip: '',
    },
  ],
  ORDER_FILTER_WAITCONFIRM_STATUS: [
    { id: 'pending', name: 'Chờ seller xác nhận', color: 'grayBlue' },
    {
      id: 'seller_confirmed',
      name: 'Chờ nhà cung cấp xác nhận',
      color: 'grayBlue',
    },
    {
      id: 'supplier_confirmed',
      name: 'Đóng gói & in đơn',
      color: 'grayBlue',
    },
  ],

  ORDER_FILTER_TIME: [
    { id: 'day', name: 'Ngày đặt hàng' },
    { id: 'today', name: 'Hôm nay' },
    { id: 'yesterday', name: 'Hôm qua' },
    { id: 'week', name: 'Tuần này' },
    { id: 'lastweek', name: 'Tuần trước' },
    { id: 'month', name: 'Tháng này' },
    { id: 'lastmonth', name: 'Tháng trước' },
    { id: 'custom', name: 'Tùy chỉnh' },
  ],
  ODII_ORDER_STATUS_NAME: {
    1: { id: 1, name: 'Chưa thanh toán', color: 'grayBlue' },
    2: { id: 2, name: 'Chờ xử lý', color: 'grayBlue' },
    3: { id: 3, name: 'Chờ lấy hàng', color: 'grayBlue' },
    4: { id: 4, name: 'Đang vận chuyển', color: 'darkBlue2' },
    5: { id: 5, name: 'Đã giao hàng', color: 'greenMedium1' },
    6: { id: 6, name: 'Đã hủy', color: '#8D8D8D' },
    7: { id: 6, name: 'Chưa xác định', color: '#8D8D8D' },
  },
  ODII_ORDER_STATUS: {
    UNPAID: 1, // chua thanh toan
    PENDING: 2, // cho xu ly
    WAIT_SHIPPING: 3, // cho lay hang
    SHIPPING: 4, // dang van chuyen
    DELIVERED: 5, // da giao hang
    CANCELED: 6, // da huy
    UNDEFINED: 7, // chua xac dinh
  },
  ORDER_ACTION_MAPPING: [
    {
      platform: '*',
      role: 'seller',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'pending',
      platform_order_status: ['*'],
      actions: { seller_confirm: true, order_cancel: true },
    },
    {
      platform: '*',
      role: 'seller',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'seller_confirmed',
      platform_order_status: ['*'],
      actions: { order_cancel: true },
    },
    {
      platform: '*',
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'seller_confirmed',
      platform_order_status: ['*'],
      actions: { supplier_confirm: true, order_cancel: true },
    },
    {
      platform: 'lazada',
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'supplier_confirmed',
      platform_order_status: ['topack', 'repacked'],
      actions: { order_cancel: true, update_packing: true },
    },
    {
      platform: 'lazada',
      role: 'supplier',
      odii_status: 2, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: 'supplier_packed',
      platform_order_status: ['packed'],
      actions: { order_cancel: true, ready_toship: true, print: true },
    },
    {
      platform: 'lazada',
      role: 'supplier',
      odii_status: 3, // constants.ODII_ORDER_STATUS.PENDING,
      fullfillment_status: '*',
      platform_order_status: ['ready_to_ship_pending', 'ready_to_ship'],
      actions: { order_cancel: true, print: true },
    },
  ],
  ORDER_ACTION_TYPE_NAME: [
    {
      id: 'seller_confirm',
      name: 'Xác nhận đơn',
      count_name: 'seller_confirm_count',
      color: 'blue',
      title: 'Xác nhận đơn',
      confirm_message: 'Bạn có chắc chắn muốn xác nhận {0} đơn hàng này không?',
    },
    {
      id: 'supplier_confirm',
      name: 'Xác nhận đơn',
      count_name: 'supplier_confirm_count',
      color: 'blue',
      title: 'Xác nhận cung cấp đơn hàng',
      confirm_message: 'Bạn có chắc chắn muốn cung cấp {0} đơn hàng này không?',
    },
    {
      id: 'update_packing',
      name: 'Đóng gói',
      count_name: 'update_packing_count',
      color: 'blue',
      title: 'Xác nhận đóng gói đơn hàng',
      confirm_message: 'Bạn có chắc chắn muốn đóng gói {0} đơn hàng này không?',
    },
    {
      id: 'ready_toship',
      name: 'Sẵn sàng vận chuyển',
      count_name: 'ready_toship_count',
      color: 'blue',
      title: 'Xác nhận vận chuyển đơn hàng',
      confirm_message: 'Bạn có chắc chắn vận chuyển {0} đơn hàng này không?',
    },
    { id: 'print', name: 'In đơn hàng', count_name: 'print_count' },
    {
      id: 'order_cancel',
      name: 'Hủy đơn hàng',
      count_name: 'order_cancel_count',
      color: 'red',
      title: 'Xác nhận hủy đơn hàng',
      confirm_message: 'Bạn có chắc chắn hủy {0} đơn hàng này không?',
    },
  ],
  ORDER_CANCEL_REASON_NOTE: [
    {
      id: 'Buyer requested cancellation',
      name: 'Người mua yêu cầu hủy đơn',
    },
    {
      id: 'Unable to deliver to buyer address',
      name: 'Không thể giao hàng tới khu vực này',
    },
    {
      id: 'Undeliverable Area',
      name: 'Không thể giao hàng tới khu vực này',
    },
    {
      id: 'Out of stock',
      name: 'Hết hàng',
    },
    {
      id: 'Seller did not Ship',
      name: 'Người bán không gửi hàng',
    },
    {
      id: 'Pricing error',
      name: 'Hủy bởi nhà bán do sai giá',
    },
    {
      id: 'Buyer requested cancellation',
      name: 'Người mua yêu cầu hủy đơn',
    },
    {
      id: 'Need to change delivery address',
      name: 'Cần thay đổi địa chỉ giao hàng',
    },
    {
      id: 'Need to change payment method',
      name: 'Cần thay đổi phương thức thanh toán',
    },
    {
      id: 'High delivery costs',
      name: 'Chi phí giao hàng cao',
    },
    {
      id: 'Buyer overdue to pay',
      name: 'Người mua quá hạn thanh toán',
    },
    {
      id: 'Automatically cancelled due to collection time out',
      name: 'Tự động bị hủy do hết thời gian nhận',
    },
    {
      id: 'Wrong delivery information',
      name: 'Thông tin giao hàng sai',
    },
  ],
  ORDER_CANCEL_REASON: {
    lazada: [
      { id: '15', name: 'Hết hàng' },
      { id: '21', name: 'Hủy bởi nhà bán do sai giá' },
    ],
    shopee: [
      { id: 'OUT_OF_STOCK', name: 'Hết hàng' },
      { id: 'CUSTOMER_REQUEST', name: 'Người mua yêu cầu hủy đơn' },
      { id: 'UNDELIVERABLE_AREA', name: 'Không thể giao hàng tới khu vực này' },
      { id: 'COD_NOT_SUPPORTED', name: 'Không hỗ trợ thanh toán COD' },
    ],
    tiktok: [
      {
        id: 'seller_cancel_unpaid_reason_buyer_requested_cancellation',
        name: 'Người mua yêu cầu hủy đơn',
        available_status_list: ['100'],
      },
      {
        id: 'seller_cancel_unpaid_reason_buyer_hasnt_paid_within_time_allowed',
        name: 'Người mua không thanh toán đúng hạn',
        available_status_list: ['100'],
      },
      {
        id: 'seller_cancel_unpaid_reason_wrong_price',
        name: 'Hủy bởi nhà bán do sai giá',
        available_status_list: ['100'],
      },
      {
        id: 'seller_cancel_paid_reason_address_not_deliver',
        name: 'Không thể giao hàng tới khu vực này',
        available_status_list: ['111', '112'],
      },
      {
        id: 'seller_cancel_reason_out_of_stock',
        name: 'Hết hàng',
        available_status_list: ['111', '112'],
      },
      {
        id: 'seller_cancel_unpaid_reason_out_of_stock',
        name: 'Hết hàng',
        available_status_list: ['100'],
      },
      {
        id: 'seller_cancel_reason_wrong_price',
        name: 'Hủy bởi nhà bán do sai giá',
        available_status_list: ['111', '112'],
      },
      {
        id: 'seller_cancel_paid_reason_buyer_requested_cancellation',
        name: 'Người mua yêu cầu hủy đơn',
        available_status_list: ['111', '112'],
      },
    ],
  },
  TRANSACTION_STATUS: [
    { id: 'succeeded', name: 'Đã thanh toán', color: 'greenMedium' },
    { id: 'created', name: 'Khởi tạo', color: 'gray1' },
    { id: 'pending', name: 'Đang chờ', color: 'primary' },
    { id: 'failed', name: 'Đã hủy', color: 'secondary2' },
    { id: 'cancelled', name: 'Đã hủy', color: 'secondary2' },
    { id: 'confirmed', name: 'Chờ thanh toán', color: 'primary' },
  ],
  TRANSPORT: [
    {
      id: 'GHTK',
      name: 'Giao hàng tiết kiệm',
      icon: logoGHTK,
      options: [
        {
          id: 'road',
          name: 'Vận chuyển đường bộ',
        },
      ],
    },
    {
      id: 'GHN',
      name: 'Giao hàng nhanh',
      icon: logoGHN,
    },
  ],
};
