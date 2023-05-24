import React, { memo } from 'react';
import { Row, Col } from 'antd';
import {
  ConnectStore,
  SearchProduct,
  SellProduct,
} from 'assets/images/dashboards';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { SectionWrapper, CustomStyle } from 'styles/commons';
import { Button } from 'app/components';

// import { selectListStores } from '../slice/selectors';

const dataSteps = [
  {
    icon: ConnectStore,
    title: 'Kết nối cửa hàng',
    data: 'connect_store',
    content:
      'Bạn cần kết nối với tài khoản cửa hàng trên các nền tảng Shopee, Lazada, Tiktok.',
    btn: 'Kết nối',
    url: '/stores',
  },
  {
    icon: SearchProduct,
    number: 2,
    title: 'Tìm và chọn sản phẩm',
    data: 'find_product',
    content:
      'Truy cập “Tìm sản phẩm” và bắt đầu khám phá tìm kiếm sản phẩm kinh doanh',
    btn: 'Tìm sản phẩm',
    url: '/products',
  },
  {
    icon: SellProduct,
    title: 'Bán sản phầm',
    data: 'sell_product',
    content:
      'Chọn và chỉnh sửa sản phẩm muốn bán. Sau đó click chọn “đưa sản phẩm lên sàn”',
    btn: 'Bắt đầu',
    url: '/selling-products',
  },
];

export default memo(function Stepbystep({ steps, isLoading, setIsLoading }) {
  const [DoneSteps, setDoneSteps] = React.useState(0);

  React.useEffect(() => {
    if (!isEmpty(steps)) {
      if (steps.connect_store || steps.find_product || steps.sell_product) {
        setDoneSteps(1);
      }
      if (
        (steps.connect_store && steps.find_product) ||
        (steps.find_product && steps.sell_product) ||
        (steps.connect_store && steps.sell_product)
      ) {
        setDoneSteps(2);
      }
      if (steps.connect_store && steps.find_product && steps.sell_product) {
        setDoneSteps(3);
      }
    }
  }, [steps]);

  return (
    <CustomSectionWrapper>
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 's8' }}
      >
        <CustomStyle className="title">Các bước kết nối và sử dụng</CustomStyle>
        <CustomStyle>
          <CustomStyle className="curent-step">
            {DoneSteps}
            /3 Hoàn tất
          </CustomStyle>
        </CustomStyle>
      </CustomStyle>
      <Row>
        {dataSteps.map(item => (
          <Col span={8} style={{ textAlign: 'center' }}>
            <WrapStep>
              <CustomStyle marginBottom={24}>
                <img src={item.icon} alt="" />
              </CustomStyle>
              <CustomStyle display="flex" flexDirection="column">
                {item?.number === 2 ? <div className="tail-1"></div> : ''}
                <div
                  className={
                    item?.number === 2 ? 'icon position-relative' : 'icon'
                  }
                >
                  ⬤
                </div>
                {item?.number === 2 ? <div className="tail-2"></div> : ''}
                <CustomStyle fontWeight={500} fontSize={16} marginBottom={8}>
                  {item.title}
                </CustomStyle>
                <CustomStyle className="content">
                  {item.content}{' '}
                  {/* <Link
                      to=""
                      style={{
                        textDecoration: 'underline',
                      }}
                    >
                      {item.number === 1 ? 'Chi tiết' : ''}
                    </Link> */}
                </CustomStyle>

                {steps[item.data] ? (
                  <Button
                    context="secondary"
                    className="btn-sm"
                    width="103px"
                    disabled
                    style={{
                      margin: 'auto',
                      color: '#27AE60',
                      background: 'rgb(39, 174, 96, 0.1)',
                      border: 'none',
                    }}
                  >
                    Hoàn tất
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    className="btn-sm"
                    color="blue"
                    style={{
                      margin: 'auto',
                      // color: 'white',
                      // backgroundColor: '#3D56A6',
                      // borderColor: '#3D56A6',
                    }}
                    onClick={() => {
                      window.location.href = item?.url;
                    }}
                  >
                    {item.btn}
                  </Button>
                )}
              </CustomStyle>
            </WrapStep>
          </Col>
        ))}
      </Row>
    </CustomSectionWrapper>
  );
});

const CustomSectionWrapper = styled(SectionWrapper)`
  border: none;
  margin-bottom: 35px;
  padding: 28px 20px;
  .title {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 18px;
  }
`;

const WrapStep = styled.div`
  .content {
    color: #4f4f4f;
    margin: auto;
    margin-bottom: 10px;
    width: 273px;
  }
  .icon {
    margin: auto;
    margin-bottom: 6px;

    font-size: 10px;
    line-height: 14px;
    color: #3d56a6;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 20px;
    height: 20px;
    background: #dfe4f3;
    border-radius: 50%;
  }
  .position-relative {
    position: relative;
  }
  .tail-1 {
    border: 0.5px dashed #ccd0de;
    position: absolute;
    left: -140px;
    right: 183px;
    margin-top: 9px;
  }
  .tail-2 {
    border: 1px dashed #ccd0de;
    position: absolute;
    left: 183px;
    right: -140px;
    margin-top: 9px;
  }
`;
