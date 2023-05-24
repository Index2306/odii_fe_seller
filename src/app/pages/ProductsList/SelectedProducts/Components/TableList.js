/**
 *
 * SelectedProducts
 *
 */
import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, List, Tooltip } from 'antd';
import {
  Table,
  PageWrapper,
  Image,
  BoxColor,
  Button,
  Select,
} from 'app/components';
import { isEmpty } from 'lodash';
import constants from 'assets/constants';
import { SectionWrapper, CustomTitle, CustomStyle } from 'styles/commons';
import { defaultImage } from 'assets/images';
import { formatMoney } from 'utils/helpers';
// import { EditOutlined } from '@ant-design/icons';
import { getStores } from 'utils/providers';

import {
  selectLoading,
  selectData,
  selectPagination,
  selectListSelected,
  selectListStores,
} from '../slice/selectors';
import { FilterBar } from '../Features';
import { messages } from '../messages';
import { useSelectedProductsSlice } from '../slice';

export default function TableList({ history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useSelectedProductsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const listSelected = useSelector(selectListSelected);
  const listStores = useSelector(selectListStores);

  React.useEffect(() => {
    getStores()
      .then(res => {
        if (!isEmpty(res?.data)) dispatch(actions.setListStores(res?.data));
      })
      .catch(() => null);
    return () => {
      dispatch(actions.resetWhenLeave());
    };
  }, []);

  // const gotoPage = ({ p = pagination.page, keyword = '' } = {}) => {
  //   dispatch(actions.getData({ page: p, keyword }));
  // };

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  // const handleShowConfirm = data => status => {
  //   setDetail(data);
  //   setNewStatus(constants.PRODUCT_STATUS.find(item => item.id === status));
  //   toggleConfirmModal();
  // };

  const handleClickName = id => () => {
    dispatch(actions.setListSelected([id]));
    history.push('selected-products/update');
  };

  const changeStore = (record, index) => e => {
    const currentStore = listStores.find(v => v.id === e);
    dispatch(
      actions.updateList({
        data: {
          ...record,
          platform: currentStore.platform,
          store: currentStore,
          store_id: e,
          primary_cat_id: record[`${currentStore.platform}_cat_id`]?.toString(),
          // primary_cat_metadata:
          //   currentStore[
          //     `${currentStore.platform}_product_categories_metadata`
          //   ],
        },
        index,
      }),
    );
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Sản phẩm</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        // width: 170,
        render: (text, record) => (
          <WrapperOption>
            <List.Item>
              <List.Item.Meta
                avatar={<Image size="45x45" src={record?.thumb?.location} />}
                title={
                  <CustomStyle
                    ml={{ xs: 's1' }}
                    onClick={handleClickName(record.id)}
                    className="pointer"
                  >
                    <Tooltip title={text} mouseEnterDelay={0.8}>
                      {text}
                    </Tooltip>
                  </CustomStyle>
                }
                // description={`${record.option_1}${
                //   record.option_2 ? `/${record.option_2}` : ''
                // }${record.option_3 ? `/${record.option_3}` : ''}`}
              />
            </List.Item>
          </WrapperOption>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngành hàng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'primary_cat_metadata',
        key: 'primary_cat_metadata',
        width: 150,
        render: text => text?.slice(-1)?.[0]?.name,
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Thuộc tính
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'number_of_variation',
        key: 'number_of_variation',
        width: 80,
        render: text =>
          !!text && <CustomStyle textAlign="right">{text}</CustomStyle>,
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Tồn kho
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'quantity',
        key: 'quantity',
        width: 80,
        render: text =>
          text ? (
            <CustomStyle textAlign="right">{text}</CustomStyle>
          ) : (
            <CustomStyle textAlign="right" color="secondary2">
              Hết hàng
            </CustomStyle>
          ),
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Tồn kho</div>
      //       {/* <div className="addition"></div> */}
      //     </div>
      //   ),
      //   dataIndex: 'quantity',
      //   key: 'quantity',
      //   width: 120,
      // },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Giá sản phẩm
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'min_price_variation',
        key: 'min_price_variation',
        width: 120,
        render: text =>
          !!text && (
            <CustomStyle textAlign="right" color="orange">
              {formatMoney(text)}
            </CustomStyle>
          ),
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle pl={{ xs: 's4' }} className="title-box">
              Nền tảng
            </CustomStyle>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'platform',
        key: 'platform',
        width: 130,
        render: text => {
          const current = constants?.SALE_CHANNEL.find(
            item => item.id.toLowerCase() === text,
          );
          return (
            <CustomStyle
              pr={{ xs: 's3' }}
              pl={{ xs: 's4' }}
              display="flex"
              alignItems="center"
              color={current?.color}
            >
              <CustomStyle mr={{ xs: 's2' }} width="14px">
                <img src={current?.icon} alt="" style={{ maxWidth: '100%' }} />
              </CustomStyle>
              {/* <CustomStyle pr={{ xs: 's1' }}>
                 <Image src={current?.icon} alt="" width="14px" />
               </CustomStyle> */}
              {current?.name}
            </CustomStyle>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Cửa hàng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'store_id',
        key: 'store_id',
        width: 150,
        render: (text, record, index) => (
          <CustomStyle width="145px">
            <Select
              showSearch
              value={text}
              optionFilterProp="label"
              // filterOption={(input, option) =>
              //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              // }
              onChange={changeStore(record, index)}
            >
              {listStores?.map(v => (
                <Select.Option
                  key={v.id}
                  value={v.id}
                  label={v.name}
                  disabled={
                    v.status === 'inactive' || v.auth_status === 'token_expired'
                  }
                >
                  <CustomStyle
                    pr={{ xs: 's3' }}
                    display="flex"
                    alignItems="center"
                  >
                    <CustomStyle mr={{ xs: 's2' }} width="16px">
                      <img
                        src={v?.logo ?? defaultImage}
                        alt=""
                        style={{ maxWidth: '100%' }}
                      />
                    </CustomStyle>
                    <CustomStyle width="calc(100% - 20px)">
                      <Tooltip mouseEnterDelay={0.8} title={v.name}>
                        {v.name}
                      </Tooltip>
                    </CustomStyle>
                  </CustomStyle>
                </Select.Option>
              ))}
            </Select>
          </CustomStyle>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: text => {
          const currentStatus = constants.PRODUCT_STATUS.find(
            v => v.id === text,
          );
          return (
            <BoxColor colorValue={currentStatus?.color}>
              {currentStatus?.name || ''}
            </BoxColor>
          );
        },
      },
    ],
    [listStores],
  );

  const goSearch = () => {
    history.push('products');
  };

  const rowSelection = {
    onChange: selectedRowKeys => {
      // setListOption([]);'
      dispatch(actions.setListSelected(selectedRowKeys));
    },
    getCheckboxProps: record => ({
      // disabled: record.store_id,
      name: record.name,
    }),
  };

  return (
    <SectionWrapper className="">
      <CustomStyle className="title text-left" my={{ xs: 's5' }}>
        <FilterBar
          isLoading={isLoading}
          gotoPage={gotoPage}
          listStores={listStores}
          history={history}
          showAction={!isEmpty(listSelected)}
        />
      </CustomStyle>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row gutter={24}>
          <Col span={24}>
            <div>
              <Table
                className="custom"
                columns={columns}
                rowSelection={{
                  selectedRowKeys: listSelected,
                  type: 'checkbox',
                  ...rowSelection,
                }}
                searchSchema={{
                  keyword: {
                    required: false,
                  },
                  status: {
                    required: false,
                  },
                  store_id: {
                    required: false,
                  },
                  platform: {
                    required: false,
                  },
                }}
                data={{
                  data,
                  pagination,
                }}
                scroll={{ x: 1100 }}
                // rowClassName="pointer"
                actions={gotoPage}
                // onRow={record => ({
                //   onClick: goDetail(record),
                // })}
              />
            </div>
          </Col>
        </Row>
      </Spin>
    </SectionWrapper>
  );
}

const WrapperOption = styled.div`
  .ant-image {
    /* width: 32px; */
    border-radius: 4px;
  }
  .ant-list-item-meta {
    align-items: center;
  }
  .ant-list-item-meta-avatar {
    margin-right: 10px;
  }
  .ant-list-item-meta-title > * {
    overflow: hidden;
    /* text-align: justify; */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    line-height: 18px; /* fallback */
    max-height: 36px;
    -webkit-line-clamp: 2; /* number of lines to show */
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;
