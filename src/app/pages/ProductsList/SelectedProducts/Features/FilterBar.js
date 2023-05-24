import React, { memo, useRef, useState, useMemo, useEffect } from 'react';
import { Row, Col, Space } from 'antd';
import styled from 'styled-components';
import { Input, Select, Button, Checkbox } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/Filter';
import { useShouldRedirectToLastPage } from 'app/hooks/useValidateQuerySearch';
import Confirm from 'app/components/Modal/Confirm';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { isEmpty } from 'lodash';
import { CustomStyle } from 'styles/commons';
import { useSelector, useDispatch } from 'react-redux';
import { deleteIcon, arrowUp, edit, copy } from 'assets/images/icons';
import { defaultImage } from 'assets/images';
import notification from 'utils/notification';
import {
  selectListSelected,
  selectData,
  selectPagination,
  selectDetails,
} from '../slice/selectors';
import { useSelectedProductsSlice } from '../slice';

// import { SearchOutlined } from '@ant-design/icons';

import constants from 'assets/constants';
const { Option } = Select;

const initState = {
  keyword: '',
  status: '',
  store_id: '',
  platform: '',
  supplier: '',
};

const FilterBar = memo(function FilterBar({
  isLoading,
  history,
  showAction,
  listStores,
  gotoPage,
  showActionListCard,
}) {
  const [filter, setFilter] = useState(initState);
  const ref = useRef(null);
  const dispatch = useDispatch();
  // const data = useSelector(selectData);
  const details = useSelector(selectDetails);
  const listSelected = useSelector(selectListSelected);
  const pagination = useSelector(selectPagination);
  const { actions } = useSelectedProductsSlice();

  const location = useShouldRedirectToLastPage(filter);
  useEffect(() => {
    // gotoPage(location.search);
  }, [location.search]);

  const currentList = useMemo(() => {
    if (isEmpty(details)) return [];
    return details.filter(v => listSelected.includes(v.id));
  }, [details, listSelected]);

  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const handleConfirm = () => {
    const url = `?page=1&page_size=10${Object.keys(filter)?.reduce((f, v) => {
      return filter[v] ? `${f}&${v}=${filter[v]}` : f;
    }, '')}`;
    dispatch(
      actions.deleteList({
        listData: listSelected,
        url,
      }),
    );
  };

  const handleAction = e => {
    const url = `?page=1&page_size=10${Object.keys(filter)?.reduce((f, v) => {
      return filter[v] ? `${f}&${v}=${filter[v]}` : f;
    }, '')}`;
    switch (e) {
      case 1:
        // dispatch(actions.getDetailDone([]));
        history.push(`/selected-products/update?ids=${listSelected.join(',')}`);
        return;
      case 2:
        const detailSelected = details.filter(item =>
          listSelected.includes(item.id),
        );
        let lowProduct = null;
        for (let prod of detailSelected) {
          const lowVariation = prod?.variations.find(
            item =>
              item.low_retail_price > 0 &&
              item.low_retail_price > item.retail_price,
          );
          if (lowVariation) {
            lowProduct = prod;
            break;
          }
        }
        if (lowProduct) {
          notification(
            'error',
            `Sản phẩm "${lowProduct.name}" có giá bán thấp hơn giá cho phép từ nhà cung cấp`,
          );
          return;
        }
        dispatch(
          actions.pushStoresInList({
            listData: currentList,
            url,
          }),
        );
        // history.go(0);
        return;
      case 3:
        dispatch(
          actions.duplicateProducts({
            listData: listSelected,
            url,
          }),
        );
        return;
      case 4:
        dispatch(
          globalActions.showModal({
            modalType: Confirm,
            modalProps: {
              isFullWidthBtn: true,
              isModalVisible: true,
              title: 'Xác nhận xoá',
              color: 'red',
              data: {
                message: `Bạn có chắc chắn muốn xoá các sản phẩm đã chọn?`,
              },
              callBackConfirm: handleConfirm,
            },
          }),
        );
        // toggleConfirmModal(!isShowConfirmStatus);
        return;

      default:
        return;
    }
  };

  const onSelectAll = e => {
    const newList = e.target.checked ? details.map(v => v.id) : [];
    dispatch(actions.setListSelected(newList));
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
      // component={
      //   <Row>
      //     <Col xs={24} lg={20}>
      //       <Input
      //         placeholder="Nhập từ khoá"
      //         allowClear
      //         disabled={isLoading}
      //         prefix={<SearchOutlined />}
      //         // onPressEnter={onSearch}
      //         value={filter.keyword}
      //         onChange={handleFilter('keyword')}
      //       />
      //     </Col>
      //     <Col xs={24} lg={8}></Col>
      //   </Row>
      // }
    >
      <Row gutter={8}>
        <Col xs={24} lg={10}>
          <Row gutter={10}>
            <Col xs={24} lg={13}>
              <Input
                placeholder="Nhập từ khoá"
                allowClear
                size="medium"
                color="#7C8DB5"
                disabled={isLoading}
                prefix={<SearchOutlined />}
                // onPressEnter={onSearch}
                value={filter.keyword}
                onChange={handleFilter('keyword')}
              />
            </Col>
            <Col xs={24} lg={11} className="d-flex">
              <CustomStyle
                display="flex"
                alignItems="center"
                border="1px solid"
                borderColor="stroke"
                borderRadius="4px"
                px="s3"
              >
                <CustomCheckbox
                  className="option-to-new"
                  checked={
                    pagination?.total === listSelected?.length ||
                    listSelected?.length === pagination?.page_size
                  }
                  onChange={onSelectAll}
                >
                  Chọn tất cả
                </CustomCheckbox>
              </CustomStyle>
            </Col>
          </Row>
        </Col>
        <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              {showActionListCard && (
                <CustomStyle width="170px">
                  <Select
                    // size="medium"
                    value={null}
                    onSelect={handleAction}
                    placeholder="Xử lý hàng loạt"
                    // filterOption={(input, option) =>
                    //   option.props.children
                    //     .toLowerCase()
                    //     .indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {[
                      { id: 1, text: 'Sửa sản phẩm', icon: edit },
                      {
                        id: 2,
                        text: 'Đưa lên cửa hàng',
                        icon: arrowUp,
                        disabled: currentList.some(
                          v => v.publish_status !== 'ready',
                        ),
                      },
                      { id: 3, text: 'Sao chép sản phẩm', icon: copy },
                    ].map(item => (
                      <Option
                        value={item.id}
                        disabled={item.disabled}
                        key={item.id}
                      >
                        <CustomStyle
                          pr={{ xs: 's3' }}
                          display="flex"
                          color="primary"
                          alignItems="center"
                        >
                          <CustomStyle mr={{ xs: 's3' }} width="16px">
                            <img src={item?.icon} alt="" />
                          </CustomStyle>
                          {item.text}
                        </CustomStyle>
                      </Option>
                    ))}
                    <Option value={4}>
                      <CustomStyle
                        pr={{ xs: 's3' }}
                        display="flex"
                        color="red"
                        alignItems="center"
                      >
                        <CustomStyle mr={{ xs: 's3' }} width="16px">
                          <img src={deleteIcon} alt="" />
                        </CustomStyle>
                        Xoá sản phẩm
                      </CustomStyle>
                    </Option>
                  </Select>
                </CustomStyle>
              )}
              {/* {showActionListCard && (
                <Button
                  context="secondary"
                  onClick={() => handleAction(1)}
                  width={145}
                  // color="white"
                  className="btn-sm"
                >
                  <span>Sửa sản phẩm</span>
                </Button>
              )} */}
              {/* <CustomStyle width="130px">
                <Select
                  color="primary"
                  size="medium"
                  placeholder="Nhà cung cấp"
                  value={0}
                  onSelect={handleFilter('supplier', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Nhà cung cấp</Option>
                </Select>
              </CustomStyle> */}
              <CustomStyle width="130px">
                <Select
                  color="primary"
                  size="medium"
                  placeholder="Nền tảng"
                  value={filter?.platform || 0}
                  onSelect={handleFilter('platform', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Nền tảng</Option>
                  {constants?.SALE_CHANNEL.filter(item =>
                    ['LAZADA', 'SHOPEE', 'TIKTOK'].includes(item.id),
                  )?.map(v => (
                    <Option value={v.id.toLowerCase()} key={v.id}>
                      <img
                        src={v?.icon ?? defaultImage}
                        alt=""
                        style={{ maxWidth: '100%', marginRight: 5 }}
                        width={15}
                      />
                      {v.name}
                    </Option>
                  ))}
                </Select>
              </CustomStyle>
              <CustomStyle width="130px">
                <Select
                  color="primary"
                  size="medium"
                  placeholder="Cửa hàng"
                  value={filter?.store_id || 0}
                  onSelect={handleFilter('store_id', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Cửa hàng</Option>
                  {listStores?.map(v => {
                    return (
                      <>
                        {constants?.SALE_CHANNEL.map(item => {
                          if (item.id.toLowerCase() == v.platform) {
                            return (
                              <Option value={v.id} key={v.id}>
                                <img
                                  src={item?.icon ?? defaultImage}
                                  alt=""
                                  style={{ maxWidth: '100%', marginRight: 5 }}
                                  width={15}
                                />
                                {v.name}
                              </Option>
                            );
                          }
                        })}
                      </>
                    );
                  })}
                </Select>
              </CustomStyle>
              <CustomStyle width="110px">
                <Select
                  color="primary"
                  size="medium"
                  value={filter?.status || 0}
                  onSelect={handleFilter('status', true)}
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  <Option value={0}>Tất cả</Option>
                  {constants?.PRODUCT_STATUS?.filter(item =>
                    ['active', 'inactive'].includes(item.id),
                  ).map(v => (
                    <Option value={v.id} key={v.id}>
                      {v.name}
                    </Option>
                  ))}
                </Select>
              </CustomStyle>
            </Space>
          </div>
        </Col>
      </Row>
    </Filter>
  );
});
const CustomCheckbox = styled(Checkbox)`
  color: ${({ theme }) => theme.primary};
`;
export default FilterBar;
