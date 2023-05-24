import React, { memo, useRef } from 'react';
import { Row, Col, Menu, Dropdown, Button, Checkbox } from 'antd';
import { Input, Select, Button as ButtonPlatform } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/MultipleFilter';
import { CustomStyle } from 'styles/commons';
import constants from 'assets/constants';
import styled from 'styled-components';
import request from 'utils/request';
import notification from 'utils/notification';
const { Option } = Select;

const initState = {
  keyword: '',
  odii_status: [],
  store_id: [],
  platform: [],
};

const FilterCheckBox = memo(function FilterBar({
  isLoading,
  history,
  listStores,
}) {
  const [filter, setFilter] = React.useState(initState);
  const ref = useRef(null);
  const handleFilter = (type, needRefresh, clear, children) => e => {
    const value = (e?.target?.value ?? e) || '';
    if (clear) {
      if (children) {
        let index = filter[type].indexOf(children);
        filter[type].splice(index, 1);
        const values = filter;
        if (e.type === 'click' || needRefresh) {
          if (ref.current) {
            ref.current.callBack(values);
          }
        }
        setFilter(values);
      } else {
        const values = { ...filter, [type]: '' };
        if (e.type === 'click' || needRefresh) {
          if (ref.current) {
            ref.current.callBack(values);
          }
        }
        setFilter(values);
      }
    } else {
      if (type == 'keyword') {
        const values = { ...filter, [type]: value };
        if (e.type === 'click' || needRefresh) {
          if (ref.current) {
            ref.current.callBack(values);
          }
        }
        setFilter(values);
      } else {
        if (!filter[type].includes(value)) {
          filter[type].push(value);
        }
        const values = filter;
        if (e.type === 'click' || needRefresh) {
          if (ref.current) {
            ref.current.callBack(values);
          }
        }
        setFilter(values);
      }
    }
  };

  const platform = (
    <Menu>
      {constants?.SALE_CHANNEL.filter(item =>
        ['LAZADA', 'SHOPEE', 'TIKTOK'].includes(item.id),
      )?.map(v => (
        <Menu.Item key={v.id}>
          <Checkbox
            onChange={handleFilter('platform', true)}
            checked={filter.platform.includes(v.id.toLowerCase())}
            value={v.id.toLowerCase()}
          >
            {v.name}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Item
        className="text-item"
        onClick={handleFilter('platform', true, true)}
      >
        Xóa
      </Menu.Item>
    </Menu>
  );

  const store = (
    <Menu>
      {listStores?.map(v => (
        <Menu.Item key={v.id}>
          <Checkbox
            onChange={handleFilter('store_id', true)}
            checked={filter.store_id.includes(v.id.toLowerCase())}
            value={v.id.toLowerCase()}
          >
            {v.name}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Item
        className="text-item"
        onClick={handleFilter('store_id', true, true)}
      >
        Xóa
      </Menu.Item>
    </Menu>
  );

  const status = (
    <Menu>
      {constants.PRODUCT_STATUS.filter(e => ['0', '1'].includes(e.keys))?.map(
        v => (
          <Menu.Item key={v.keys}>
            <Checkbox
              onChange={handleFilter('odii_status', true)}
              checked={filter.odii_status.includes(v.keys)}
              value={v.keys}
            >
              {v.name}
            </Checkbox>
          </Menu.Item>
        ),
      )}
      <Menu.Item
        className="text-item"
        onClick={handleFilter('odii_status', true, true)}
      >
        Xóa
      </Menu.Item>
    </Menu>
  );

  const syncData = store => {
    request(`/product-service/seller/stores/${store.id}/sync-all-product`, {
      method: 'post',
    })
      .then(res => {
        if (res?.is_success) {
          notification(
            'success',
            `Sản phẩm trên cửa hàng ${store.name} - ${store.platform} đang bắt đầu đồng bộ`,
          );
        } else {
          notification(
            'error',
            `Có lỗi xảy ra khi đồng bộ cửa hàng ${store.name} - ${store.platform} vui lòng đồng bộ sau!`,
          );
        }
      })
      .catch(error => {});
  };

  const handleSyncAll = () => {
    const listStoreActive = listStores.filter(
      item => item.status === 'active' && item.is_deleted === false,
    );
    if (listStoreActive.length > 0) {
      listStoreActive?.map(item => syncData(item));
    } else {
      notification(
        'error',
        `Không có cửa hàng nào Đang kết nối, Vui lòng kiểm tra lại kết nối cửa hàng`,
      );
    }
  };

  const TagBoxChecked = constants?.KEY_FILTER?.map(item => {
    if (filter[item.id] != '') {
      return filter[item.id].map(el => {
        const store = el?.includes(listStores?.find(e => e.id == el)?.id);
        const status = el?.includes(
          constants.PRODUCT_STATUS?.find(e => e.keys == el)?.keys,
        );
        return (
          <div className="tag-box-checked">
            <div className="tag-box-title">{item.name}:</div>
            <span>
              {store
                ? listStores.find(e => e.id == el).name
                : status
                ? constants.PRODUCT_STATUS?.find(e => e.keys == el).name
                : el}
            </span>
            <div
              className="tag-box-close"
              onClick={handleFilter(item.id, true, true, el)}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.5"
                  d="M6.27734 4.75L9.09375 1.96094L9.66797 1.38672C9.75 1.30469 9.75 1.16797 9.66797 1.05859L9.06641 0.457031C8.95703 0.375 8.82031 0.375 8.73828 0.457031L5.375 3.84766L1.98438 0.457031C1.90234 0.375 1.76562 0.375 1.65625 0.457031L1.05469 1.05859C0.972656 1.16797 0.972656 1.30469 1.05469 1.38672L4.44531 4.75L1.05469 8.14062C0.972656 8.22266 0.972656 8.35938 1.05469 8.46875L1.65625 9.07031C1.76562 9.15234 1.90234 9.15234 1.98438 9.07031L5.375 5.67969L8.16406 8.49609L8.73828 9.07031C8.82031 9.15234 8.95703 9.15234 9.06641 9.07031L9.66797 8.46875C9.75 8.35938 9.75 8.22266 9.66797 8.14062L6.27734 4.75Z"
                  fill="#919191"
                />
              </svg>
            </div>
          </div>
        );
      });
    }
  });

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
          <Row gutter={8}>
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
            <Col xs={24} lg={11}>
              <ButtonPlatform className="btn-sm" onClick={handleSyncAll}>
                Động bộ sản phẩm
              </ButtonPlatform>
            </Col>
          </Row>
        </Col>
        <Col xs={24} flex="auto">
          <div>
            <GroupFilter>
              <Dropdown overlay={platform} trigger={['click']}>
                <Button>
                  Nền tảng
                  <i className="fas fa-angle-down"></i>
                </Button>
              </Dropdown>
              <Dropdown overlay={store} trigger={['click']}>
                <Button>
                  Cửa hàng
                  <i className="fas fa-angle-down"></i>
                </Button>
              </Dropdown>
              <Dropdown overlay={status} trigger={['click']}>
                <Button>
                  Trạng thái
                  <i className="fas fa-angle-down"></i>
                </Button>
              </Dropdown>
            </GroupFilter>
          </div>
        </Col>
      </Row>
      <TagBox gutter={8}>{TagBoxChecked}</TagBox>
    </Filter>
  );
});

const GroupFilter = styled.div`
  display: flex;
  justify-content: end;

  .ant-select-selector {
    box-shadow: 0px 3px 5px rgb(0 0 0 / 5%);
  }
  .ant-dropdown-trigger {
    display: flex;
    justify-content: space-between;
    width: 137px;
    align-items: center;
    height: 36px;
    box-shadow: 0px 3px 5px rgb(0 0 0 / 5%);
    border: 1px solid #ebebf0;
    border-radius: 0px 4px 4px 0px;

    span {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: #3d56a6;
    }

    i {
      font-weight: 400;
      font-size: 12px;
      line-height: 12px;
      color: #7c8db5;
    }
  }
`;
const TagBox = styled.div`
  display: flex;
  margin-top: 15px;
  .tag-box-checked {
    padding: 8px 10px;
    margin-right: 15px;
    background: #f7f7f9;
    border-radius: 4px;
    width: auto;
    min-width: 148px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;

    .tag-box-title {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #6c798f;
    }

    span {
      padding-left: 5px;
      font-weight: 500;
      font-size: 15px;
      line-height: 16px;
    }
    .tag-box-close {
      padding-left: 10px;
      cursor: pointer;

      &:hover {
        color: #000;
      }
    }
  }
`;

export default FilterCheckBox;
