import React, { memo } from 'react';
import { CustomStyle } from 'styles/commons';
// import { useSelector, useDispatch } from 'react-redux';
import {
  newOrder,
  processOrder,
  lowInventory,
  denyIcon,
} from 'assets/images/dashboards';
import BoxList from 'app/components/BoxList';
// import { selectListStores } from '../slice/selectors';

const dataOrder = [
  {
    icon: newOrder,
    title: 'Đơn chờ xử lý',
    total: 'order_pending',
    hint: 'Số lượng đơn hàng mới',
    link: '/orders?odii_status=2&fulfillment_status=pending&page=1',
  },
  {
    icon: processOrder,
    title: 'Đơn chờ lấy hàng',
    total: 'order_awaiting_collection',
    hint: 'Số lượng đơn hàng đang được tiến hành',
    link: '/orders?odii_status=3&page=1',
  },
  {
    icon: lowInventory,
    title: 'Đơn trả hàng',
    total: '',
    hint: 'Đang phát triển',
    link: '/dashboard',
  },
  {
    icon: denyIcon,
    title: 'Sản phẩm không hoạt động',
    total: 'product_inactive',
    hint: 'Số lượng sản phẩm không được duyệt',
    colorBox: '#EB5757',
    link: '/selling-products?page=1&status=0&odii_status=0',
    width: '258px',
  },
];

export default memo(function ImportantWork(props) {
  return (
    <CustomStyle style={{ marginBottom: 24.49 }}>
      <BoxList
        initData={dataOrder}
        data={props.data}
        title="Việc cần làm"
        row="row"
      />
    </CustomStyle>
  );
});
