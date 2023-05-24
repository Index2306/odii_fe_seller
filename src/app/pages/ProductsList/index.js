/**
 *
 * SelectedProducts
 *
 */
import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, List } from 'antd';
import {
  Table,
  PageWrapper,
  Image,
  Link,
  BoxColor,
  Button,
  Select,
} from 'app/components';
import { isEmpty } from 'lodash';
import constants from 'assets/constants';
import { CustomH3, SectionWrapper, CustomTitle } from 'styles/commons';
import { formatMoney } from 'utils/helpers';
// import { EditOutlined } from '@ant-design/icons';
import { useSelectedProductsSlice } from './slice';
import { FilterBar } from './Features';
import { CustomStyle } from 'styles/commons';
import { getStores } from 'utils/providers';

import {
  selectLoading,
  selectData,
  selectPagination,
  selectListSelected,
  selectListStores,
} from './slice/selectors';
import { messages } from './messages';
import Confirm from 'app/components/Modal/Confirm';

export function SelectedProducts({ history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useSelectedProductsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const listSelected = useSelector(selectListSelected);
  const listStores = useSelector(selectListStores);

  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [detail, setDetail] = React.useState({});
  const [newStatus, setNewStatus] = React.useState({});

  React.useEffect(() => {
    getStores()
      .then(res => {
        if (!isEmpty(res?.data)) dispatch(actions.setListStores(res?.data));
      })
      .catch(() => null);
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

  const handleStatus = () => {
    dispatch(
      actions.update({
        id: detail.id,
        data: {
          ...detail,
          status: newStatus.id,
        },
      }),
    );
    setNewStatus('');
    toggleConfirmModal(true);
  };

  const toggleConfirmModal = needRefresh => {
    if (needRefresh === true) gotoPage();
    if (isShowConfirmStatus) setDetail({});
    setIsShowConfirmStatus(!isShowConfirmStatus);
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
        width: 170,
        render: (text, record) => (
          <WrapperOption>
            <List.Item>
              <List.Item.Meta
                avatar={<Image size="34x34" src={record?.thumb?.location} />}
                title={
                  <Link to={`/selectedProducts/uc/${record.id}`}>{text}</Link>
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
        dataIndex: 'top_category',
        key: 'top_category',
        width: 220,
        render: text => text?.name,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Thuộc tính</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'number_of_variation',
        key: 'number_of_variation',
        width: 100,
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
            <div className="title-box">Giá sản phẩm</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'origin_price',
        key: 'origin_price',
        width: 120,
        render: text =>
          text && <CustomStyle color="orange">{formatMoney(text)}</CustomStyle>,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Nền tảng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'shop_platform_type',
        key: 'shop_platform_type',
        width: 120,
        render: text => (
          <Select
            disabled
            // defaultValue={text}
            value={text}
            // style={{ width: 120 }}
            // onSelect={handleShowConfirm(record)}
            // filterOption={(input, option) =>
            //   option.props.children
            //     .toLowerCase()
            //     .indexOf(input.toLowerCase()) >= 0
            // }
          >
            {constants?.SALE_CHANNEL?.map(v => (
              <Select.Option key={v.id} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        ),
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
        width: 120,
        render: text => (
          <Select
            disabled
            // defaultValue={text}
            value={text}
            // style={{ width: 120 }}
            // onSelect={handleShowConfirm(record)}
            // filterOption={(input, option) =>
            //   option.props.children
            //     .toLowerCase()
            //     .indexOf(input.toLowerCase()) >= 0
            // }
          >
            {listStores?.map(v => (
              <Select.Option key={v.id} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
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
      disabled: record.store_id,
      name: record.name,
    }),
  };
  return (
    <PageWrapper>
      <CustomStyle className="d-flex justify-content-between">
        <CustomTitle>{t(messages.title())}</CustomTitle>
        <Button className="btn-sm" onClick={goSearch}>
          + Tìm thêm sản phẩm
        </Button>
      </CustomStyle>
      <SectionWrapper className="">
        <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
          <FilterBar
            isLoading={isLoading}
            gotoPage={gotoPage}
            history={history}
            showAction={!isEmpty(listSelected)}
          />
        </CustomH3>
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
                  }}
                  data={{ data, pagination }}
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
      {isShowConfirmStatus && (
        <Confirm
          data={detail}
          title={`Xác nhận '${newStatus.name}'`}
          isModalVisible={isShowConfirmStatus}
          handleCancel={toggleConfirmModal}
          handleConfirm={handleStatus}
        />
      )}
    </PageWrapper>
  );
}

const WrapperOption = styled.div`
  .ant-image {
    width: 32px;
    border-radius: 4px;
  }
  .ant-list-item-meta {
    align-items: center;
  }
  .ant-list-item-meta-title {
    overflow: hidden;
    /* text-align: justify; */
    text-overflow: ellipsis;
    -webkit-line-clamp: 2; /* number of lines to show */
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;
