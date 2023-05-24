import React, { memo } from 'react';
import { Row, Col, Collapse, Progress } from 'antd';
import {
  ConnectStore,
  SearchProduct,
  SellProduct,
  Frame,
} from 'assets/images/dashboards';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { SectionWrapper, CustomStyle } from 'styles/commons';
import { Button } from 'app/components';
const { Panel } = Collapse;

// import { selectListStores } from '../slice/selectors';

const dataSteps = [
  {
    key: 1,
    icon: ConnectStore,
    title: 'Kết nối cửa hàng',
    data: 'connect_store',
    content:
      'Bạn cần kết nối với tài khoản cửa hàng trên các nền tảng Shopee, Lazada, Tiktok.',
    btn: 'Kết nối',
    url: '/stores',
    top: 100,
    src:
      'https://www.youtube.com/embed/Ag5oVWobSZ4?loop=1&playlist=Ag5oVWobSZ4',
    name:
      'Hướng dẫn Nhà bán hàng kết nối Shopee, Lazada với Odii | Odii Platform Dropshipping',
  },
  {
    key: 2,
    icon: Frame,
    title: 'Chuyển tiền vào ví',
    data: 'wallet_money',
    content:
      'Bạn cần chuyển tiền vào ví. Odii đưa ra giải pháp quản lý toàn bộ dòng tiền và lịch sử giao dịch thuận tiện và tránh được rủi ro về sai sót trong quá trình đối soát mua bán',
    btn: 'Chuyển tiền',
    url: '/mywallet',
    top: 140,
    src:
      'https://www.youtube.com/embed/F92GZLsmc8Q?loop=1&playlist=F92GZLsmc8Q',
    name:
      'Hướng dẫn nạp tiền từ ví nhà bán hàng trên nền tảng Odii | Odii Platform Dropshipping',
  },
  {
    key: 3,
    icon: SearchProduct,
    number: 2,
    title: 'Tìm và chọn sản phẩm',
    data: 'find_product',
    content:
      'Truy cập “Tìm sản phẩm” và bắt đầu khám phá tìm kiếm sản phẩm kinh doanh',
    btn: 'Tìm sản phẩm',
    url: '/products',
    top: 180,
    src:
      'https://www.youtube.com/embed/Dyze88-Vzqs?loop=1&playlist=Dyze88-Vzqs',
    name:
      'Hướng dẫn Nhà bán hàng tìm kiếm sản phẩm bán tốt nhất trên Odii | Odii Platform Dropshipping',
  },
  {
    key: 4,
    icon: SellProduct,
    title: 'Bán sản phầm',
    data: 'sell_product',
    content:
      'Chọn và chỉnh sửa sản phẩm muốn bán. Sau đó click chọn “đưa sản phẩm lên sàn”',
    btn: 'Bắt đầu',
    url: '/selling-products',
    top: 220,
    src:
      'https://www.youtube.com/embed/Dyze88-Vzqs?loop=1&playlist=Dyze88-Vzqs',
    name:
      'Hướng dẫn Nhà bán hàng tìm kiếm sản phẩm bán tốt nhất trên Odii | Odii Platform Dropshipping',
  },
];

export default memo(function Stepbystep({ steps, isLoading, setIsLoading }) {
  const [DoneSteps, setDoneSteps] = React.useState(0);

  React.useEffect(() => {
    if (!isEmpty(steps)) {
      if (
        steps.connect_store ||
        steps.find_product ||
        steps.sell_product ||
        steps.wallet_money
      ) {
        setDoneSteps(1);
      }
      if (
        (steps.connect_store && steps.find_product) ||
        (steps.find_product && steps.sell_product) ||
        (steps.connect_store && steps.sell_product) ||
        (steps.connect_store && steps.wallet_money) ||
        (steps.wallet_money && steps.sell_product) ||
        (steps.wallet_money && steps.find_product)
      ) {
        setDoneSteps(2);
      }
      if (
        (steps.connect_store && steps.find_product && steps.sell_product) ||
        (steps.connect_store && steps.wallet_money && steps.sell_product) ||
        (steps.connect_store && steps.find_product && steps.wallet_money) ||
        (steps.wallet_money && steps.find_product && steps.sell_product)
      ) {
        setDoneSteps(3);
      }
      if (
        steps.connect_store &&
        steps.find_product &&
        steps.sell_product &&
        steps.wallet_money
      ) {
        setDoneSteps(4);
      }
    }
  }, [steps]);

  return (
    <CustomSectionWrapper2>
      <div className="card-help">
        <div className="card-header">
          <div className="header-card-title">
            Hãy sẵn sàng để bán hàng trực tuyến. Hãy thử các mẹo này để bắt đầu.
          </div>
          <div className="progress-card-title">
            <div className="progress-text">
              {DoneSteps} trong 4 nhiệm vụ hoàn thành
            </div>
            <Progress
              strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }}
              percent={(DoneSteps / 4) * 100}
              status="active"
            />
          </div>
        </div>
        <div className="collapse-card">
          <Collapse
            defaultActiveKey={1}
            accordion
            expandIcon={panelProps => {
              return (
                <div>
                  {dataSteps.map(item => {
                    if (item.key == panelProps.panelKey) {
                      return (
                        <div>
                          {steps[item.data] ? (
                            <div className="card-icon">
                              <div className="icon-success">
                                <svg
                                  viewBox="0 0 20 20"
                                  class="icon-svg"
                                  focusable="false"
                                  aria-hidden="true"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M0 10a10 10 0 1 0 20 0 10 10 0 0 0-20 0zm15.2-1.8a1 1 0 0 0-1.4-1.4l-4.8 4.8-2.3-2.3a1 1 0 0 0-1.4 1.4l3 3c.4.4 1 .4 1.4 0l5.5-5.5z"
                                  ></path>
                                </svg>
                              </div>
                              <div
                                className={
                                  !panelProps.isActive ? 'line-icon-card' : ''
                                }
                              ></div>
                            </div>
                          ) : (
                            <div className="card-icon">
                              <div
                                className={panelProps.isActive ? 'rotate' : ''}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="10"
                                    cy="10"
                                    r="8.75"
                                    stroke="#BABEC3"
                                    stroke-width="2.5"
                                    stroke-dasharray="3.5 3.5"
                                  ></circle>
                                </svg>
                              </div>
                              <div
                                className={
                                  !panelProps.isActive ? 'line-icon-card' : ''
                                }
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              );
            }}
          >
            {dataSteps.map(item => (
              <Panel header={item.title} key={item.key}>
                <Row style={{ alignItems: 'center' }}>
                  <Col span={15}>
                    <div className="card-text">{item.content}</div>
                    <Button
                      type="primary"
                      className="btn-sm"
                      color="blue"
                      style={{
                        fontWeight: '500',
                      }}
                      onClick={() => {
                        window.location.href = item?.url;
                      }}
                    >
                      {item.btn}
                    </Button>
                  </Col>
                  <Col span={9}>
                    <CustomStyle display="flex" justifyContent="center">
                      <div
                        className="video-dashbroad"
                        // style={{ top: -`${item.top}` }}
                      >
                        <div className="image-box">
                          <iframe
                            width="100%"
                            height="100%"
                            src={item.src}
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                          ></iframe>
                        </div>
                        {/* <div className="text-box">{item.name}</div> */}
                      </div>
                    </CustomStyle>
                  </Col>
                </Row>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </CustomSectionWrapper2>
  );
});

const CustomSectionWrapper2 = styled(SectionWrapper)`
  border: none;
  padding: 0;
  .title {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 18px;
  }

  .card-help {
    background: #fff;

    .card-header {
      padding: 20px;
      border-bottom: 1px solid #d9d9d9;

      .header-card-title {
        font-size: 18px;
        font-weight: 500;
      }

      .progress-card-title {
        display: flex;

        .ant-progress-line {
          width: 80%;
          padding-left: 25px;
        }
      }
    }

    .collapse-card {
      padding: 20px;

      .ant-collapse {
        border: none;
        background: #fff;
      }

      .ant-collapse-item {
        border: none;
        background: #fff;

        &:last-child {
          .line-icon-card {
            background: #fff !important;
          }

          .ant-collapse-content {
            border: none !important;
          }
        }

        .ant-collapse-header {
          background: #fff;
          border: none;
          padding: 0;
          display: flex;

          .card-icon {
            display: flex;
            flex-direction: column;
            align-items: center;

            .line-icon-card {
              height: 15px;
              width: 1px;
              background: #d9d9d9;
              margin-top: 5px;
            }
          }

          .icon-success {
            display: block;
            height: 20px;
            margin: auto;
            max-height: 100%;
            max-width: 100%;
            width: 20px;

            .icon-svg {
              fill: #3d56a6;
            }
          }

          .rotate {
            width: 20px;
            height: 20px;
            animation: spin 0.3s linear;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(180deg);
            }
          }
        }
        .ant-collapse-content {
          border: none;
          border-left: 1px solid #d9d9d9 !important;
          margin-left: 10px;
          margin-bottom: 5px;

          img {
            width: 150px;
            height: 125px;
          }

          .ant-collapse-content-box {
            padding: 0 16px;

            .ant-row {
              height: 175px;
            }

            .card-text {
              padding-bottom: 15px;
            }

            .video-dashbroad {
              box-shadow: 0px 3px 8px rgb(0 0 0 / 20%);
              border: 1px solid #ebebf0;
              border-radius: 0px 4px 4px 0px;
              width: 75%;
              z-index: 1;
              padding: 10px;

              .text-box {
                padding-top: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 20px;
                -webkit-line-clamp: 3;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                font-weight: 500;
                text-transform: uppercase;
              }
            }

            .image-card {
              background: linear-gradient(180deg, #fff0 0, #fff 50%);
              bottom: 0;
              height: 40%;
              position: absolute;
              right: 0;
              width: 100%;
            }
          }
        }
      }

      .ant-collapse-item-active {
        .ant-collapse-header {
          font-weight: 500;
          font-size: 16px;
        }
      }
    }
  }
`;
