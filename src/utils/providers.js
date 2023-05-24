import req from './request';

export function getLocation(params) {
  // params.type = country || province || ward || district
  return req('common-service/location-country', { params });
}

export function getListSuppliers(params = {}) {
  // ?keyword=odi&from_province_id=1&from_district_id=9
  return req('user-service/seller/suggest-suppliers', {
    params,
  });
}

export function getAllListSuppliers(params = {}) {
  // ?keyword=odi&from_province_id=1&from_district_id=9
  return req('user-service/seller/suggest-suppliers', {
    params: { page: 1, page_size: 1000 },
  });
}

export function getDetailSuppliers(id) {
  // ?keyword=odi&from_province_id=1&from_district_id=9
  return req('/oms/seller/detail-supplier-warehousing', {
    params: { supplier_id: id },
  });
}

export function getListWarehousing(params = {}) {
  // ?supplier_id=1
  return req('/user-service/seller/suggest-warehousing', {
    params,
  });
}

export function getAllListWarehousing(params = {}) {
  // ?supplier_id=1
  return req('/user-service/seller/suggest-warehousing', {
    params: { page: 1, page_size: 1000 },
  });
}

export function getStores() {
  // params.type = country || province || ward || district
  return req('product-service/seller/stores', {});
}
export function getSuggestCategory(value) {
  return req('/product-service/categories-listing-v2', {
    params: { is_leaf: true, keyword: value },
  });
}
export function getSuggestCategoryByName(value) {
  return req('/product-service/categories-listing-v2-product', {
    params: { is_leaf: true, keyword: value },
  });
}

export function getStoreCategories(params) {
  return req('product-service/get-store-categories', { params });
}
export function getSalesChannels(channel = 'lazada') {
  return req(`/sales-channels-service/${channel}/category`, {});
}

export function getAttributes(params) {
  return req('product-service/get-platform-category-attributes', { params });
}

export function captcha() {
  return new Promise(resolve =>
    window.grecaptcha.ready(function () {
      window.grecaptcha
        .execute('6Ld4M00gAAAAAG7PUC0afvwcuWkph52qm2hKcYyc', {
          action: 'submit',
        })
        .then(function (recaptcha_token) {
          // Send form value as well as token to the server
          resolve(recaptcha_token);
        });
    }),
  );
}
