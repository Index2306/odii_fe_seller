import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Button } from 'app/components';
import Confirm from 'app/components/Modal/Confirm';
import { Row, Col, Form as F, Space, Spin } from 'antd';

import ListProduct from '../../Components/Create/ListProduct';

import PaymentInfo from '../../Components/Create/PaymentInfo';
import CustomerInfo from '../../Components/Create/CustomerInfo';
import StoreInfo from '../../Components/Create/StoreInfo';
import SaveCustomer from '../../Components/Create/SaveCustomer';
import SaveAddress from '../../Components/Create/SaveAddress';

import { isEmpty } from 'lodash';
import ListOrderItem, {
  KEY_WORD_MIN_LENGTH,
} from '../../Components/Create/ListOrderItem';
import request from 'utils/request';
import { formatMoney } from 'utils/helpers';

import { PageWrapperDefault } from '../../styles/OrderDetail';
import styled from 'styled-components/macro';
import ShipmentInfo from '../../Components/Create/ShipmentInfo';

const Item = F.Item;

const PAYMENT_STATUS_PAID = 'paid';

const LIST_PRODUCT_MODAL_KEY = 'LIST_PRODUCT_MODAL';
const CREATE_ORDER_CONFIRM_MODAL_KEY = 'CREATE_ORDER_CONFIRM_MODAL';
const WARNING_MONEY_MODAL_KEY = 'WARNING_MONEY_MODAL';
export const SAVE_CUSTOMER_MODAL_KEY = 'SAVE_CUSTOMER_MODAL';
export const SAVE_ADDRESS_MODAL_KEY = 'SAVE_ADDRESS_MODAL';
export const CREATE_CUSTOMER_TYPE = 'CREATE_CUSTOMER';
export const UPDATE_CUSTOMER_TYPE = 'UPDATE_CUSTOMER';

export function CreateOrder({ match, history }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [saveType, setSaveType] = useState(null);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [shippingNote, setShippingNote] = useState('');
  const [storeId, setStoreId] = useState(null);
  const [storeSource, setStoreSource] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [valueChecked, setValueChecked] = useState('');
  const [shipmentService, setShipmentService] = useState(null);
  const [dataShipment, setDataShipment] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [insuranceFee, setInsuranceFee] = useState(0);
  const [onlyShipFee, setOnlyShipFee] = useState(0);
  const [balance, setBalance] = useState();

  const modals = [
    {
      key: CREATE_ORDER_CONFIRM_MODAL_KEY,
      getContent: () => (
        <Confirm
          key={CREATE_ORDER_CONFIRM_MODAL_KEY}
          isFullWidthBtn
          isModalVisible={true}
          color="blue"
          title="Xác nhận tạo đơn hàng"
          data={{
            message: getConfirmCreateMessage(),
          }}
          handleConfirm={saveOrder}
          handleCancel={() =>
            toggleConfirmModal(CREATE_ORDER_CONFIRM_MODAL_KEY)
          }
        />
      ),
    },
    {
      key: LIST_PRODUCT_MODAL_KEY,
      getContent: () => (
        <ListProduct
          key={LIST_PRODUCT_MODAL_KEY}
          keywordFilter={keywordFilter}
          setKeywordFilter={setKeywordFilter}
          visible={true}
          onCancel={() => setCurrModalKey(null)}
          selectedVariations={selectedVariations}
          setSelectedVariations={setSelectedVariations}
          valueChecked={valueChecked}
          setValueChecked={setValueChecked}
          setShippingFee={setShippingFee}
        ></ListProduct>
      ),
    },
    {
      key: SAVE_CUSTOMER_MODAL_KEY,
      getContent: () => (
        <SaveCustomer
          key={SAVE_CUSTOMER_MODAL_KEY}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          saveType={saveType}
          visible={true}
          onCancel={() => {
            setCurrModalKey(null);
          }}
          onFinish={() => {
            setCurrModalKey(null);
            setShippingFee(0);
          }}
        ></SaveCustomer>
      ),
    },
    {
      key: SAVE_ADDRESS_MODAL_KEY,
      getContent: () => (
        <SaveAddress
          key={SAVE_ADDRESS_MODAL_KEY}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          visible={true}
          onCancel={() => {
            setCurrModalKey(null);
          }}
          onFinish={() => {
            setCurrModalKey(null);
            setShippingFee(0);
          }}
        ></SaveAddress>
      ),
    },
    {
      key: WARNING_MONEY_MODAL_KEY,
      getContent: () => (
        <Confirm
          key={WARNING_MONEY_MODAL_KEY}
          isFullWidthBtn
          isModalVisible={true}
          color="blue"
          title="Số dư tài khoản của bạn không đủ"
          data={{
            message: getConfirmWarningMoney(),
          }}
          handleConfirm={() => {
            history.push('/mywallet/deposit');
          }}
          handleCancel={() => setCurrModalKey(null)}
        />
      ),
    },
  ];

  const [currModalKey, setCurrModalKey] = useState(null);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Đơn hàng',
          link: '/orders',
        },
        {
          name: 'Tạo đơn hàng',
        },
      ],
      fixWidth: true,
      title: 'Tạo đơn hàng',
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            <Space size={14}>{getPageAction()}</Space>
          </div>
        </Item>
      ),
    };

    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, [
    paymentStatus,
    selectedVariations,
    currModalKey,
    customerInfo,
    shippingNote,
    isLoading,
    shippingFee,
  ]);

  const gotoList = () => {
    history.push('/orders');
  };

  const toggleConfirmModal = modalKey => {
    if (currModalKey) {
      setCurrModalKey(null);
    } else {
      setCurrModalKey(modalKey);
    }
  };

  const totalOrderItemsPrice = selectedVariations?.reduce(
    (total, variation) => {
      return total + variation.quantity * variation.origin_supplier_price;
    },
    paymentStatus === PAYMENT_STATUS_PAID ? shippingFee : 0,
  );

  const getConfirmCreateMessage = () => {
    const total_price = formatMoney(totalOrderItemsPrice);
    return (
      <span>
        Bạn có chắc chắn muốn trả cho Odii&nbsp;
        <SpanPrice>{total_price}</SpanPrice>
        <br></br>để tạo đơn hàng này không?
      </span>
    );
  };

  const getConfirmWarningMoney = () => {
    return (
      <span>
        Số dư hiện tại: <SpanPrice>{formatMoney(balance)}</SpanPrice>
        <br></br>Vui lòng nạp thêm tiền vào ví để khởi tạo đơn hàng
      </span>
    );
  };

  const getPageAction = () => {
    return (
      <Space size={14}>
        <Button
          disabled={isLoading}
          className="btn-cancel btn-sm"
          color="grayBlue"
          width="60px"
          onClick={gotoList}
        >
          Hủy
        </Button>
        <Button
          disabled={
            isEmpty(selectedVariations) ||
            isEmpty(customerInfo) ||
            isLoading ||
            shippingFee == 0
          }
          className="btn-sm p-0"
          width="110px"
          onClick={handleCreateOrder}
        >
          Tạo đơn ngay
        </Button>
      </Space>
    );
  };

  const getShippingAddress = (separator = ', ') => {
    const addressParts = [
      customerInfo?.address1,
      customerInfo?.ward_name,
      customerInfo?.district_name,
      customerInfo?.province_name,
    ].filter(address => address);
    return addressParts.join(separator);
  };

  const fetchVariation = async productId => {
    const response = await request(
      `/product-service/seller/store-product/${productId}/variations`,
      {
        method: 'get',
      },
    );
    if (response.is_success) {
      return response.data?.[0];
    }
    return null;
  };

  const getTotalItemsPrice = () => {
    let totalPrice = 0;
    selectedVariations?.forEach(variation => {
      totalPrice += variation.quantity * variation.price;
    });
    if (shippingFee) {
      totalPrice += shippingFee;
    }
    return totalPrice;
  };

  const getOrderItems = async () => {
    let orderItems = [];
    for (let variation of selectedVariations) {
      const orderItem = {
        product_variation_stock_id: variation.product_variation_stock_id,
        quantity: variation.quantity,
        retail_price: variation.price,
      };
      if (variation.isNotVariation) {
        const $variation = await fetchVariation(variation.productId);
        orderItem.product_variation_stock_id =
          $variation.product_variation_stock_id;
      }
      orderItems.push(orderItem);
    }
    return orderItems;
  };

  const handleCreateOrder = () => {
    // if (paymentStatus === PAYMENT_STATUS_PAID) {
    //   toggleConfirmModal(CREATE_ORDER_CONFIRM_MODAL_KEY);
    // } else {
    //   saveOrder();
    // }
    toggleConfirmModal(CREATE_ORDER_CONFIRM_MODAL_KEY);
  };

  const saveOrder = async () => {
    setLoading(true);
    const data = {
      ...(shippingNote ? { note: shippingNote } : {}),
      ...(storeId ? { store_id: storeId } : {}),
      ...(storeSource ? { store_source: storeSource } : {}),
      customer_full_name: customerInfo.full_name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone_number,
      customer_id: customerInfo.id,
      currency_code: customerInfo?.location_country_data?.currency,
      total_retail_price: getTotalItemsPrice(),
      total_insurance_fee: insuranceFee,
      payment_method: 'COD',
      payment_status: paymentStatus,
      total_shipping_fee: shippingFee,
      shipment_provider: shipmentService ? 'GHN' : 'GHTK',
      shipping_address: {
        address1: getShippingAddress(),
        province_id: customerInfo.province_id,
        province_name: customerInfo.province_name,
        district_id: customerInfo?.district_id?.toString(),
        district_name: customerInfo?.district_name,
        ward_id: customerInfo?.ward_id?.toString(),
        ward_name: customerInfo?.ward_name,
        country: customerInfo?.country_name,
        country_id: customerInfo?.country_id?.toString(),
        service_id: shipmentService,
      },
      order_items: await getOrderItems(),
    };
    try {
      const response = await request('oms/seller/order', {
        method: 'post',
        data,
      });
      if (response.is_success) {
        gotoList();
      }
    } catch (e) {
      if (!e.data.is_success && e.data.balance >= 0) {
        setCurrModalKey(WARNING_MONEY_MODAL_KEY);
        setBalance(e.data.balance);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapperDefault fixWidth>
      <Spin spinning={isLoading}>
        <Row gutter="26">
          <Col span={16}>
            <ListOrderItem
              selectedVariations={selectedVariations}
              setSelectedVariations={setSelectedVariations}
              keywordFilter={keywordFilter}
              setKeywordFilter={setKeywordFilter}
              onSearch={() => {
                if (
                  keywordFilter.length !== 0 &&
                  keywordFilter.length < KEY_WORD_MIN_LENGTH
                ) {
                  return;
                }
                setCurrModalKey(LIST_PRODUCT_MODAL_KEY);
              }}
              setShippingFee={setShippingFee}
            ></ListOrderItem>
            <PaymentInfo
              selectedVariations={selectedVariations}
              customerInfo={customerInfo}
              shippingFee={shippingFee}
              onlyShipFee={onlyShipFee}
              insuranceFee={insuranceFee}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              setCustomerInfo={setCustomerInfo}
              setDataShipment={setDataShipment}
            ></PaymentInfo>
            <div className="page-action">{getPageAction()}</div>
          </Col>
          <Col span={8}>
            <CustomerInfo
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              shippingNote={shippingNote}
              setShippingNote={setShippingNote}
              showSaveModal={(modalkey, saveType) => {
                saveType && setSaveType(saveType);
                setCurrModalKey(modalkey);
              }}
            ></CustomerInfo>
            <ShipmentInfo
              dataShipment={dataShipment}
              setShipmentService={setShipmentService}
              setShippingFee={setShippingFee}
              setInsuranceFee={setInsuranceFee}
              setOnlyShipFee={setOnlyShipFee}
            />
            <StoreInfo
              setStoreId={setStoreId}
              setStoreSource={setStoreSource}
            ></StoreInfo>
          </Col>
        </Row>
        {modals.map(
          modal => currModalKey === modal.key && modal.getContent({}),
        )}
      </Spin>
    </PageWrapperDefault>
  );
}

const SpanPrice = styled.span`
  color: orange;
  font-weight: bold;
`;
