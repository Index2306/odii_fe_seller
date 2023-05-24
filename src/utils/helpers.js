import { store } from '../';
import constants from 'assets/constants';
import { isString } from 'lodash';
import moment from 'moment';

export const isAdmin = auth => {
  const state = store.getState();
  const roles = state?.global?.userInfo?.roles || [];
  return [constants.roles.superAdmin].some(role =>
    (auth || roles).includes(role),
  );
};

export const formatMoney = n => {
  const price = isString(n) ? +n : n;
  if (price < 0) return 0;
  return price?.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export const formatVND = n => {
  let val = (n / 1).toFixed(0).replace(',', '.');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatDate = dateStr => {
  const date = moment(dateStr);
  const dateFormatted = date.format('HH:mm DD/MM/YYYY');
  const dayNumber = date.weekday();
  const days = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ];
  const sliceIndex = 5;
  return dateFormatted.slice(0, sliceIndex) + dateFormatted.slice(sliceIndex);
};

export const formatCash = n => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
};

export const formatDateForSend = (time, isEnd) => {
  const t = isEnd ? moment(time)?.endOf('day') : moment(time)?.startOf('day');
  return t.subtract({ hours: 7 })?.utc()?.toISOString(true);
};
export const formatInputMoney = n => {
  if (n <= 0) return 0;
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const roundMoney = m => {
  return Math.round(m);
};
// n?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) ?? '';

export const isPermission = permission => {
  if (isAdmin()) return true;
  const state = store.getState();
  const roles = state?.global?.userInfo?.roles || [];
  return roles.includes(permission);
};

export function nonAccentVietnamese(str) {
  str = str.toLowerCase();
  //     We can also use this instead of from line 11 to line 17
  //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
  //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
  //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
  //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
  //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
  //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
  //     str = str.replace(/\u0111/g, "d");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export const genImgUrl = ({ width = 300, height = 300, location, fitType }) => {
  return `${process.env.REACT_APP_IMAGE_STATIC_HOST}${
    fitType ? `/${fitType}` : ''
  }/${width}x${height}/${location}`;
};

export function serialize(obj) {
  const str = [];
  Object.keys(obj).forEach(key => {
    if (obj[key]) str.push(key + '=' + obj[key]);
  });
  return str.join('&');
}

export function serializeAPI(obj) {
  const str = [];
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      obj[key].forEach(item => {
        str.push(key + `=` + item);
      });
    } else {
      if (obj[key]) str.push(key + '=' + obj[key]);
    }
  });
  return str.join('&');
}

export function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export const formatDateRange = (
  fromDateStr,
  toDateStr,
  fil,
  separator = ' → ',
  format = 'DD/MM/YYYY',
) => {
  let fromDate = moment(fromDateStr);
  let toDate = moment(toDateStr);
  if (!fil) {
    fromDate.add(7, 'hours');
    toDate.add(7, 'hours');
  }
  const dateParts = [fromDate.format(format), toDate.format(format)];
  const dateRangeStr = dateParts.join(separator);
  return dateRangeStr;
};

export function validatePhoneNumberVN() {
  return {
    validator(_, value) {
      if (/((^(\+84|84|0084|0){1})(2|3|5|7|8|9))+([0-9]{8})$/.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error('Số điện thoại bắt đầu bằng +84, 84, 0xx'),
      );
    },
  };
}

export function normalizeAddress(revPrefix, addName) {
  if (!addName) return '';
  const p = revPrefix.toLowerCase();
  const a = addName.toLowerCase().trim();
  let ret = a.replace(p, '');
  ret = nonAccentVietnamese(ret);
  return ret;
}

export function GetTime(type) {
  let curr = new Date();
  let prev = '';
  let time = [];
  let firstday = '';
  let lastday = '';
  switch (type) {
    case 'today':
      firstday = new Date();
      lastday = new Date();
      time = [firstday, lastday];
      return time;
    case 'yesterday':
      firstday = new Date(curr.setDate(curr.getDate() - 1));
      lastday = new Date(curr.setDate(curr.getDate()));
      time = [firstday, lastday];
      return time;
    case 'week':
      firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
      lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
      time = [firstday, lastday];
      return time;
    case 'lastweek':
      prev = new Date(curr.setDate(curr.getDate() - 7));
      firstday = new Date(prev.setDate(prev.getDate() - prev.getDay()));
      lastday = new Date(prev.setDate(prev.getDate() - prev.getDay() + 6));
      time = [firstday, lastday];
      return time;
    case 'month':
      firstday = new Date(curr.getFullYear(), curr.getMonth(), 1);
      lastday = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      moment(firstday).add(7, 'hours');
      moment(lastday).add(7, 'hours');
      time = [firstday, lastday];
      return time;
    case 'lastmonth':
      prev = new Date(curr.setDate(0));
      firstday = new Date(prev.getFullYear(), prev.getMonth(), 1);
      lastday = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
      time = [firstday, lastday];
      return time;
    case 'twoweek':
      firstday = new Date(curr.setDate(curr.getDate() - 13));
      lastday = new Date(curr.setDate(curr.getDate() + 13));
      time = [firstday, lastday];
      return time;
    case 'year':
      firstday = moment(curr).startOf('year');
      lastday = moment(curr).endOf('year');
      time = [firstday, lastday];
      return time;
    case 'custom':
      time = '';
      return time;
    default:
      break;
  }
}

export function getOrderAction(
  platform,
  role,
  odii_status,
  fullfillment_status,
  order_platform_status,
) {
  const existed = constants.ORDER_ACTION_MAPPING.find(item => {
    if (item.platform !== '*' && item.platform !== platform) return false;
    if (item.role !== role) return false;
    if (item.odii_status != odii_status) return false;
    if (
      item.fullfillment_status !== '*' &&
      item.fullfillment_status !== fullfillment_status
    )
      return false;
    if (
      item.platform_order_status.includes('*') ||
      item.platform_order_status.includes(order_platform_status)
    )
      return true;
    return true;
  });
  if (existed) return existed.actions;
  else return null;
}

export const getColorByConfirmStatus = status => {
  switch (status) {
    case 'pending':
      return '#2f80ed';
    case 'confirmed':
    case 'accountant_confirm':
    case 'accountant_confirmed':
    case 'chief_accountant_confirm':
    case 'chief_accountant_confirmed':
      return '#7EA802';
    case 'rejected':
    case 'accountant_rejected':
    case 'chief_accountant_rejected':
      return 'secondary2';
    default:
      return '#2f80ed';
  }
};

export const getTitleByConfirmStatus = status => {
  switch (status) {
    case 'pending':
      return 'Chờ duyệt';
    case 'confirmed':
    case 'accountant_confirm':
    case 'accountant_confirmed':
    case 'chief_accountant_confirm':
    case 'chief_accountant_confirmed':
      return 'Đã duyệt';
    case 'rejected':
    case 'accountant_rejected':
    case 'chief_accountant_rejected':
      return 'Đã từ chối';
    case 'NA':
      return 'N/A';
    default:
      return 'Chờ duyệt';
  }
};
