/**
 *
 * sellingProducts
 *
 */
import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, List, Tooltip, Collapse } from 'antd';
import { defaultImage } from 'assets/images';
import { SearchOutlined } from '@ant-design/icons';
import {
  Table,
  PageWrapper,
  Image,
  EmptyPage,
  BoxColor,
  Button,
  Pagination,
  // Select,
} from 'app/components';
import { isEmpty, isEqual, uniq, max, min } from 'lodash';
import constants from 'assets/constants';
import { tooltip } from 'assets/images/dashboards';
import { SectionWrapper, CustomTitle, CustomStyle } from 'styles/commons';
import { formatMoney } from 'utils/helpers';
// import { EditOutlined } from '@ant-design/icons';
import { useSellingProductsSlice } from './slice';
import { FilterCheckBox } from './Features';
import { getStores } from 'utils/providers';
import { MainWrapper } from './styles';
import usePrevious from 'app/hooks/UsePrevious';

import {
  selectLoading,
  selectData,
  selectPagination,
  selectListSelling,
  selectListStores,
  selectShowEmptyPage,
  selectDetails,
} from './slice/selectors';
import { messages } from './messages';
import Confirm from 'app/components/Modal/Confirm';
import ProductList from './Components/ProductList';
import TableVarient from './Components/TableVarient';

const { Panel } = Collapse;

export function SellingProducts({ history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useSellingProductsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const listSelling = useSelector(selectListSelling);
  const listStores = useSelector(selectListStores);
  const showEmptyPage = useSelector(selectShowEmptyPage);
  const details = useSelector(selectDetails);

  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [detail, setDetail] = React.useState({});
  const [newStatus, setNewStatus] = React.useState({});
  const [change, setChange] = React.useState('grip');
  const [idChangeCollape, setIdChangeCollape] = React.useState([]);
  const preData = usePrevious(data) || [];
  const [changeCollape, setChangeCollape] = React.useState();

  React.useEffect(() => {
    if (!isEmpty(data) && history.location.search && !isEqual(preData, data)) {
      dispatch(actions.getDetail(data.map(item => item.id)));
    }
  }, [data]);

  React.useEffect(() => {
    if (localStorage.getItem('selling_product_is_box')) {
      setChange(localStorage.getItem('selling_product_is_box'));
    }
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

  const handleClickName = id => () => {
    dispatch(actions.setListSelling([id]));
    history.push(`/selling-products/update/${id}`);
  };

  // Danh sách list sản phẩm đang bán
  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Tên sản phẩm</div>
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
      // TODO: Tạm ẩn cột Danh mục sản phẩm để có không gian hiển thị cột khác có giá trị hơn
      // {
      //   title: (
      //     <div className="custome-header">
      //       <div className="title-box">Danh mục sản phẩm</div>
      //     </div>
      //   ),
      //   dataIndex: 'primary_cat_metadata',
      //   key: 'primary_cat_metadata',
      //   width: '10%',
      //   render: text => text?.slice(-1)?.[0]?.name,
      // },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="center" className="title-box">
              Biến thể
            </CustomStyle>
          </div>
        ),
        dataIndex: 'number_of_variation',
        key: 'number_of_variation',
        width: '7%',
        className: 'text-center',
        // render: (text, record) =>
        //   record.supplier_product_status === 'inactive' ? (
        //     <CustomStyle textAlign="right" color="secondary2">
        //       Hết hàng
        //     </CustomStyle>
        //   ) : (
        //     !!text && <CustomStyle textAlign="right">{text}</CustomStyle>
        //   ),
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
        dataIndex: 'supplier_product_total_quantity',
        key: 'supplier_product_total_quantity',
        width: '7%',
        render: (text, record) =>
          text && !(record.supplier_product_publish_status === 'inactive') ? (
            <CustomStyle textAlign="right">
              {text}
              <i
                onClick={() => handleChangeCollape(true, record.id)}
                className="fas fa-edit"
              ></i>
            </CustomStyle>
          ) : (
            <CustomStyle textAlign="right" color="secondary2">
              Hết hàng
            </CustomStyle>
          ),
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Giá NCC
            </CustomStyle>
          </div>
        ),
        dataIndex: 'product_variation', //TODO, server chưa trả về giá NCC
        key: 'product_variation',
        width: '11%',
        render: (text, record) => {
          if (record.has_variation) {
            const list = uniq(text?.map(item => item.origin_supplier_price));

            if (list.length > 1) {
              return (
                <CustomStyle textAlign="right">
                  {formatMoney(min(list))} - {formatMoney(max(list))}
                </CustomStyle>
              );
            } else {
              return (
                <CustomStyle textAlign="right">
                  {formatMoney(list[0])}
                </CustomStyle>
              );
            }
          } else {
            return (
              <CustomStyle textAlign="right">
                {formatMoney(text[0].origin_supplier_price)}
              </CustomStyle>
            );
          }
        },
      },
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Giá bán
            </CustomStyle>
          </div>
        ),
        dataIndex: 'product_variation',
        key: 'product_variation',
        width: '11%',
        render: (text, record) => {
          if (record.has_variation) {
            const list = uniq(text?.map(item => item.retail_price));

            if (list.length > 1) {
              return (
                <CustomStyle textAlign="right" fontWeight="bold">
                  {formatMoney(min(list))} - {formatMoney(max(list))}
                </CustomStyle>
              );
            } else {
              return (
                <CustomStyle textAlign="right" fontWeight="bold">
                  {formatMoney(list[0])}
                </CustomStyle>
              );
            }
          } else {
            return (
              <CustomStyle textAlign="right" fontWeight="bold">
                {formatMoney(text[0].retail_price)}
              </CustomStyle>
            );
          }
        },
      },
      //TODO: Fomular lại chỗ này sau khi server trả về min/max supplier price
      {
        title: (
          <div className="custome-header">
            <CustomStyle textAlign="right" className="title-box">
              Lợi nhuận
            </CustomStyle>
          </div>
        ),
        dataIndex: 'product_variation',
        key: 'product_variation',
        width: '11%',
        render: (text, record) => {
          if (record.has_variation) {
            const list = uniq(
              text?.map(item => item.retail_price - item.origin_supplier_price),
            );

            if (list.length > 1) {
              return (
                <CustomStyle textAlign="right" color="green">
                  {formatMoney(min(list))} - {formatMoney(max(list))}
                </CustomStyle>
              );
            } else {
              return (
                <CustomStyle textAlign="right" color="green">
                  {formatMoney(list[0])}
                </CustomStyle>
              );
            }
          } else {
            return (
              <CustomStyle textAlign="right" color="green">
                {formatMoney(
                  text[0].retail_price - text[0].origin_supplier_price,
                )}
              </CustomStyle>
            );
          }
        },
      },
      // {
      //   title: (
      //     <div className="custome-header">
      //       <CustomStyle className="title-box" pl={{ xs: 's4' }}>
      //         Nền tảng
      //       </CustomStyle>
      //       {/* <div className="addition"></div> */}
      //     </div>
      //   ),
      //   dataIndex: 'platform',
      //   key: 'platform',
      //   width: '7%',
      //   render: text => {
      //     const current = constants?.SALE_CHANNEL.find(
      //       item => item.id.toLowerCase() === text,
      //     );
      //     return (
      //       <CustomStyle
      //         pr={{ xs: 's3' }}
      //         display="flex"
      //         pl={{ xs: 's4' }}
      //         alignItems="center"
      //         color={current?.color}
      //       >
      //         <CustomStyle mr={{ xs: 's2' }} width="14px">
      //           <img src={current?.icon} alt="" style={{ maxWidth: '100%' }} />
      //         </CustomStyle>
      //         {/* <CustomStyle pr={{ xs: 's1' }}>
      //           <Image src={current?.icon} alt="" width="14px" />
      //         </CustomStyle> */}
      //         {current?.name}
      //       </CustomStyle>
      //     );
      //   },
      // },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Cửa hàng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'store_id',
        key: 'store_id',
        width: '10%',
        render: (text, record) => {
          const current = listStores.find(item => item.id === text);
          const platform = constants?.SALE_CHANNEL.find(
            item => item.id.toLowerCase() === current?.platform,
          );
          return (
            <CustomStyle
              pr={{ xs: 's3' }}
              display="flex"
              alignItems="center"
              textAlign="left"
              // color={current?.color}
            >
              <CustomStyle mr={{ xs: 's2' }} width="14px">
                <img
                  src={platform?.icon ?? defaultImage}
                  alt=""
                  style={{ maxWidth: '100%' }}
                />
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
            <div className="title-box">Trạng thái</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: '5%',
        render: (text, record) => {
          let color = 'grayBlue';
          let defStatus = 'Không hoạt động';
          const currentStatus = constants.PRODUCT_ODII_STATUS.find(
            v => v.id === record.odii_status_id,
          );
          if (currentStatus) {
            defStatus = currentStatus.name;
            color = currentStatus.color;
          }
          return (
            <CustomStyle style={{ cursor: 'pointer' }}>
              <Tooltip
                title={
                  record.platform_reject_reason || record.platform_status_name
                }
              >
                <BoxColor colorValue={color} width={'130px'}>
                  {defStatus}
                </BoxColor>
              </Tooltip>
            </CustomStyle>
          );
        },
      },
    ],
    [listStores, changeCollape],
  );

  const goSelected = () => {
    history.push('/selected-products');
  };

  const rowSelection = {
    onChange: sellingRowKeys => {
      // setListOption([]);'
      dispatch(actions.setListSelling(sellingRowKeys));
    },
    getCheckboxProps: record => ({
      // disabled: record.store_id,
      name: record.name,
    }),
  };

  const goSearch = () => {
    history.push('products');
  };

  const handleChangeKingOf = type => {
    localStorage.removeItem('selling_product_is_box');
    localStorage.setItem('selling_product_is_box', type);
    setChange(type);
  };

  const handleChangeCollape = (e, id) => {
    setChangeCollape(`${e}_${id}`);
    if (e) {
      if (!idChangeCollape.includes(id)) {
        idChangeCollape.push(id);
        setIdChangeCollape(idChangeCollape);
      }
    } else {
      idChangeCollape.splice(idChangeCollape.indexOf(id), 1);
      setIdChangeCollape(idChangeCollape);
    }
  };

  const genExtra = id => (
    <div className="see-more">
      <div className="text-see-more">
        {idChangeCollape.includes(id) ? 'Rút gọn' : 'Xem thêm'}
      </div>
      <div
        className={idChangeCollape.includes(id) ? 'icon-see-more' : 'icon-see'}
      >
        <i className="fas fa-chevron-down"></i>
      </div>
    </div>
  );

  if (showEmptyPage) {
    return (
      <EmptyPage>
        <CustomStyle className="d-flex justify-content-center">
          <Button className="btn-md" onClick={goSearch} width="250px">
            <SearchOutlined />
            &nbsp;TÌM SẢN PHẨM NGAY
          </Button>
        </CustomStyle>
      </EmptyPage>
    );
  }

  return (
    <PageWrapper>
      <CustomStyle className="d-flex justify-content-between">
        <CustomTitle>
          {t(messages.title())}
          <Tooltip
            placement="right"
            title="Đồng bộ tất cả sản phẩm ĐƯỢC PUSH LÊN TỪ ODII của các cửa hàng kết nối"
          >
            <img
              className="tooltip"
              src={tooltip}
              alt=""
              style={{ marginLeft: '7px' }}
            />
          </Tooltip>
        </CustomTitle>
        <GroupButton>
          <Button className="btn-sm" onClick={goSelected}>
            + Tìm thêm sản phẩm
          </Button>
          <div className="group-button" style={{ display: 'flex' }}>
            <Tooltip title="Hiển thị dạng Danh sách">
              <Button
                className={change === 'list' ? 'btn-list active' : 'btn-list'}
                onClick={() => handleChangeKingOf('list')}
              >
                <i
                  className="fas fa-list"
                  style={{ color: change === 'list' ? '#fff' : '#3D56A6' }}
                ></i>
              </Button>
            </Tooltip>
            <Tooltip title="Hiển thị dạng Lưới">
              <Button
                className={change === 'grip' ? 'btn-grip active' : 'btn-grip'}
                onClick={() => handleChangeKingOf('grip')}
              >
                <i
                  className="fas fa-grip-horizontal"
                  style={{ color: change === 'grip' ? '#fff' : '#3D56A6' }}
                ></i>
              </Button>
            </Tooltip>
          </div>
        </GroupButton>
      </CustomStyle>
      <SectionWrapper className="custom-table-box">
        <CustomStyle className="title text-left" my={{ xs: 's5' }}>
          <FilterCheckBox
            isLoading={isLoading}
            gotoPage={gotoPage}
            history={history}
            listStores={listStores}
            // showAction={!isEmpty(listSelling)}
            showAction={false}
          />
        </CustomStyle>
        {change == 'list' && (
          <Spin tip="Đang tải..." spinning={isLoading}>
            <Row gutter={24}>
              <Col span={24}>
                <div>
                  <CustomTable
                    className="custom"
                    columns={columns}
                    rowSelection={{
                      sellingRowKeys: listSelling,
                      type: 'checkbox',
                      ...rowSelection,
                    }}
                    expandable={{
                      expandedRowKeys: data.map(e => e.id),
                      expandedRowRender: record => {
                        const variations =
                          details.find(item => item.id == record.id)
                            ?.variations || [];

                        return (
                          <>
                            {record.has_variation && variations.length > 0 && (
                              <div className="card-variant">
                                <Collapse
                                  accordion
                                  onChange={e =>
                                    handleChangeCollape(e, record.id)
                                  }
                                  activeKey={
                                    idChangeCollape.includes(record.id) && ['1']
                                  }
                                >
                                  <Panel
                                    // header={
                                    //   idChangeCollape.includes(record.id)
                                    //     ? 'rút gọn'
                                    //     : `xem thêm ${variations.length} biến thể khác`
                                    // }
                                    header={`Tổng ${variations.length} biến thể`}
                                    key="1"
                                    extra={genExtra(record.id)}
                                  >
                                    <TableVarient data={variations} />
                                  </Panel>
                                </Collapse>
                              </div>
                            )}
                          </>
                        );
                      },
                      expandIcon: ({ expanded, onExpand, record }) => <></>,
                    }}
                    searchSchema={{
                      keyword: {
                        required: false,
                      },
                      odii_status: {
                        required: false,
                      },
                      store_id: {
                        required: false,
                      },
                      platform: {
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
        )}
      </SectionWrapper>
      {change == 'grip' && (
        <Spin tip="Đang tải..." spinning={isLoading}>
          <MainWrapper>
            <ProductList products={data} />
          </MainWrapper>
          <Pagination
            searchSchema={{
              keyword: {
                required: false,
              },
              odii_status: {
                required: false,
              },
              store_id: {
                required: false,
              },
              platform: {
                required: false,
              },
            }}
            data={{ pagination }}
            actions={gotoPage}
          />
        </Spin>
      )}
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

const CustomTable = styled(Table)`

  .ant-checkbox-wrapper {
    visibility: visible;
  }

  .fa-edit{
    color: #5245e5;
    margin-left: 5px;

    &:hover{
      cursor: pointer;
      color: #3D56A6;
    }
  }

  .ant-table-tbody > tr.ant-table-row > td {
    background: #fff;
  }
  .ant-table-container {
    table {
      .ant-table-expanded-row {
        .ant-table-cell {
          padding: 0;
          background: #fff;

          &:not(last-child){
            border-bottom: 10px solid #f5f6fd;
          }
          .card-variant {
            display: flex;
            justify-content: center;
            cursor: pointer;
          }
        }
      }

      .ant-table-thead > tr > th{
        border-bottom: 10px solid #f5f6fd;
      }

      // .ant-table-tbody{
      //   tr{
      //     td{
      //       border-bottom: none;
      //     }
      //   }
      // }

      .ant-table-row-expand-icon-cell {
        padding: 0 !important;
        width: 0%;
      }

      .add-variant-action {
        .ant-collapse-content {
          height: auto !important;
        }
      }

      .ant-collapse {
        width: 100%;
        background: #fff;
        border: none;

        .ant-collapse-header{

          padding: 8px 65px;
          margin: 8px 12px 8px 12px;

          &:hover{
            background: #f6f6fb;
          }

          span{
            display: none;
          }

          .see-more{
            display: flex;

            .text-see-more{
              margin-right: 8px;
            }
            .icon-see-more {
              transform: rotate(-180deg);
              transition: all .3s ease;
            }

            .icon-see{
              transition: all .3s ease;
            }
          }
        }

          .ant-collapse-content {
            width: 100%;
            border: none;

            .ant-collapse-content-box {
              padding: 0;
            }
          }
        }
      }
    }
  }
`;

const GroupButton = styled.div`
  display: flex;
  .group-button {
    margin-left: 15px;

    .btn-list,
    .btn-grip {
      width: 40px;
      height: 32px;
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
  .ant-btn-primary {
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
