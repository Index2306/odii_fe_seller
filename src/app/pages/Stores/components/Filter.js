import React, { memo, useRef, useState, useMemo, useEffect } from 'react';
import { Row, Col, Space, Tooltip, Button } from 'antd';
import { Input, Select } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import notification from 'utils/notification';
import { default as FilterBar } from 'app/hooks/Filter';
import { useShouldRedirectToLastPage } from 'app/hooks/useValidateQuerySearch';
import Confirm from 'app/components/Modal/Confirm';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { isEmpty } from 'lodash';
import { CustomStyle } from 'styles/commons';
import { useSelector, useDispatch } from 'react-redux';
import request from 'utils/request';
import { deleteIcon, arrowUp, edit, copy } from 'assets/images/icons';
// import {
//   selectListSelected,
//   selectData,
//   selectDetails,
// } from '../slice/selectors';
import { useStoresSlice } from '../slice';

// import { SearchOutlined } from '@ant-design/icons';

import constants from 'assets/constants';
import styled from 'styled-components';
const { Option } = Select;

const initState = {
  keyword: '',
  status: '',
};

const Filter = memo(function Filter({
  isLoading,
  history,
  showAction,
  listStores,
  gotoPage,
  id,
  showActionListCard = true,
  handleChangeKing,
  changeState,
  isNotOdii,
  detail,
  tab,
}) {
  const [filter, setFilter] = useState(initState);
  const [change, setChange] = useState(changeState);
  const ref = useRef(null);
  const dispatch = useDispatch();
  // const data = useSelector(selectData);
  // const details = useSelector(selectDetails);
  // const listSelected = useSelector(selectListSelected);
  const { actions } = useStoresSlice();

  // const location = useShouldRedirectToLastPage(filter);
  // useEffect(() => {
  // gotoPage(location.search);
  // }, [location.search]);

  useEffect(() => {
    if (ref.current) {
      ref.current.callBack(initState);
    }
    setFilter(initState);
  }, [tab]);

  const handleFilter = (type, needRefresh) => e => {
    const value = '' || (e?.target?.value ?? e);
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const goSelected = () => {
    history.push('/selected-products');
  };

  const syncData = () => {
    if (detail.status !== 'active') {
      notification('error', 'Đã ngắt kết nối!');
    } else {
      dispatch(actions.setLoading(true));
      request(`/product-service/seller/stores/${id}/sync-all-product`, {
        method: 'post',
      })
        .then(res => {
          if (res?.is_success) {
            dispatch(
              actions.getProductListV2(
                `?page_size=20&store_id=${id}&isNotOdii=true`,
              ),
            );
            notification('success', res.message);
          } else {
            notification('error', 'Có lỗi xảy ra vui lòng đồng bộ sau!');
            dispatch(actions.setLoading(false));
          }
        })
        .catch(error => {
          dispatch(actions.setLoading(false));
        });
    }
  };

  const handleChangeKingOf = () => {
    setChange(!change);
    handleChangeKing(!change);
  };

  return (
    <FilterBar
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
          <Row gutter={8}>
            <Col xs={24} lg={13}>
              <Input
                placeholder="Tìm kiếm sản phẩm"
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
            <Col xs={24} lg={11}></Col>
          </Row>
        </Col>
        <Col xs={24} flex="auto">
          <GroupButton>
            <div className="d-flex justify-content-end">
              <Select
                className="select-status"
                placeholder="Trạng Thái"
                value={filter?.status || 0}
                onSelect={handleFilter('status', true)}
              >
                <Option value={0}>Tất cả</Option>
                {constants?.PRODUCT_STATUS?.map(v => (
                  <Option value={v.id}>{v.name}</Option>
                ))}
              </Select>
              {/* <Button
                className='btn-filter'
              >
                Bộ lọc khác
              </Button> */}
              {isNotOdii ? (
                <Button
                  type="primary"
                  className={detail.platform == 'lazada' ? 'btn-sm' : 'btn-md'}
                  onClick={syncData}
                >
                  <i className="fas fa-sync-alt"></i>
                  &nbsp;&nbsp; Đồng bộ từ {detail.platform}
                </Button>
              ) : (
                <Button type="primary" className="btn-sm" onClick={goSelected}>
                  <i className="fa fa-plus" />
                  &nbsp;&nbsp;
                  <span>Tìm thêm sản phẩm</span>
                </Button>
              )}

              <div className="group-button" style={{ display: 'flex' }}>
                <Tooltip title="Danh sách" color="#3D56A6">
                  <Button
                    className={change ? 'btn-list' : 'btn-list active'}
                    onClick={() => handleChangeKingOf()}
                  >
                    <i
                      className="fas fa-list"
                      style={{ color: !change ? '#fff' : '#3D56A6' }}
                    ></i>
                  </Button>
                </Tooltip>
                <Tooltip title="Lưới" color="#3D56A6">
                  <Button
                    className={change ? 'btn-grip active' : 'btn-grip'}
                    onClick={() => handleChangeKingOf()}
                  >
                    <i
                      className="fas fa-grip-horizontal"
                      style={{ color: change ? '#fff' : '#3D56A6' }}
                    ></i>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </GroupButton>
        </Col>
        {/* <Col xs={24} flex="auto">
          <div className="d-flex justify-content-end">
            <Space>
              {showActionListCard && (
                <Button
                  onClick={syncData}
                  width={200}
                  color="red"
                  className="btn-sm"
                >
                  <i className="fas fa-sync-alt" />
                  &nbsp;&nbsp;
                  <span>Đồng bộ sản phẩm</span>
                </Button>
              )}
            </Space>
          </div>
        </Col> */}
      </Row>
    </FilterBar>
  );
});

const GroupButton = styled.div`
  .btn-md {
    margin-left: 15px;
    background: #ea501f;
    height: 36px;
    border-color: #ea501f;

    color: #ffffff;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;

    &:hover {
      background: #ea501f99;
      border-color: #ea501f99;
    }
  }

  .group-button {
    margin-left: 15px;

    .btn-list,
    .btn-grip {
      width: 40px;
      height: 36px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      outline: none;
    }
    .btn-list {
      background: #ffffff;
      border: 1px solid #ebebf0;
      border-radius: 4px 0px 0px 4px;
    }
    .btn-grip {
      background: #ffffff;
      border: 1px solid #ebebf0;
      border-radius: 0px 4px 4px 0px;
    }
    .active {
      background: #3d56a6;
      border: 1px solid #3d56a6;
    }
  }
  .btn-sm {
    background-color: #3d56a6;
    margin-left: 15px;

    &:hover {
      background: #40a9ff;
      border-color: #40a9ff;
    }
  }
  .btn-filter {
    width: 100px;
    height: 36px;
    border: 1px solid #ebebf0;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin-left: 15px;

    span {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #3d56a6;
    }
  }
  .select-status {
    width: 110px;
    height: 36px;
  }
  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #3d56a6;
  }
`;

export default Filter;
