import React from 'react';
import { useHistory } from 'react-router-dom';
import { v4 } from 'uuid';
import {
  ProductDetailModal as Modal,
  ProductDetail as Detail,
  ProductDetailTabs as Tabs,
  ProductDetailDesc as Description,
  ProductDetailThumb as Swiper,
  WrapperOption,
  WrapperTags,
  CustomTable,
  // ProductDetailThumbItem as SwiperSlide,
} from '../styles/Main';
import { List, Skeleton, Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectProductDetail,
  selectLoadingDetail,
  selectDetailId,
} from '../slice/selectors';
import { useProductsSlice } from '../slice';
import { Button, Table, Image } from 'app/components';
import { without, isEmpty, debounce, minBy, maxBy } from 'lodash';
import { CustomStyle } from 'styles/commons';
import { formatMoney } from 'utils/helpers';
import { genImgUrl } from 'utils/helpers';
import { SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Thumbs } from 'swiper';
import DefaultIMG from 'assets/images/product-thumb-default.svg';
import axios from 'axios';
import { message } from 'antd';
import request from 'utils/request';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import notification from 'utils/notification';
const { TabPane } = Tabs;

SwiperCore.use([Navigation, Thumbs]);

export default function ProductDetail({ handleFilter, source }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDownLoading, setIsDownLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [thumbSwiper, setThumbSwiper] = React.useState(0);
  const detailId = useSelector(selectDetailId);
  const product = useSelector(selectProductDetail) || {};
  const loadingDetail = useSelector(selectLoadingDetail);
  const { actions } = useProductsSlice();
  const dispatch = useDispatch();
  const history = useHistory();
  const search = history.location.search;

  React.useEffect(() => {
    if (product) {
      const { thumb, product_images } = product;
      const getOption = () => {
        const options = [];

        [1, 2, 3].forEach(index => {
          options[`option_${index}`] = without(
            Array.from(
              new Set(
                product?.variations?.map(
                  variation => variation[`option_${index}`],
                ),
              ),
            ),
            null,
          );
        });

        setOptions(options);
      };
      setImages([...[thumb || []], ...(product_images || [])]);
      getOption();
      // setVisible(true);
    } else {
      // setVisible(false);
    }
  }, [product]);

  const getSupplierRecommendPrice = () => {
    const priceArr = [];
    let minFinalPrice;
    let maxFinalPrice;

    priceArr.push(product.min_price_variation);
    priceArr.push(product.max_price_variation);

    if (product.min_price_variation === product.max_price_variation) {
      minFinalPrice = product?.variations[0]?.promotion?.final_price;
      return <div className="price-detail">{formatMoney(minFinalPrice)}</div>;
    } else {
      console.log('no');
      product?.variations?.map(item => {
        priceArr.push(item?.promotion?.final_price);
      });

      minFinalPrice = minBy(priceArr);
      maxFinalPrice = maxBy(priceArr);

      return (
        <div className="price-detail">
          {formatMoney(minFinalPrice)}&nbsp;-&nbsp;{formatMoney(maxFinalPrice)}
        </div>
      );
    }
  };

  const getSupplierPromotionValue = () => {
    let value;
    if (product?.is_promotion) {
      if (
        product?.variations[0].promotion?.option === 'percent' ||
        product?.variations[0].promotion?.type === 'quantity_by'
      ) {
        value = product?.variations[0]?.promotion?.value;
        return (
          <div className="promotion-sale">
            OFF <span>{value}%</span>
          </div>
        );
      } else {
        return <div className="promotion-sale">OFF</div>;
      }
    }
    return;
  };

  // React.useEffect(() => {
  //   if (!visible) {
  //     dispatch(actions.getProductDetailError());
  //   }
  // }, [visible]);

  // React.useEffect(() => {
  //   return () => {
  //     history.push(`/products${search}`);
  //     dispatch(actions.setDetailId(''));
  //   };
  // }, []);

  const handleCancel = () => {
    setVisible(false);
    history.push(`${source || '/products'}${search}`);
    dispatch(actions.setDetailId(''));
  };

  const handleClickTag = v => () => {
    if (search.includes(v)) {
      history.push(`/products${search}&tag=${v}`);
      handleFilter({ tag: '' });
    } else {
      history.push(`/products${search}&tag=''`);
      handleFilter({ tag: v });
    }
    dispatch(actions.setDetailId(''));
  };

  const columns = React.useMemo(() => {
    if (isEmpty(product)) return [];
    let listOption = [];
    for (const iterator of [1, 2, 3]) {
      const option = product?.[`option_${iterator}`];
      if (option) {
        listOption = [
          ...listOption,
          {
            title: option,
            dataIndex: `option_${iterator}`,
            key: `option_${iterator}`,
            width: 100,
          },
        ];
      }
    }
    return [
      {
        title: 'Biến thể',
        dataIndex: 'sku',
        key: 'sku',
        // width: 120,
        render: (text, record) => (
          <WrapperOption>
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Image
                    size="200x200"
                    src={record?.thumb?.location || record?.thumb?.origin}
                  />
                }
                title={`SKU: ${text || ''}`}
                // description={`SKU: ${text || ''}`}
              />
            </List.Item>
          </WrapperOption>
        ),
      },
      ...listOption,
      {
        title: 'Giá bán',
        dataIndex: 'origin_supplier_price',
        key: 'origin_supplier_price',
        width: 100,
        render: (text, record) => formatMoney(record?.origin_supplier_price),
      },
      {
        title: 'Chiết khấu',
        dataIndex: 'value',
        key: 'value',
        align: 'center',
        width: 100,
        render: (text, record) =>
          record?.promotion.option === 'percent' ||
          record?.promotion.type === 'quantity_by'
            ? `${record?.promotion?.value}%`
            : formatMoney(record?.promotion?.value),
      },
    ];
  }, [product]);

  const handleSlideChange = swiper => {
    setThumbSwiper(swiper.activeIndex);
  };

  const handleDownloadImage = async () => {
    setIsDownLoading(true);
    const zip = new JSZip();
    const zipFilename = `product_${product.id}.zip`;

    const promiseDownloadAll = [];
    let isSuccess = true;
    const imageLength = images.length;
    images.forEach((image, index) => {
      const url = `${process.env.REACT_APP_IMAGE_STATIC_HOST}/${image.location}`;
      const filename =
        imageLength - index + '_' + image.location.split('/').pop();

      const downloadImage = (async () => {
        try {
          const response = await axios({
            url,
            method: 'GET',
            responseType: 'blob',
          });
          zip.file(filename, response.data, { binary: true });
        } catch (ex) {
          isSuccess &= false;
        }
      })();
      promiseDownloadAll.push(downloadImage);
    });
    await Promise.all(promiseDownloadAll);
    if (!isSuccess) {
      notification('error', 'Vui lòng thử lại sau!', 'Download thất bại');
      setIsDownLoading(false);
      return;
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipFilename);
    setIsDownLoading(false);
  };

  const handleDownloadChildImage = async () => {
    const zip = new JSZip();
    const zipFilename = `product_${product.id}.zip`;

    const promiseDownloadAll = [];
    let isSuccess = true;
    const imageLength = images.length;
    images.forEach((image, index) => {
      if (image.id == images[thumbSwiper]?.id) {
        const url = `${process.env.REACT_APP_IMAGE_STATIC_HOST}/${image.location}`;
        const filename =
          imageLength - index + '_' + image.location.split('/').pop();

        const downloadImage = (async () => {
          try {
            const response = await axios({
              url,
              method: 'GET',
              responseType: 'blob',
            });
            zip.file(filename, response.data, { binary: true });
          } catch (ex) {
            isSuccess &= false;
          }
        })();
        promiseDownloadAll.push(downloadImage);
      }
    });
    await Promise.all(promiseDownloadAll);
    if (!isSuccess) {
      notification('error', 'Vui lòng thử lại sau!', 'Download thất bại');
      return;
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipFilename);
  };

  const debounceDownloadImage = debounce(handleDownloadImage, 250);

  const childDownloadImage = debounce(handleDownloadChildImage, 250);

  const handleImportProduct = async () => {
    setIsLoading(true);

    const response = await request(
      'product-service/seller/store-product/add-product',
      {
        method: 'post',
        data: { product_id: product.id },
      },
    )
      .then(response => response)
      .catch(error => error);

    setTimeout(() => {
      if (response.is_success) {
        message.success('Đã thêm sản phẩm thành công');
      } else {
        message.error('Đã có lỗi xảy ra. Vui lòng thử lại');
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <Modal
      visible={!!detailId || visible}
      // visible={true}
      footer={null}
      width={960}
      closable={true}
      closeIcon={<i className="far fa-times" />}
      destroyOnClose={true}
      onCancel={handleCancel}
    >
      <Detail>
        {loadingDetail ? (
          <CustomStyle p="40px 40px 50px">
            <Skeleton avatar paragraph={{ rows: 4 }} active />
          </CustomStyle>
        ) : (
          <>
            <div className="info">
              <div className="thumb">
                {images.length > 0 && (
                  <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    direction={'vertical'}
                    width={40}
                    height={40}
                    navigation={{ nextEl: '.next', prevEl: '.prev' }}
                    onSlideChange={handleSlideChange}
                    watchSlidesVisibility={true}
                    watchSlidesProgress={true}
                    slideToClickedSlide={true}
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={genImgUrl({
                            width: 300,
                            height: 300,
                            location: image.location,
                          })}
                          alt=""
                        />
                      </SwiperSlide>
                    ))}

                    {images.length > 3 && (
                      <>
                        <div className="prev">
                          <i className="far fa-chevron-up" />
                        </div>
                        <div className="next">
                          <i className="far fa-chevron-down" />
                        </div>
                      </>
                    )}
                  </Swiper>
                )}

                <div className="thumb-default">
                  {getSupplierPromotionValue()}
                  <img
                    src={
                      images[thumbSwiper]?.location
                        ? genImgUrl({
                            width: 300,
                            height: 300,
                            location: images[thumbSwiper]?.location,
                          })
                        : DefaultIMG
                    }
                    alt=""
                  />
                  {/* <div
                    className="icon-downloadImg"
                    onClick={childDownloadImage}
                  >
                    <svg
                      width="19"
                      height="17"
                      viewBox="0 0 19 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.9865 9.72949H14.0802L15.549 8.29199C16.4865 7.35449 15.799 5.72949 14.4865 5.72949H12.4865V2.22949C12.4865 1.41699 11.799 0.729492 10.9865 0.729492H7.98649C7.14274 0.729492 6.48649 1.41699 6.48649 2.22949V5.72949H4.48649C3.14274 5.72949 2.45524 7.35449 3.42399 8.29199L4.86149 9.72949H1.98649C1.14274 9.72949 0.486493 10.417 0.486493 11.2295V15.2295C0.486493 16.0732 1.14274 16.7295 1.98649 16.7295H16.9865C17.799 16.7295 18.4865 16.0732 18.4865 15.2295V11.2295C18.4865 10.417 17.799 9.72949 16.9865 9.72949ZM4.48649 7.22949H7.98649V2.22949H10.9865V7.22949H14.4865L9.48649 12.2295L4.48649 7.22949ZM16.9865 15.2295H1.98649V11.2295H6.36149L8.42399 13.292C8.98649 13.8857 9.95524 13.8857 10.5177 13.292L12.5802 11.2295H16.9865V15.2295ZM14.2365 13.2295C14.2365 13.667 14.549 13.9795 14.9865 13.9795C15.3927 13.9795 15.7365 13.667 15.7365 13.2295C15.7365 12.8232 15.3927 12.4795 14.9865 12.4795C14.549 12.4795 14.2365 12.8232 14.2365 13.2295Z"
                        fill="#3D56A6"
                      />
                    </svg>
                  </div> */}
                </div>
              </div>

              <div className="info-detail">
                <div className="name">{product.name}</div>
                <div className="supplier">
                  Nhà cung cấp{' '}
                  <span className="supplier-name">
                    <a href={`/supplier/detail/${product.supplier.id}`}>
                      {product.supplier.name}
                    </a>
                  </span>
                </div>

                {/* <div className="supplier-inventory"> */}
                <div className="inventory">
                  Tồn kho{' '}
                  <span className="inventory-num">
                    {product.total_quantity}
                  </span>
                </div>

                <div className="warehouse">
                  Kho hàng{' '}
                  <span className="warehouse-address">
                    {/* <img src={} alt="" className="img" /> */}
                    {`${product.from_location.address1}, ${product.from_location.ward_name}, ${product.from_location.district_name}, ${product.from_location.province}, ${product.from_location.country}`}
                    {/* {product.from_location.country_code} */}
                  </span>
                </div>
                {/* </div> */}

                <div className="group-button d-flex flex-row justify-content-end">
                  <Button
                    // icon={
                    //   !isLoading ? 'fas fa-plus' : 'far fa-spinner-third fa-spin'
                    // }
                    className="btn-md"
                    width="165px"
                    onClick={handleImportProduct}
                    disabled={isLoading}
                  >
                    {isLoading ? '' : '+ THÊM SẢN PHẨM'}
                  </Button>
                  {/* <Button
                    // icon={
                    //   !isLoading ? 'fas fa-plus' : 'far fa-spinner-third fa-spin'
                    // }
                    context="secondary"
                    className="btn-md btn-download-img"
                    width="165px"
                    onClick={debounceDownloadImage}
                    disabled={isLoading}
                  >
                    <i
                      className={
                        isDownLoading
                          ? 'far fa-spinner-third fa-spin'
                          : 'fas fa-download'
                      }
                    ></i>
                    <span>&nbsp;TẢI TẤT CẢ ẢNH</span>
                  </Button> */}
                </div>

                <div className="price">
                  <div className="price-title">Giá sản phẩm</div>
                  {product?.is_promotion ? (
                    getSupplierRecommendPrice()
                  ) : (
                    <div className="price-detail">
                      {product.min_price_variation ===
                      product.max_price_variation
                        ? formatMoney(product.min_price_variation)
                        : `${formatMoney(product.min_price_variation)} - 
                    ${formatMoney(product.max_price_variation)}`}
                    </div>
                  )}
                </div>

                {product.option_1 && (
                  <div className="option">
                    <div className="option-title">{product.option_1}</div>
                    <div className="option-value">
                      {options.option_1?.map(option => (
                        <span className="tag">{option}</span>
                      ))}
                    </div>
                  </div>
                )}

                {product.option_2 && (
                  <div className="option">
                    <div className="option-title">{product.option_2}</div>
                    <div className="option-value">
                      {options.option_2?.map(option => (
                        <span className="tag">{option}</span>
                      ))}
                    </div>
                  </div>
                )}

                {product.option_3 && (
                  <div className="option">
                    <div className="option-title">{product.option_3}</div>
                    <div className="option-value">
                      {options.option_3?.map(option => (
                        <span className="tag">{option}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="detail">
              <div className="detail-item">
                <div className="detail-title">Chi tiết sản phẩm</div>

                <div className="detail-info">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Mô tả" key="1">
                      <Description
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                      {isEmpty(product?.tags) || (
                        <CustomStyle p={{ sx: 's7' }}>
                          <CustomStyle mb={{ xs: 's4' }} fontWeight="medium">
                            Thẻ sản phẩm
                          </CustomStyle>

                          <WrapperTags>
                            {product?.tags.map(v => (
                              <CustomStyle
                                key={v4()}
                                // onClick={handleClickTag(v)}
                                height={32}
                                mr={{ xs: 's4' }}
                                mb={5}
                                borderRadius={6}
                                px={7}
                                lineHeight="32px"
                                className={`${
                                  search.includes(v) ? 'active' : ''
                                }`}
                              >
                                {v}
                              </CustomStyle>
                            ))}
                          </WrapperTags>
                        </CustomStyle>
                      )}
                    </TabPane>
                    {/* {product.has_variation && ( */}
                    <TabPane tab="Biến thể" key="2">
                      <Table
                        className="Table-custom"
                        columns={columns.filter(item =>
                          !product?.is_promotion
                            ? item.dataIndex !== 'value'
                            : item,
                        )}
                        // rowClassName="pointer"
                        // rowSelection={{}}
                        dataSource={product.variations || []}
                        scroll={{ x: 500, y: 5000 }}
                        pagination={false}
                        notNeedRedirect={true}
                        rowKey={(_, index) => index}
                      />
                    </TabPane>
                    {/* )} */}
                    {!isEmpty(product.attributes) && (
                      <TabPane tab="Chi tiết" key="3">
                        <CustomTable
                          bordered
                          className="custom"
                          columns={[
                            {
                              title: '',
                              dataIndex: 'label_vi',
                              key: 'label_vi',
                              width: 200,
                            },
                            {
                              title: '',
                              dataIndex: 'value',
                              key: 'value',
                              // width: 120,
                            },
                          ]}
                          // rowClassName="pointer"
                          title={() => (
                            <CustomStyle display="flex">
                              <CustomStyle mx={{ xs: 's3' }}>
                                Danh mục:
                              </CustomStyle>
                              {product.product_categories_metadata?.map(
                                (item, i) => (
                                  <Tooltip
                                    mouseEnterDelay={0.5}
                                    title={item.name}
                                    key={item.id}
                                  >
                                    <CustomStyle>
                                      {i === 0 ? '' : ' > '}
                                      {item.name}
                                    </CustomStyle>
                                  </Tooltip>
                                ),
                              )}
                            </CustomStyle>
                          )}
                          dataSource={product.attributes || []}
                          scroll={{ x: 400, y: 5000 }}
                          pagination={false}
                          notNeedRedirect={true}
                          rowKey={(_, index) => index}
                        />
                      </TabPane>
                    )}
                  </Tabs>
                </div>
              </div>

              <div className="detail-item">
                <div className="report-title">Thống kê</div>

                <div className="report-info">
                  <div className="report-info-row">
                    <div className="report-info-item">
                      <div className="report-info-title">Đánh giá</div>

                      <div className="report-info-detail">
                        <i className="fas fa-star" /> {product.rating}{' '}
                        <span>({product.number_of_vote})</span>
                      </div>
                    </div>
                    <div className="report-info-item">
                      <div className="report-info-title">Xem sản phẩm</div>

                      <div className="report-info-detail">
                        {product.number_of_visits}
                      </div>
                    </div>
                  </div>

                  <div className="report-info-row">
                    <div className="report-info-item">
                      <div className="report-info-title">Thêm sản phẩm</div>

                      <div className="report-info-detail">
                        {product.number_of_times_pushed}
                      </div>
                    </div>
                    <div className="report-info-item">
                      <div className="report-info-title">Đơn hàng</div>

                      <div className="report-info-detail">
                        {product.number_of_booking}
                      </div>
                    </div>
                  </div>
                </div>

                {product?.is_promotion && (
                  <div className="khuyen-mai-hb">
                    <span class="tieu-de">
                      <i class="fa fa-gift" />
                      &nbsp;Khuyến mại đặc biệt
                    </span>
                    <ul>
                      <li>{product?.variations[0]?.promotion?.name}</li>
                      <li>
                        {product?.variations[0]?.promotion?.type ===
                        'product_by'
                          ? 'Giảm giá trên từng sản phẩm'
                          : 'Chiết khấu theo số lượng bán'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {isDownLoading && (
          <div className="downloading">
            <i className="fa fa-spin fa-spinner"></i>
            <div className="download-title">Đang tải</div>
          </div>
        )}
      </Detail>
    </Modal>
  );
}
