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
import { without, isEmpty, debounce } from 'lodash';
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

  // eslint-disable-next-line no-unused-vars
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
        render: text => <div className="">{formatMoney(text)}</div>,
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

  const debounceDownloadImage = debounce(handleDownloadImage, 250);

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
                    {`${product.from_location.address1}, ${product.from_location.district_name}, ${product.from_location.province}, ${product.from_location.country}`}
                    {/* {product.from_location.country_code} */}
                  </span>
                </div>
                {/* </div> */}

                <div className="group-button d-flex flex-row">
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
                  <Button
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
                  </Button>
                </div>

                <div className="price">
                  <div className="price-title">Giá sản phẩm</div>
                  <div className="price-detail">
                    {product.min_price_variation === product.max_price_variation
                      ? formatMoney(product.min_price_variation)
                      : `${formatMoney(product.min_price_variation)} - 
                    ${formatMoney(product.max_price_variation)}`}
                  </div>
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
                        columns={columns}
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
