/**
 *
 * Warehousing
 *
 */
import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Empty } from 'antd';
import { isEmpty } from 'lodash';
import { Button, PageWrapper, Image, Divider } from 'app/components';
import moment from 'moment';
import { CustomTitle, CustomStyle } from 'styles/commons';
import { useWarehousingSlice } from './slice';
import { selectLoading, selectData } from './slice/selectors';
import { IncludeImage, RightBox } from './styled';

export const Warehousing = memo(({ history, ...res }) => {
  const dispatch = useDispatch();
  const { actions } = useWarehousingSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);

  React.useEffect(() => {
    dispatch(actions.getData());
  }, []);

  const goDetail = id => () => {
    history.push(`/warehousing/uc/${id}`);
  };

  const goCreate = () => {
    history.push('warehousing/uc');
  };

  return (
    <Spin tip="Đang tải..." spinning={isLoading}>
      <PageWrapper>
        <CustomStyle className="d-flex justify-content-between">
          <CustomTitle>Kho hàng</CustomTitle>
          <Button className="btn-sm" onClick={goCreate}>
            + Thêm kho hàng
          </Button>
        </CustomStyle>
        {isEmpty(data) ? (
          <Empty />
        ) : (
          <Row gutter={{ xs: 8, sm: 16, md: 28 }}>
            {data.map(item => (
              <Col xs={24} md={12}>
                <CustomStyle key={item.id} className="" mb={{ xs: 's6' }}>
                  <Row>
                    <Col xs={10}>
                      <IncludeImage>
                        <Image size="100x100" src={item?.thumb?.location} />
                        <CustomStyle
                          fontSize={{ xs: 'f3' }}
                          mb={{ xs: 's2' }}
                          fontWeight="bold"
                        >
                          {item?.name}
                        </CustomStyle>
                        <CustomStyle
                          fontSize={{ xs: 'f1' }}
                          mb={{ xs: 's4' }}
                          color="gray3"
                        >
                          {item?.location_data?.address1}
                        </CustomStyle>
                        <Button
                          className="btn-sm"
                          context="secondary"
                          width="100%"
                          onClick={goDetail(item.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </IncludeImage>
                    </Col>

                    <Col xs={14}>
                      <RightBox>
                        <CustomStyle className="d-flex row">
                          <CustomStyle
                            className="col"
                            borderRight="1px solid"
                            borderColor="stroke"
                          >
                            <CustomStyle
                              color="blackPrimary"
                              fontWeight="bold"
                              fontSize={{ xs: 'f4' }}
                            >
                              {item.countProduct || <br />}
                            </CustomStyle>
                            <CustomStyle color="gray3">
                              Tổng sản phẩm
                            </CustomStyle>
                          </CustomStyle>

                          <CustomStyle pl={{ xs: 's6' }} className="col">
                            <CustomStyle
                              color="blackPrimary"
                              fontWeight="bold"
                              fontSize={{ xs: 'f4' }}
                            >
                              {item.countInactiveProduct || <br />}
                            </CustomStyle>
                            <CustomStyle color="gray3">
                              Sản phẩm hết hàng
                            </CustomStyle>
                          </CustomStyle>
                        </CustomStyle>

                        <Divider my={{ xs: 's5' }} />

                        <CustomStyle>
                          <CustomStyle
                            mb={{ xs: 's3' }}
                            className="d-flex justify-content-between"
                          >
                            <CustomStyle color="gray3">Mã kho</CustomStyle>
                            <CustomStyle>{item?.id}</CustomStyle>
                          </CustomStyle>
                          <CustomStyle
                            mb={{ xs: 's3' }}
                            className="d-flex justify-content-between"
                          >
                            <CustomStyle color="gray3">Quốc gia</CustomStyle>
                            <CustomStyle>
                              {item?.location_data?.country}
                            </CustomStyle>
                          </CustomStyle>
                          <CustomStyle
                            mb={{ xs: 's3' }}
                            className="d-flex justify-content-between"
                          >
                            <CustomStyle color="gray3">Điện thoại</CustomStyle>
                            <CustomStyle>{item?.phone}</CustomStyle>
                          </CustomStyle>
                          <CustomStyle
                            mb={{ xs: 's3' }}
                            className="d-flex justify-content-between"
                          >
                            <CustomStyle color="gray3">Ngày tạo</CustomStyle>
                            <CustomStyle>
                              {item?.created_at
                                ? moment(item.created_at).format('DD/MM/YYYY')
                                : ''}
                            </CustomStyle>
                          </CustomStyle>
                        </CustomStyle>
                      </RightBox>
                    </Col>
                  </Row>
                </CustomStyle>
              </Col>
            ))}
          </Row>
        )}
      </PageWrapper>
    </Spin>
  );
});
