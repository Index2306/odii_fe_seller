import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Input,
  Checkbox,
  Modal,
  Pagination,
  Table,
  Spin,
  Space,
  Tooltip,
} from 'antd';
import { Form, Button, BoxColor, Image, Select } from 'app/components';
import {
  ShopifyIcon,
  ShopeeIcon,
  LazadaIcon,
  WooCommerceIcon,
  TiktokIcon,
} from 'assets/images/platform';
import notification from 'utils/notification';

import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components/macro';

import { isEmpty, debounce, uniq, min, max } from 'lodash';
import request from 'utils/request';
import { genImgUrl, formatMoney } from 'utils/helpers';
import { KEY_WORD_MIN_LENGTH } from './ListOrderItem';

const { Option } = Select;

const PRODUCT_IMG_SIZE = 36;
const PAGE_SIZE = 10;
const VARIATION_OPTIONS = [
  { fieldValue: 'Màu sắc', titleShowBefore: '' },
  { fieldValue: 'Kích cỡ', titleShowBefore: 'Size ' },
  { fieldValue: 'Kiểu dáng', titleShowBefore: '' },
];
const VARIATION_OPTION_FIELDS = ['option_2', 'option_1', 'option_3'];
const SELECTED_COLUMN_INDEX = 0;
const PRICE_COLUMN_INDEX = 6;
const EXPANDED_COLUMN_INDEX = 7;

const platforms = [
  { key: 'shopify', name: 'Shopify', icon: ShopifyIcon, isActive: false },
  {
    key: 'woocommerce',
    name: 'Woocommerce',
    icon: WooCommerceIcon,
    isActive: false,
  },
  { key: 'shopee', name: 'Shopee', icon: ShopeeIcon, isActive: false },
  { key: 'lazada', name: 'Lazada', icon: LazadaIcon, isActive: true },
  { key: 'tiktok', name: 'Tiktok', icon: TiktokIcon, isActive: false },
];
const PUBLISH_STATUS = [
  { id: 'ready', name: 'Sẵn sàng', color: 'grayBlue' },
  {
    id: 'pending',
    name: 'Chờ duyệt',
    color: 'secondary2',
  },
  { id: 'active', name: 'Đang bán', color: 'greenMedium' },
  { id: 'inactive', name: 'Chưa bán', color: 'grayBlue' },
  { id: 'rejected', name: 'Từ chối', color: 'secondary2' },
];

const SORT = [
  { id: '1', name: 'Mới nhất', fields: null },
  {
    id: '2',
    name: 'Giá thấp đến cao',
    fields: { order_by: 'min_price_variation', order_direction: 'asc' },
  },
  {
    id: '3',
    name: 'Giá cao đến thấp',
    fields: { order_by: 'min_price_variation', order_direction: 'desc' },
  },
];

const PUBLISH_STATUS_FILTER = [
  { value: 'active', text: 'Đang bán' },
  { value: 'inactive', text: 'Chưa bán' },
  { value: 'ready', text: 'Sẵn sàng' },
];

export default memo(function ListProduct({
  selectedVariations,
  setSelectedVariations,
  valueChecked,
  setValueChecked,
  keywordFilter,
  setKeywordFilter,
  onCancel,
  setShippingFee,
  ...rest
}) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [productData, setProductData] = useState({});
  const [currProductLoadingId, setCurrProductLoadingId] = useState(null);
  const [stores, setStores] = useState([]);
  const [wareHouse, setWareHouse] = useState([]);
  const [form] = Form.useForm();
  const productTableContainer = useRef(null);

  const selectedVariationMap = useMemo(() => {
    const variationIds = new Map();
    const productIds = new Map();
    selectedVariations.forEach(variation => {
      variationIds.set(variation.id, null);
      productIds.set(variation.productId, null);
    });

    return { variationIds, productIds };
  }, [selectedVariations]);

  const updateKeywordFiler = () => {
    form.setFieldsValue({ keyword: keywordFilter });
  };

  const changeFilter = useCallback(
    debounce(keyword => {
      if (keyword !== '' && keyword.length < KEY_WORD_MIN_LENGTH) {
        return;
      }
      setKeywordFilter(keyword);
    }, 200),
    [],
  );

  useEffect(() => {
    updateKeywordFiler();
  }, []);

  useEffect(() => {
    const productTableContainerElement = productTableContainer.current;
    if (productTableContainerElement) {
      setupRowEvents(productTableContainerElement);
    }
  }, [productData]);

  useEffect(() => {
    fetchStores();
    fetchWareHousing();
    setFilterDefault();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [keywordFilter]);

  useEffect(() => {
    if (selectedVariations.length === 0) {
      setValueChecked(null);
    }
  }, [selectedVariations]);

  const setupForceCloseExpandRow = tableElement => {
    const forceCloseTrs = tableElement.querySelectorAll('.force-close-expand');
    forceCloseTrs.forEach(forceCloseTr => {
      forceCloseTr?.previousElementSibling
        ?.querySelector('.expand-btn')
        ?.click();
    });
  };

  const setFilterDefault = () => {
    form.setFieldsValue({
      platform: '',
      store_id: '',
      publish_status: '',
      sort_id: '',
      ware_house: '',
    });
  };

  const setupExpandRow = tableElement => {
    let availableExpandElements = tableElement.querySelectorAll(
      '.expand-onclick',
    );
    availableExpandElements = [
      ...availableExpandElements,
      ...tableElement.querySelectorAll(
        '.ant-table-row-expand-icon-cell .expand-btn',
      ),
    ];
    availableExpandElements.forEach(expandAvail => {
      const tdElement = expandAvail.parentNode;
      tdElement &&
        (tdElement.onclick = e => {
          if (e.target.className.includes('expand-btn')) {
            return;
          }
          tdElement.parentNode?.children[EXPANDED_COLUMN_INDEX]?.querySelector(
            '.expand-btn',
          )?.click();
        });
    });
  };

  const setupSelectedRow = tableElement => {
    const availableSelectedElements = tableElement.querySelectorAll(
      '.selected-onclick',
    );
    availableSelectedElements.forEach(selectedAvail => {
      const tdElement = selectedAvail.parentNode;
      tdElement &&
        (tdElement.onclick = e => {
          if (e.target.className.includes('ant-checkbox-input')) {
            return;
          }
          tdElement.parentNode?.children[SELECTED_COLUMN_INDEX]?.querySelector(
            '.ant-checkbox-input',
          )?.click();
        });
    });
  };

  const setupRowEvents = tableElement => {
    setupForceCloseExpandRow(tableElement);
    setupExpandRow(tableElement);
    setTimeout(() => setupSelectedRow(tableElement), 200);
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await request('product-service/seller/stores', {
        method: 'get',
      });
      setStores(response.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchWareHousing = async () => {
    setLoading(true);
    try {
      const response = await request(
        'product-service/seller/store-product/get-ware-house',
        {
          method: 'get',
        },
      );
      setWareHouse(response.data);
    } finally {
      setLoading(false);
    }
  };

  const getProducReqUrl = pagination => {
    let url = 'product-service/seller/store-product/listing';
    let queries = {
      page: pagination ? pagination.page : 0,
      page_size: PAGE_SIZE,
      ...form.getFieldsValue(),
    };
    const { sort_id } = queries;
    const sortFields = SORT.find(sort => sort.id === sort_id)?.fields;
    queries = { ...queries, ...(sortFields || {}) };
    delete queries.sort_id;
    const queryStrings = [];
    for (let attr in queries) {
      if (queries[attr]) {
        queryStrings.push(attr + '=' + queries[attr]);
      }
    }
    url += '?' + queryStrings.join('&');
    return url;
  };

  const fetchProducts = async params => {
    setLoading(true);
    const response = await request(getProducReqUrl(params), {
      method: 'get',
    });
    if (response.is_success) {
      setProductData({
        items: response.data,
        pagination: {
          ...response.pagination,
          current: response.pagination.page,
        },
      });
    }
    setLoading(false);
  };

  const onCheckVariation = (variation, isChecked) => {
    if (isChecked) {
      const newVariation = {
        ...variation,
        quantity: 1,
      };
      if (!valueChecked) {
        setValueChecked(variation.supplier_warehousing?.id);
        setSelectedVariations([...selectedVariations, newVariation]);
      } else {
        if (variation.supplier_warehousing?.id === valueChecked) {
          setSelectedVariations([...selectedVariations, newVariation]);
        } else {
          notification(
            'error',
            'Đơn hàng chỉ được phép có các sản phẩm của 1 kho hàng',
            'Sản phẩm được chọn không hợp lệ!',
            7,
          );
        }
      }
    } else {
      setSelectedVariations(
        selectedVariations.filter(
          selectedVariation =>
            selectedVariation.productId !== variation.productId ||
            selectedVariation.id !== variation.id,
        ),
      );
    }
    setShippingFee(0);
  };

  const onCheckProduct = (product, isChecked) => {
    if (isChecked) {
      const newProduct = {
        isNotVariation: true,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: product.product_variation[0].retail_price,
        thumb: product.thumb,
        total_quantity: product.quantity,
        quantity: 1,
        supplier_warehousing: product.supplier_warehousing,
        weight_grams: product.product_variation[0]?.weight_grams,
        origin_supplier_price: product.origin_supplier_price,
      };
      if (!valueChecked) {
        setValueChecked(product.supplier_warehousing?.id);
        setSelectedVariations([...selectedVariations, newProduct]);
      } else {
        if (product.supplier_warehousing?.id === valueChecked) {
          setSelectedVariations([...selectedVariations, newProduct]);
        } else {
          notification(
            'error',
            'Đơn hàng chỉ được phép có các sản phẩm của 1 kho hàng',
            'Sản phẩm được chọn không hợp lệ!',
            7,
          );
        }
      }
    } else {
      setSelectedVariations(
        selectedVariations.filter(
          selectedVariation => selectedVariation.productId !== product.id,
        ),
      );
    }
    setShippingFee(0);
  };

  const hasVariation = product => {
    return product.has_variation && product.number_of_variation > 0;
  };

  const isOutOfStock = product => {
    return (
      (product.quantity ?? product.total_quantity < 1) &&
      product.supplier_product_publish_status === 'inactive'
    );
  };

  const fetchProductVariations = async productId => {
    const currProductIndex = productData.items.findIndex(
      product => product.id === productId,
    );
    const currProduct = productData?.items?.[currProductIndex];
    const optionInfos = {};
    VARIATION_OPTION_FIELDS.forEach(field => {
      let optionInfo = null;
      const productOptionValue = currProduct[field];
      if (currProduct[field]) {
        optionInfo = VARIATION_OPTIONS.find(
          option => option.fieldValue === productOptionValue,
        );
      }
      if (optionInfo) {
        optionInfos[field] = optionInfo;
      }
    });

    if (
      currProduct &&
      (currProduct?.number_of_variation === 0 || currProduct.childrens)
    ) {
      return;
    }
    setCurrProductLoadingId(productId);
    const response = await request(
      `/product-service/seller/store-product/${productId}/variations`,
      {
        method: 'get',
      },
    );
    if (response.is_success) {
      const currProductClone = { ...currProduct };
      const childrens = [];
      response.data.forEach(variation => {
        const variations = [];
        for (let attr in optionInfos) {
          if (variation[attr]) {
            let variationValue = variation[attr];
            variationValue =
              variationValue[0]?.toUpperCase() + variationValue.substring(1);
            variations.push(optionInfos[attr].titleShowBefore + variationValue);
          }
        }
        const variationName = variations.join(' - ');
        const children = {
          key: variation.id,
          id: variation.id,
          product_variation_stock_id: variation.product_variation_stock_id,
          name: variationName,
          productId: productId,
          productName: currProduct.name,
          sku: variation.sku,
          price: variation.retail_price || variation.origin_supplier_price,
          thumb: variation.thumb,
          total_quantity: variation.total_quantity,
          supplier_warehousing: variation.supplier_warehousing,
          weight_grams: variation.weight_grams,
          origin_supplier_price: variation.origin_supplier_price,
        };
        childrens.push(children);
      });
      currProductClone.childrens = childrens;
      const productItemsClone = [...productData.items];
      productItemsClone[currProductIndex] = currProductClone;
      setProductData({ ...productData, items: productItemsClone });
    }
    setCurrProductLoadingId(null);
  };

  const gotoSearchProduct = () => {
    history.push('/products');
  };

  const productColumns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 56,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        return (
          <Tooltip
            title={
              valueChecked &&
              record.supplier_warehousing?.id !== valueChecked &&
              'Sản phẩm này không cùng kho hàng'
            }
          >
            <Checkbox
              className={
                $hasVariation && !$isOutOfStock
                  ? 'expand-onclick'
                  : $isOutOfStock
                  ? 'aria-disabled'
                  : 'selected-onclick'
              }
              aria-disabled={$hasVariation || $isOutOfStock}
              disabled={
                valueChecked && record.supplier_warehousing?.id !== valueChecked
              }
              checked={selectedVariationMap.productIds.has(record.id)}
              onChange={e =>
                !$hasVariation && onCheckProduct(record, e.target.checked)
              }
            ></Checkbox>
          </Tooltip>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 270,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={`product-name-wrapper ${
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }`}
            onClick={e => {
              if (
                valueChecked &&
                record.supplier_warehousing?.id !== valueChecked
              ) {
                notification(
                  'error',
                  'Đơn hàng chỉ được phép có các sản phẩm của 1 kho hàng',
                  'Sản phẩm được chọn không hợp lệ!',
                  7,
                );
              }
            }}
          >
            <img
              alt=""
              className="product-image"
              src={genImgUrl({
                location: record?.thumb?.location,
                width: PRODUCT_IMG_SIZE,
                height: PRODUCT_IMG_SIZE,
              })}
            ></img>
            <div className="product-name__text">
              <Tooltip
                // mouseEnterDelay={0.25}
                placement="bottomLeft"
                title={text}
              >
                <div className="product-name">{text}</div>
              </Tooltip>
              <div className="product-sku">{record.sku}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'publish_status',
      key: 'publish_status',
      width: 120,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        const publishStatus = PUBLISH_STATUS.find(status => status.id === text);
        return (
          <div
            className={
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }
          >
            {/* {publishStatus && (
              <BoxColor
                className="fulfillment-status font-df"
                notBackground
                colorValue={publishStatus?.color}
              >
                {publishStatus?.name}
              </BoxColor>
            )} */}
            {
              wareHouse?.filter(
                item => parseInt(item.id) === record.supplier_warehousing?.id,
              )[0]?.supplier_name
            }
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'store',
      key: 'store',
      // width: 100,
      render: (data, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        const platform = platforms.find(
          platform => platform.key === data?.platform,
        );
        return (
          <div
            className={
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : 'selected-onclick'
            }
            // className={
            //   $hasVariation
            //     ? 'expand-onclick'
            //     : $isOutOfStock
            //     ? 'aria-disabled'
            //     : 'selected-onclick'
            // }
          >
            {platform && (
              <div className="store-platform">
                <img
                  alt={platform?.name}
                  src={platform?.icon}
                  className="store-platform__icon"
                />
                <span className="store-platform__name">{platform?.name}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'store',
      key: 'store',
      width: 150,
      render: (data, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        const store = record?.store;
        return (
          <div
            className={
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }
          >
            {store?.name && (
              <div className="store-info_content">
                <Image alt="" src={store?.logo} className="store-icon" />
                <span className="store-name">{store?.name}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'number_of_variation',
      key: 'number_of_variation',
      width: 115,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        // let countSelected = 0;
        // selectedVariations.forEach(variation => {
        //   if (variation.productId === record.id) {
        //     countSelected++;
        //   }
        // });
        return (
          <div
            className={`product-variations-number ${
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }`}
          >
            {$isOutOfStock ? (
              <span className="out-of-stock">Hết hàng</span>
            ) : $hasVariation ? (
              <>
                {/* <span
                  className={countSelected ? 'count-non-zero' : 'count-zero'}
                >
                  {countSelected}
                </span>
                <span> / {text}</span>&nbsp; biến thể */}
                <span>{text}</span>&nbsp; biến thể
              </>
            ) : (
              // <span className="no-variation">SP 0 biến thể</span>
              <span className="no-variation">0 biến thể</span>
            )}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'product_variation',
      key: 'product_variation',
      width: 130,
      render: (text, record) => {
        const $hasVariation = hasVariation(record);
        const $isOutOfStock = isOutOfStock(record);
        const list = uniq(text?.map(item => item.retail_price));
        return (
          <div
            className={`product-min-price ${
              $hasVariation && !$isOutOfStock
                ? 'expand-onclick'
                : $isOutOfStock
                ? 'aria-disabled'
                : 'selected-onclick'
            }`}
          >
            {list.length > 1
              ? `${formatMoney(min(list))} - ${formatMoney(max(list))}`
              : formatMoney(text[0].retail_price)}
          </div>
        );
      },
    },
  ];

  const variationColumns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 30,
      render: (text, record) => {
        const $isOutOfStock = isOutOfStock(record);
        return (
          <Checkbox
            aria-disabled={$isOutOfStock}
            disabled={
              valueChecked && record.supplier_warehousing?.id !== valueChecked
            }
            className={$isOutOfStock ? 'aria-disabled' : 'selected-onclick'}
            checked={selectedVariationMap.variationIds.has(record.id)}
            onChange={e => onCheckVariation(record, e.target.checked)}
          ></Checkbox>
        );
      },
    },
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text, record) => {
        const $isOutOfStock = isOutOfStock(record);
        return (
          <span
            className={$isOutOfStock ? 'aria-disabled' : 'selected-onclick'}
          >
            {text}
            {$isOutOfStock && (
              <span className="out-of-stock variation-out-of-stock">
                Hết hàng
              </span>
            )}
          </span>
        );
      },
    },
    {
      title: '',
      dataIndex: 'sku',
      key: 'sku',
      width: 300,
      render: (text, record) => {
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={`variation-sku ${
              $isOutOfStock ? 'aria-disabled' : 'selected-onclick'
            }`}
          >
            {text || 'Không có SKU'}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'price',
      key: 'price',
      // width: 200,
      render: (text, record) => {
        const $isOutOfStock = isOutOfStock(record);
        return (
          <div
            className={`variation-price ${
              $isOutOfStock ? 'aria-disabled' : 'selected-onclick'
            }`}
          >
            {formatMoney(text)}
          </div>
        );
      },
    },
  ];

  const modalFooter = (
    <div className="modal-footer-wrapper">
      <Pagination
        hideOnSinglePage
        showSizeChanger={false}
        {...productData.pagination}
        className="footer-pagination"
        onChange={(page, pageSize) => {
          fetchProducts({ page, pageSize });
        }}
      ></Pagination>
      <div className="footer-action">
        <Space size={14}>
          <Button
            disabled={isLoading}
            className="btn-cancel btn-sm"
            color="grayBlue"
            width="60px"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button className="btn-sm p-0" width="100px" onClick={onCancel}>
            Đồng ý
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <ListProductModal
      title="Chọn biến thể sản phẩm từ danh sách sản phẩm đã chọn và sản phẩm đang bán"
      transitionName=""
      width={920}
      footer={modalFooter}
      onCancel={onCancel}
      {...rest}
    >
      <div className="product-title-top">
        <span className="search-external-wrapper">
          <span className="search-external" onClick={gotoSearchProduct}>
            + Tìm từ nhà cung cấp
          </span>
        </span>
        {/* <div>+ Đơn hàng chỉ được phép có các sản phẩm của một kho hàng.</div>
        <div>
          + Nếu đơn hàng có nhiều sản phẩm thuộc nhiều kho khác nhau, Vui lòng
          tạo nhiều đơn hàng với sản phẩm tương ứng với từng kho hàng.
        </div> */}
      </div>
      <Spin spinning={isLoading && !productData.items}>
        <ListProductWrapper className="box-df">
          <div className="products-toolbar-top">
            <Form name="products-toolbar-top" form={form}>
              <div
                className="product-warehouse"
                style={{ marginBottom: '10px' }}
              >
                <Form.Item name="ware_house">
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.children[0]
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Vui lòng chọn kho hàng"
                    onSelect={fetchProducts}
                    value={wareHouse?.id}
                  >
                    <Option key="" value="">
                      Vui lòng chọn kho hàng
                    </Option>
                    {wareHouse?.map(item => (
                      <Option value={item.id} key={item.id}>
                        {[item.supplier_name, item.ware_house_name].join(' - ')}
                        <div style={{ fontSize: '12px', color: '#6C798F' }}>
                          Địa chỉ:{' '}
                          {[
                            item.address,
                            item.ward_name,
                            item.distinct_name,
                            item.province_name,
                          ]
                            .filter(address => address)
                            ?.join(', ')}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="products-toolbar">
                <div className="filter-input-wrapper">
                  <Form.Item
                    name="keyword"
                    rules={[
                      {
                        min: KEY_WORD_MIN_LENGTH,
                        message: `Nội dung tìm kiếm ít nhất ${KEY_WORD_MIN_LENGTH} kí tự`,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Tìm sản phẩm theo tên, sku"
                      className="filter-input"
                      onChange={e => {
                        changeFilter(e.target.value);
                      }}
                    ></Input>
                  </Form.Item>
                </div>
                <div className="product-top-right">
                  <div className="product-filter-wrapper">
                    <Form.Item name="platform">
                      <Select
                        className="platform-select"
                        onChange={fetchProducts}
                      >
                        <Option key="" value="">
                          Nền tảng
                        </Option>
                        {platforms
                          .filter(platform =>
                            ['shopee', 'lazada', 'tiktok'].includes(
                              platform.key,
                            ),
                          )
                          .map(platform => (
                            <Option key={platform.key} value={platform.key}>
                              {platform.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="store_id">
                      <Select className="store-select" onChange={fetchProducts}>
                        <Option key="" value="">
                          Cửa hàng
                        </Option>
                        {stores.map(store => (
                          <Option key={store.id} value={store.id}>
                            {store.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {/* <Form.Item name="publish_status">
                      <Select
                        className="publish-status-select"
                        onChange={fetchProducts}
                      >
                        <Option key="" value="">
                          Trạng thái
                        </Option>
                        {PUBLISH_STATUS_FILTER.map(status => (
                          <Option key={status.value} value={status.value}>
                            {status.text}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item> */}
                  </div>
                  <div className="product-sort-wrapper">
                    <Form.Item name="sort_id">
                      <Select className="sort-select" onChange={fetchProducts}>
                        <Option key="" value="">
                          Sắp xếp
                        </Option>
                        {SORT.map(sort => (
                          <Option key={sort.id} value={sort.id}>
                            {sort.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </div>
          <Scrollbars
            autoHide
            autoHideTimeout={300}
            autoHideDuration={300}
            heightRelativeToParent="100%"
            style={{ height: 'calc(100% - 50px)' }}
          >
            <div ref={productTableContainer}>
              <Table
                className="product-tbl"
                columns={productColumns}
                dataSource={productData.items}
                pagination={false}
                rowKey={record => record.id}
                expandable={{
                  rowExpandable: record => hasVariation(record),
                  expandIconColumnIndex: EXPANDED_COLUMN_INDEX,
                  expandedRowClassName: record => {
                    return !record.childrens ? 'force-close-expand' : '';
                  },
                  columnWidth: 0,
                  expandedRowRender: (record, expanded) => {
                    if (record.id === currProductLoadingId) {
                      return (
                        <span className="variation-desc">Đang tải ...</span>
                      );
                    }
                    return isEmpty(record?.childrens) && !isLoading ? (
                      <span className="variation-desc">Không có biến thể</span>
                    ) : (
                      <Table
                        className="variation-tbl"
                        columns={variationColumns}
                        pagination={false}
                        dataSource={record?.childrens || []}
                      ></Table>
                    );
                  },
                  expandIcon: ({ expanded, onExpand, record }) =>
                    hasVariation(record) ? (
                      <i
                        className={`expand-icon expand-btn fa fa-chevron-down ${
                          expanded ? 'expaned' : ''
                        }`}
                        onClick={e => {
                          if (
                            valueChecked &&
                            record.supplier_warehousing?.id !== valueChecked
                          ) {
                            notification(
                              'error',
                              'Đơn hàng chỉ được phép có các sản phẩm của 1 kho hàng',
                              'Sản phẩm được chọn không hợp lệ!',
                              7,
                            );
                          } else {
                            if (!expanded) {
                              fetchProductVariations(record.id);
                            }
                            onExpand(record, e);
                          }
                        }}
                      >
                        {record?.variations}
                      </i>
                    ) : (
                      <span className="selected-onclick"></span>
                    ),
                }}
              />
            </div>
          </Scrollbars>
        </ListProductWrapper>
      </Spin>
    </ListProductModal>
  );
});

export const ListProductModal = styled(Modal)`
  top: 50%;
  transform: translateY(-50%) !important;
  height: calc(100% - 2 * 87px);
  .ant-modal-content {
    height: 100%;
  }
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .ant-spin-nested-loading > div > .ant-spin {
    min-height: unset;
  }
  .ant-modal-header {
    position: relative;
    height: 55px;
    padding: 0 24px;
    display: flex;
    align-items: center;
  }
  .ant-modal-body {
    height: calc(100% - 53px - 99px);
    padding: 0;
  }
  .ant-modal-footer {
    background: #fff;
    margin-top: 62px;
    padding: 15px 25px;
    z-index: 2;
    position: relative;
    min-height: 57px;
  }
  .modal-footer-wrapper {
    display: flex;
    line-height: 1;
  }
  .footer-pagination {
    /* margin-left: auto; */
    .ant-pagination-item-link {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ant-pagination-item-link,
    .ant-pagination-item {
      border-radius: 4px;
      font-family: 'Roboto';
    }
    .ant-pagination-item-active {
      background: #435ebe;
      font-weight: 400;
      border-color: #435ebe;
      a {
        color: #fff;
      }
    }
  }
  .footer-action {
    margin-left: auto;
  }

  .product-title-top {
    padding: 0 24px;
  }

  .search-external-wrapper {
    color: ${({ theme }) => theme.darkBlue1};
    position: absolute;
    top: 0;
    left: 615px;
    /* transform: translateX(-50%); */
    height: 55px;
    display: flex;
    align-items: center;
    .search-external {
      position: relative;
      padding-left: 18px;
      cursor: pointer;
      :after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        height: 20px;
        width: 1px;
        transform: translateY(-50%);
        background: #ebebf0;
      }
    }
  }
`;

const ListProductWrapper = styled.div`
  height: 100%;
  .ant-select-lg {
    font-size: 14px;
  }
  .ant-select-single.ant-select-lg:not(.ant-select-customize-input):not(.ant-select-customize-input)
    .ant-select-selection-search-input,
  .ant-select-single.ant-select-lg,
  .ant-select-single.ant-select-lg:not(.ant-select-customize-input)
    .ant-select-selector {
    height: 36px !important;
  }
  .ant-select-single.ant-select-lg:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-item {
    line-height: 36px;
  }
  .ant-select-selection-placeholder {
    color: ${({ theme }) => theme.text};
    line-height: 36px;
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }
  .ant-checkbox-inner {
    border-radius: 4px;
  }
  .ant-checkbox-checked {
    &:after {
      border: none;
    }
    & > .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.primary};
      border-color: transparent;
      border-radius: 4px;
    }
  }
  .ant-checkbox-wrapper {
    color: ${({ theme }) => theme.primary};
  }
  .ant-checkbox + span {
    padding-right: 0;
    padding-left: 7px;
    color: ${({ theme }) => theme.grayBlue};
  }
  .products-toolbar-top {
    padding: 20px 25px;
    border-bottom: 1px solid #ebebf0;
    .ant-form-item {
      margin-bottom: 0;
    }
    .ant-form-item-explain {
      position: absolute;
      top: 100%;
    }
  }
  .filter-input-wrapper {
    position: relative;
    &:before {
      position: absolute;
      z-index: 1;
      content: '\f002';
      color: #7c8db5;
      font-family: 'Font Awesome 5 Pro';
      font-size: 12px;
      top: 0;
      left: 0;
      height: 100%;
      padding: 0 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #7c8db5;
    }
    .filter-input {
      border: 1px solid #ebebf0;
      border-radius: 4px;
      width: 270px;
      height: 36px;
      padding-left: 30px;
    }
  }
  .products-toolbar {
    display: flex;
    .product-top-right {
      display: flex;
      margin-left: auto;
      .platform-select {
        width: 137px;
      }
      .ant-select-selector {
        box-shadow: none !important;
      }
      .product-filter-wrapper {
        display: flex;
        & > div .ant-select-selector {
          border-radius: 0 !important;
        }
        & > div:not(:last-child) .ant-select-selector {
          border-right: none;
        }
        & > div:first-child .ant-select-selector {
          border-radius: 4px 0px 0px 4px !important;
        }
        & > div:last-child .ant-select-selector {
          border-radius: 0 4px 4px 0 !important;
        }
      }
      .product-sort-wrapper {
        margin-left: 14px;
      }
      .store-select {
        width: 136px;
      }
      .publish-status-select {
        width: 110px;
      }
      .sort-select {
        width: 135px;
      }
    }
  }

  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table-wrapper,
  .ant-table-container {
    height: 100%;
  }
  .ant-table-expanded-row {
    background: #fafafa;
  }

  .product-tbl {
    label.aria-disabled {
      pointer-events: none;
      cursor: not-allowed;
    }
    cursor: pointer;
    .float-right {
      text-align: right;
    }
    .ant-table-placeholder .ant-table-cell {
      border-bottom: none;
    }
    .ant-table-tbody > tr.ant-table-row:hover > td {
      background: #fff;
    }
    .ant-table-tbody > tr > td:first-child {
      padding-left: 25px;
      padding-right: 15px;
    }
    .ant-table-tbody > tr > td:nth-child(${PRICE_COLUMN_INDEX + 1}) {
      padding-right: 25px;
    }
    .ant-table-tbody > tr > td:nth-child(2) {
      padding-left: 0;
    }
    .ant-table-thead > tr > td:nth-child(${EXPANDED_COLUMN_INDEX + 1}),
    .ant-table-tbody > tr > td:nth-child(${EXPANDED_COLUMN_INDEX + 1}) {
      display: none;
    }
    .ant-table-thead {
      display: none;
    }
    .ant-table-body {
      overflow-y: auto !important;
      height: 100%;
    }
    table {
      width: 100% !important;
      margin-bottom: 55px;
    }
    .product-name-wrapper {
      display: flex;
      align-items: center;
      .product-image {
        width: ${PRODUCT_IMG_SIZE}px;
        height: ${PRODUCT_IMG_SIZE}px;
        flex-grow: 0;
        flex-shrink: 0;
        border-radius: 4px;
        border: 1px solid #f0efef;
        background: #eee;
      }
      .product-name__text {
        letter-spacing: 0.02rem;
        margin-left: 8px;
        .product-name {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }
      }
      .product-sku {
        font-size: 12px;
        color: ${({ theme }) => theme.gray3};
      }
    }
    .product-min-price,
    .product-variations-number {
      text-align: right;
      word-break: keep-all;
    }
    .product-min-price {
      color: ${({ theme }) => theme.orange};
    }
    .expand-icon {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f3f3f3;
      border-radius: 100%;
      cursor: pointer;
      transition: all ease-out 0.25s;
      &.expaned {
        transform: rotate(-90deg);
      }
    }
    .variation-desc {
      color: ${({ theme }) => theme.gray3};
    }
    .ant-table-row.ant-table-row-level-0 .ant-table-expanded-row {
      position: relative;
      &:before {
        content: '';
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        background: red;
      }
    }
    .no-variation,
    .count-zero {
      color: #bbb;
    }
    .out-of-stock {
      color: red;
      background: #ffe4e4;
      padding: 1.5px 5px;
      border-radius: 4px;
      font-size: 12px;
    }
    .variation-out-of-stock {
      margin-left: 7px;
    }
    .count-non-zero {
      color: #3b6aff;
    }
    .store-platform {
      display: flex;
      align-items: center;
      .store-platform__icon {
        height: 14px;
        width: 14px;
      }
      .store-platform__name {
        word-break: keep-all;
        margin-left: 6px;
        color: ${({ theme }) => theme.primary};
      }
    }
    .store-info_content {
      display: flex;
      align-items: center;
      .store-icon {
        border-radius: 100%;
        flex-grow: 1;
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        border: 1px solid rgb(225, 225, 225);
      }
      .store-name {
        margin-left: 5px;
        line-height: 1.3;
      }
    }
    .fulfillment-status {
      width: unset;
      word-break: keep-all;
    }
  }
  .variation-tbl {
    margin: 0;
    .ant-table-container {
      background: #fafafa;
    }
    .ant-table-tbody > tr.ant-table-row:hover > td {
      background: #fafafa;
    }
    table {
      margin-bottom: 0 !important;
    }
    .ant-table {
      margin-left: 0 !important;
    }

    .ant-table-tbody > tr > td:first-child {
      padding-left: 0;
    }
    .ant-table-thead {
      display: none;
    }
    .variation-sku {
      font-size: 12px;
      text-align: right;
      color: ${({ theme }) => theme.gray3};
      text-align: left;
    }
    .variation-price {
      text-align: right;
      padding-right: 10px;
    }
  }
`;
