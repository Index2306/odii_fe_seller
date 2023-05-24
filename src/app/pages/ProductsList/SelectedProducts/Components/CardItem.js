/**
 *
 * SelectedProducts
 *
 */
import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Tooltip, Popover, Modal, List } from 'antd';
import { BoxColor, Button, Select, Tabs, Checkbox, Form } from 'app/components';
import { deleteIcon, arrowUp, edit, copy } from 'assets/images/icons';
import {
  Description,
  ListVariations,
  ProductImages,
} from 'app/pages/ProductsList/Components';
import { getAttributes, getStoreCategories } from 'utils/providers';
import notification from 'utils/notification';
import Confirm from 'app/components/Modal/Confirm';
import { isEmpty, isEqual, cloneDeep, uniqBy } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { numberOfVariation } from 'app/pages/ProductsList/utils';
import usePrevious from 'app/hooks/UsePrevious';
import constants from 'assets/constants';
import { SectionWrapper, CustomStyle } from 'styles/commons';
import { defaultImage, defaultImageStore } from 'assets/images';
import { ProductImagesModal } from 'app/pages/ProductsList/Components/modals';
import CommonData from './CommonData';
import { selectListSelected, selectListStores } from '../slice/selectors';
import { useSelectedProductsSlice } from '../slice';
import { useMemo } from 'react';

const { TabPane } = Tabs;
const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

const convertExtraAttributesToAttributes = (arr = []) => {
  return arr.reduce((final, item) => {
    final[item.name] = item.value;
    return final;
  }, {});
};

export default function CardItem({
  history,
  dataDetail,
  index,
  isChecked,
  status,
  getTikTokCategories,
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const isFirstCome = React.useRef(true);
  const { actions } = useSelectedProductsSlice();
  const listSelected = useSelector(selectListSelected);
  const listStores = useSelector(selectListStores);
  const [currentTab, setCurrentTab] = React.useState('sp');
  const [variations, setVariations] = React.useState([]);
  const [promotions, setPromotions] = React.useState([]);
  const [listAttributes, setListAttributes] = React.useState([]);
  const [listChannel, setListChannel] = React.useState([]);

  const [originDetailItem, setOriginDetailItem] = React.useState(dataDetail);
  const [current, setCurrent] = React.useState({});
  const [detailVariations, setDetailVariations] = React.useState([]);
  const [showProductImagesModal, setShowProductImagesModal] = React.useState(
    false,
  );
  const { setFieldsValue, getFieldsValue, validateFields } = form;
  const {
    id,
    option_1,
    option_2,
    option_3,
    store_product_images,
    store_id,
    platform,
    thumb,
    primary_cat_id,
    product_category_id,
    product_category,
    product_id,
  } = current || {};

  const preCurrent = usePrevious(current) || {};
  // React.useEffect(() => {
  //   console.log(`newVariations24`);
  // }, []);

  const [storeChecked, setStoreChecked] = React.useState({ checked: store_id });
  const [isModalVisible, setIsModalVisible] = React.useState();
  const [listFilter, setListFilter] = React.useState(
    platform
      ? listStores.filter(e => e.platform == current.platform)
      : listStores,
  );
  const [defaultSelect, setDefaultSelect] = React.useState(current?.platform);

  const showModalChoose = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleChangeStore();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChecked = e => {
    const value = e?.target?.value || '';
    const values = { ...storeChecked, checked: value };
    setStoreChecked(values);
  };

  const handelFilterStore = e => {
    if (e) {
      const filterlisted = listStores.filter(
        item => item.platform == e.toLowerCase(),
      );
      setListFilter(filterlisted);
    } else {
      setListFilter(listStores);
    }
    setDefaultSelect(e);
  };

  React.useEffect(() => {
    if (isFirstCome.current) {
      isFirstCome.current = false;
    }
    if (!isEmpty(dataDetail)) {
      setCurrent(cloneDeep(dataDetail));
      setOriginDetailItem(cloneDeep(dataDetail));
      const newAttributes = isEmpty(dataDetail.attributes)
        ? convertExtraAttributesToAttributes(
            isEmpty(dataDetail?.platform_extra_attributes)
              ? dataDetail?.[`${dataDetail.platform}_attributes`]
              : dataDetail?.platform_extra_attributes,
          )
        : dataDetail.attributes;
      setFieldsValue({
        name: dataDetail?.name || '',
        store_id: dataDetail?.store_id || null,
        description: dataDetail?.description || '',
        short_description: dataDetail?.short_description || '',
        defaultVariation: dataDetail?.variations?.[0] || { box_length_cm: '' },
        thumb: dataDetail?.thumb || null,
        attributes: isEmpty(newAttributes) ? '' : newAttributes,
        store_product_images: dataDetail?.store_product_images || [],
        product_category: dataDetail?.product_category || [],
        has_variation: dataDetail?.has_variation,
        tags: dataDetail?.tags || [],
        // variations: dataDetail?.variations,
      });
      if (isEmpty(variations) || !isEqual(variations, dataDetail?.variations)) {
        // console.log(
        //   `object1`,
        //   variations.map(v => v.thumb),
        //   dataDetail?.variations.map(v => v.thumb),
        // );
        setVariations(dataDetail?.variations || []);
      }
      setPromotions(dataDetail?.promotions || []);
    } else {
    }
  }, [dataDetail]);

  React.useEffect(() => {
    setDefaultSelect(current?.platform);
    setListFilter(
      platform
        ? listStores.filter(e => e.platform == current?.platform)
        : listStores,
    );
    setStoreChecked({ checked: dataDetail?.store_id || null });
  }, [isModalVisible]);

  // console.log(`newVariations21`, primary_cat_id);
  React.useEffect(() => {
    if (!platform) {
      setListChannel([]);
      return;
    }
    if (preCurrent.platform !== platform && platform === 'shopee') {
      setVariations(
        originDetailItem.variations.map(v => ({
          ...v,
          status: 'active',
          isDisabled: false,
        })),
      );
    }
    if (platform === 'tiktok') {
      setListChannel(getTikTokCategories());
      setFieldsValue({
        primary_cat_id: primary_cat_id?.toString(),
      });
    } else {
      getStoreCategories({
        platform: platform,
        odii_cat_id: product_category_id,
        page_size: 100,
      })
        .then(result => {
          if (result.is_success) {
            const catData = result.data;
            setListChannel(catData);
            if (catData?.length === 1) {
              const currentCat = catData[0];
              setCurrent({
                ...current,
                primary_cat_id: currentCat.shop_cat_id?.toString(),
                // primary_cat_metadata: currentCat,
              });
              setFieldsValue({
                primary_cat_id: currentCat.shop_cat_id?.toString(),
                // primary_cat_metadata: currentCat,
              });
            } else if (
              originDetailItem?.platform === current.platform &&
              originDetailItem.primary_cat_id
            ) {
              setFieldsValue({
                primary_cat_id: originDetailItem?.primary_cat_id,
                // primary_cat_metadata: [],
              });
              setCurrent({
                ...current,
                primary_cat_id: originDetailItem.primary_cat_id,
                // primary_cat_metadata: [],
              });
            } else {
              setFieldsValue({
                primary_cat_id: '',
                primary_cat_metadata: [],
              });
              setCurrent({
                ...current,
                primary_cat_id: '',
                primary_cat_metadata: [],
              });
            }
          } else {
            setListChannel([]);
          }
        })
        .catch(err => {
          setListChannel([]);
        });
    }
  }, [platform]);

  React.useEffect(() => {
    if (!platform) {
      setListChannel([]);
      setListAttributes([]);
      return;
    }

    if (!primary_cat_id) {
      setListAttributes([]);
      return;
    }
    if (
      preCurrent.primary_cat_id !== undefined &&
      preCurrent.primary_cat_id !== current?.primary_cat_id
    ) {
      dispatch(
        actions.updateList({
          data: {
            ...current,
            variations,
            publish_status: 'ready',

            primary_cat_id,
          },
          index,
          ignoreMsgSuccess: true,
        }),
      );
    }

    if (platform !== 'tiktok') {
      getAttributes({
        platform_category_id: primary_cat_id,
        platform,
        product_category_id: product_category_id || product_category?.id,
        product_id,
      })
        .then(result => {
          if (result.is_success) {
            const dataAttributes = result.data.attributes;
            if (current?.platform === 'lazada') {
              const listOptionAccept = [];
              let newVariations = cloneDeep(current?.variations);
              for (const itemAttr of dataAttributes) {
                if (
                  itemAttr.is_sale_prop === 1 &&
                  itemAttr.attribute_type === 'sku' &&
                  (itemAttr.input_type === 'multiSelect' ||
                    itemAttr.input_type === 'multiEnumInput' ||
                    itemAttr.input_type === 'enumInput')
                ) {
                  const handleItem = {};
                  switch (itemAttr.name) {
                    case 'color_family':
                    case 'color':
                      handleItem.odiiOption = 'Màu sắc';
                      break;
                    case 'size':
                      handleItem.odiiOption = 'Kích Cỡ';
                      break;
                    // case 'services':
                    //   handleItem.odiiOption = 'Dịch Vụ';
                    //   break;
                    default:
                      break;
                  }
                  listOptionAccept.push({ ...itemAttr, ...handleItem });
                }
              }
              if (!isEmpty(listOptionAccept)) {
                const listOptionDisabled = [];
                const options = [option_1, option_2, option_3];
                options.forEach((item, i) => {
                  if (
                    !item ||
                    !listOptionAccept.some(
                      v => v.odiiOption.toLowerCase() === item.toLowerCase(),
                    )
                  ) {
                    listOptionDisabled.push(`option_${i + 1}`);
                  }
                });
                newVariations = newVariations.reduce((final, item) => {
                  const handleItemVariations = {
                    option_1: item.option_1,
                    option_2: item.option_2,
                    option_3: item.option_3,
                  };
                  listOptionDisabled.forEach(v => {
                    handleItemVariations[v] = null;
                  });
                  const isDisabled = final.some(
                    v =>
                      v.option_1 === handleItemVariations.option_1 &&
                      v.option_2 === handleItemVariations.option_2 &&
                      v.option_3 === handleItemVariations.option_3,
                  );
                  final = [
                    ...final,
                    {
                      ...item,
                      ...handleItemVariations,
                      isDisabled,
                      status: isDisabled ? 'inactive' : item.status,
                    },
                  ];
                  return final;
                }, []);
              }
              setVariations(newVariations);
            } else {
              setVariations(originDetailItem.variations);
              // console.log(`attributes12`, dataAttributes);
            }
            setListAttributes(dataAttributes);
          } else {
            // setListAttributes([]);
          }
        })
        .catch(err => {
          // setListChannel([]);
        });
    }
  }, [primary_cat_id]);

  const getData = React.useCallback(() => {
    dispatch(actions.getDetail([id]));
  }, [id]);

  const fullImages = React.useMemo(() => {
    return [...[thumb || []], ...(store_product_images || [])];
  }, [thumb, store_product_images]);
  const toggleImagesModal = React.useCallback(() => {
    setShowProductImagesModal(!showProductImagesModal);
  }, [showProductImagesModal]);

  // const handleShowConfirm = data => status => {
  //   setDetail(data);
  //   setNewStatus(constants.PRODUCT_STATUS.find(item => item.id === status));
  //   toggleConfirmModal();
  // };

  const handleConfirm = () => {
    const url = history.location.search;
    dispatch(
      actions.delete({
        id,
        url,
      }),
    );
  };
  const handleAction = e => () => {
    const url = history.location.search;
    switch (e) {
      case 1:
        handleClickName();
        return;
      case 2:
        pushStore();
        // history.go(0);
        return;
      case 3:
        dispatch(
          actions.duplicateProducts({
            listData: [id],
            url,
          }),
        );
        return;
      case 4:
        dispatch(
          globalActions.showModal({
            modalType: Confirm,
            modalProps: {
              isFullWidthBtn: true,
              isModalVisible: true,
              title: 'Xác nhận xoá',
              color: 'red',
              data: {
                message: `Bạn có chắc chắn muốn xoá các sản phẩm đã chọn?`,
              },
              callBackConfirm: handleConfirm,
            },
          }),
        );
        return;

      default:
        return;
    }
  };
  const content = (
    <CustomStyle>
      {[
        { id: 1, text: 'Xem chi tiết', icon: edit },
        { id: 3, text: 'Sao chép sản phẩm', icon: copy },
      ].map(item => (
        <CustomStyle
          key={item.id}
          pr={{ xs: 's3' }}
          pb={{ xs: 's5' }}
          display="flex"
          onClick={handleAction(item.id)}
          color="primary"
          className="pointer"
          alignItems="center"
        >
          <CustomStyle mr={{ xs: 's3' }} width="16px" className="pointer">
            <img src={item?.icon} alt="" />
          </CustomStyle>
          {item.text}
        </CustomStyle>
      ))}
      <CustomStyle
        pr={{ xs: 's3' }}
        display="flex"
        color="red"
        onClick={handleAction(4)}
        className="pointer"
        alignItems="center"
      >
        <CustomStyle mr={{ xs: 's3' }} width="16px">
          <img src={deleteIcon} alt="" />
        </CustomStyle>
        Xoá sản phẩm
      </CustomStyle>
    </CustomStyle>
  );
  const pushStore = () => {
    const lowVariation = variations.find(
      item =>
        item.low_retail_price > 0 && item.retail_price < item.low_retail_price,
    );
    if (lowVariation) {
      notification(
        'error',
        `Biến thể ${lowVariation.sku} có giá bán thấp hơn giá cho phép từ nhà cung cấp`,
      );
      return;
    }

    dispatch(
      actions.pushStoresInList({
        listData: [
          {
            ...current,
            platform_extra_attributes: listAttributes,
            number_of_variation: numberOfVariation(
              current.has_variation,
              variations,
            ),
            // primary_cat_metadata:
            //   current[`${currentStore.platform}_product_categories_metadata`],
            store_product_images_ids:
              store_product_images?.map(item => item.id.toString()) ?? [],
            variations: variations.map(({ thumb, ...res }) => ({
              ...res,
              product_image_id: thumb?.id.toString() ?? '',
            })),
          },
        ],
        url: history.location.search,
      }),
    );
  };

  const changeStore = id => () => {
    const currentStore = listStores.find(v => v.id === id);
    dispatch(
      actions.updateList({
        data: {
          ...current,
          publish_status: 'ready',
          // platform_extra_attributes: isEmpty(current.platform_extra_attributes)
          //   ? current[`${currentStore.platform}_attributes`]
          //   : current.platform_extra_attributes,
          primary_cat_metadata: isEmpty(current.primary_cat_metadata)
            ? current[`${currentStore.platform}_product_categories_metadata`]
            : current.primary_cat_metadata,
          store_product_images_ids:
            store_product_images?.map(item => item.id.toString()) ?? [],
          number_of_variation: numberOfVariation(
            current.has_variation,
            variations,
          ),
          variations,
          // variations: variations.map(({ thumb, ...res }) => ({
          //   ...res,
          //   product_image_id: thumb?.id.toString() ?? '',
          // })),
          platform: currentStore.platform,
          store: currentStore,
          store_id: id,
          primary_cat_id: null,
        },
        index,
      }),
    );
  };

  const handleChangeStore = () => {
    const currentStore = listStores.find(v => v.id === storeChecked.checked);
    if (currentStore.normal_address === current.normal_address) {
      changeStore(storeChecked.checked)();
    } else {
      dispatch(
        globalActions.showModal({
          modalType: Confirm,
          modalProps: {
            isFullWidthBtn: true,
            isModalVisible: true,
            title: `Xác nhận chọn cửa hàng '${currentStore.name}'?`,
            // color: 'primary',
            data: {
              message: `Kho hàng của sản phẩm '${current.name}' không trùng tỉnh/thành phố với kho hàng của bạn. Bạn có muốn tiếp tục không?`,
            },
            callBackConfirm: changeStore(storeChecked.checked),
          },
        }),
      );
    }
  };

  const handleClickName = () => {
    const handleList = listSelected?.includes(id)
      ? listSelected
      : [id, ...listSelected];
    dispatch(actions.setListSelected(handleList));
    history.push({
      pathname: '/selected-products/update',
      // state: {
      //   ids: [10],
      // },
      search: `ids=${handleList.join(',')}`,
    });
  };

  const onFinish = () => {
    dispatch(
      actions.updateList({
        data: {
          ...current,
          platform_extra_attributes: listAttributes,
          store_product_images_ids:
            store_product_images?.map(item => item.id.toString()) ?? [],
          variations,
          // variations: variations.map(({ thumb, ...res }) => ({
          //   ...res,
          //   product_image_id: thumb?.id.toString() ?? '',
          // })),
          number_of_variation: numberOfVariation(
            current.has_variation,
            variations,
          ),
          retail_price: current.has_variation
            ? current.retail_price
            : variations[0].retail_price,
        },
        index,
      }),
    );
  };

  const onFinishFailed = ({ errorFields }) => {
    let description = '';
    for (const iterator of errorFields) {
      description = `${description ? `${description},` : description}
      ${iterator.errors[0]}   
        `;
    }
    notification('error', description, 'Vui lòng điền \n thêm thông tin!');
  };

  const onCheckbox = e => {
    if (!id) {
      notification('error', 'Sản phẩm không tồn tại');
      return;
    }
    const cloneArray = [...listSelected];
    const newList = e.target.checked
      ? [...cloneArray, id]
      : cloneArray.filter(v => v !== id);
    dispatch(actions.setListSelected(newList));
  };

  const handleChangTab = value => {
    // eslint-disable-next-line eqeqeq

    setCurrentTab(value);
  };

  const onValuesChange = params => {
    const newData = { ...current, variations, ...params };
    if (params.hasOwnProperty('defaultVariation')) {
      setVariations([{ ...variations[0], ...params.defaultVariation }]);
    } else if (params.hasOwnProperty('store_id')) {
      const platform = listStores.find(item => item.id === params.store_id)
        ?.platform;
      setCurrent({ ...newData, platform });
    } else {
      setCurrent(newData);
    }
  };

  const renderPlatform = () => {
    if (!platform) return;
    const current = constants?.SALE_CHANNEL.find(
      item => item.id.toLowerCase() === platform,
    );
    return (
      <CustomStyle
        px={{ xs: 's3' }}
        backgroundColor="background"
        display="flex"
        alignItems="center"
        color={current?.color}
        border="1px solid"
        borderColor="stroke"
        borderRight="none"
        borderTopLeftRadius="4px"
        borderBottomLeftRadius="4px"
      >
        <CustomStyle width="14px">
          <img src={current?.icon} alt="" style={{ maxWidth: '100%' }} />
        </CustomStyle>
        {/* <CustomStyle pr={{ xs: 's1' }}>
           <Image src={current?.icon} alt="" width="14px" />
         </CustomStyle> */}
        {/* {current?.name} */}
      </CustomStyle>
    );
  };

  const BoxStatus = () => {
    const currentStatus = constants.PRODUCT_STATUS.find(v => v.id === status);
    return (
      <BoxColor colorValue={currentStatus?.color} fontSize="14px" width="135px">
        {currentStatus?.name || ''}
      </BoxColor>
    );
  };
  return (
    <SectionWrapper overflow="auto" minHeight={340} maxHeight={500}>
      <Form
        scrollToFirstError
        form={form}
        {...layout}
        // layout="vertical"
        onValuesChange={onValuesChange}
        // initialValues={{
        //   name: data?.name || '',
        //   odii_price: data?.odii_price || 0,
        // }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={24}>
          <Col span={24}>
            <CustomStyle display="flex" justifyContent="space-between">
              <CustomStyle display="flex" alignItems="center">
                <Checkbox
                  className="option-to-new"
                  checked={isChecked}
                  onChange={onCheckbox}
                >
                  Chọn sản phẩm
                </Checkbox>
              </CustomStyle>
              <CustomStyle display="flex" justifyContent="flex-end">
                <BoxStatusCustom>{BoxStatus()}</BoxStatusCustom>
                {renderPlatform()}
                <CustomStyle width="171px" mr={{ xs: 's4' }}>
                  <ButtonChose>
                    <div className="btn-select-store" onClick={showModalChoose}>
                      <div className="btn-title">
                        {store_id
                          ? listStores.find(item => item.id == store_id)
                              ?.name || store_id
                          : 'Chọn cửa hàng'}
                      </div>
                      <div className="btn-icon">
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </ButtonChose>
                  {/* <Select
                    showSearch
                    size="medium"
                    placeholder="Chọn cửa hàng"
                    value={store_id}
                    optionFilterProp="label"
                    // filterOption={(input, option) =>
                    //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // }
                    onChange={handleChangeStore}
                  >
                    {listStores?.map(v => (
                      <Select.Option
                        key={v.id}
                        value={v.id}
                        label={v.name}
                        disabled={
                          v.status === 'inactive' ||
                          v.auth_status === 'token_expired'
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
                  </Select> */}
                </CustomStyle>
                <CustomStyle mr={{ xs: 's4' }}>
                  <Button
                    context="secondary"
                    type="primary"
                    htmlType="submit"
                    // disabled={!store_id}
                    className="btn-sm"
                  >
                    <span>Lưu</span>
                  </Button>
                </CustomStyle>
                <Button
                  // context="secondary"
                  onClick={pushStore}
                  needWait
                  disabled={!store_id}
                  width={145}
                  className="btn-sm"
                >
                  <Tooltip title="Sản phẩm sẽ bị xóa khỏi danh sách sau khi đưa lên cửa hàng thành công. Nếu bạn muốn đăng lên các cửa hàng khác thì hãy sao chép sản phẩm trước khi đẩy">
                    <span>Đưa lên cửa hàng</span>
                  </Tooltip>
                </Button>
                <CustomStyle ml={{ xs: 's4' }}>
                  <Popover
                    placement="bottomRight"
                    content={content}
                    trigger="click"
                  >
                    <WrapperAction>
                      <CustomStyle fontSize={{ xs: 'f2' }} color="gray4">
                        <i className="far fa-ellipsis-v"></i>
                      </CustomStyle>
                    </WrapperAction>
                  </Popover>
                </CustomStyle>
              </CustomStyle>
            </CustomStyle>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <CustomStyle>
              <CustomStyle>
                <Tabs
                  animated={true}
                  defaultActiveKey={currentTab}
                  onChange={handleChangTab}
                  activeKey={currentTab}
                >
                  {[
                    {
                      name: 'Sản phẩm',
                      key: 'sp',
                      Component: (
                        <CommonData
                          layout={layout}
                          form={form}
                          data={current}
                          listChannel={listChannel}
                          handleClickName={handleClickName}
                        />
                      ),
                    },
                    {
                      name: 'Mô tả',
                      key: 'mt',
                      Component: (
                        <Description
                          layout={layout}
                          hiddenTitle
                          styleWrapper={{ p: 0, border: 'none' }}
                        />
                      ),
                    },
                    {
                      name: `${variations?.length} Biến thể (Variant)`,
                      key: 'bt',
                      Component: (
                        <ListVariations
                          setVariations={setVariations}
                          setDetailVariations={setDetailVariations}
                          toggleImagesModal={toggleImagesModal}
                          variations={variations}
                          promotions={promotions}
                          options={[option_1, option_2, option_3]}
                          hiddenTitle
                          styleWrapper={{ p: 0, border: 'none' }}
                        />
                      ),
                    },
                    {
                      name: 'Hình ảnh',
                      key: 'ha',
                      Component: (
                        <ProductImages
                          productId={id}
                          layout={layout}
                          images={fullImages}
                          reloadData={getData}
                          listIds={listSelected}
                          hiddenTitle
                          CustomTitle={
                            <CustomStyle
                              color="grayBlue"
                              pb={{ xs: 's6' }}
                              // ml={{ xs: 's7' }}
                            >
                              {fullImages.length} hình ảnh
                            </CustomStyle>
                          }
                          styleWrapper={{ p: 0, border: 'none' }}
                          leftCol={4}
                        />
                      ),
                    },
                  ]?.map(v => (
                    <TabPane tab={v.name} key={v.key}>
                      {v.Component}
                    </TabPane>
                  ))}
                </Tabs>
              </CustomStyle>
            </CustomStyle>
          </Col>
        </Row>
      </Form>
      {showProductImagesModal && (
        <ProductImagesModal
          toggleImagesModal={toggleImagesModal}
          variations={variations}
          setVariations={setVariations}
          detailVariations={detailVariations}
          store_product_images={store_product_images}
          setValue={onValuesChange}
        />
      )}
      <Modal
        visible={isModalVisible}
        width={540}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="modal-store-custom">
          <div className="modal-title">Chọn cửa hàng</div>
          <div className="modal-suggest">
            Vui lòng chọn cửa hàng bạn muốn đưa sản phẩm lên
          </div>
          <Select
            placeholder="Nền tảng"
            value={defaultSelect}
            onChange={handelFilterStore}
          >
            {constants?.SALE_CHANNEL.filter(item =>
              ['LAZADA', 'SHOPEE', 'TIKTOK'].includes(item.id),
            )?.map(v => (
              <Select.Option
                key={v.id}
                value={v.id.toLowerCase()}
                label={v.name}
              >
                <CustomStyle
                  pr={{ xs: 's3' }}
                  display="flex"
                  alignItems="center"
                >
                  <CustomStyle mr={{ xs: 's2' }} width="16px">
                    <img
                      src={v?.icon ?? defaultImage}
                      alt=""
                      style={{ maxWidth: '100%' }}
                    />
                  </CustomStyle>
                  <CustomStyle
                    width="calc(100% - 20px)"
                    color={
                      v.id == 'SHOPEE'
                        ? 'red'
                        : v.id == 'TIKTOK'
                        ? 'black'
                        : 'blue'
                    }
                  >
                    <Tooltip mouseEnterDelay={0.8} title={v.name}>
                      {v.name}
                    </Tooltip>
                  </CustomStyle>
                </CustomStyle>
              </Select.Option>
            ))}
            <Select.Option>Nền tảng</Select.Option>
          </Select>
          <List
            dataSource={listFilter}
            footer={
              <div className="btn-list">
                <Button onClick={handleCancel} width={60} className="btn-sm">
                  Hủy
                </Button>
                <Button
                  onClick={handleOk}
                  style={{ marginLeft: 14 }}
                  width={100}
                  className="btn-sm"
                  disabled={!storeChecked.checked}
                >
                  Chọn
                </Button>
              </div>
            }
            renderItem={item => (
              <List.Item>
                <div className="d-flex align-items-center">
                  <CustomStyle
                    mr={{ xs: 's2' }}
                    width="30px"
                    style={{ marginRight: 15 }}
                  >
                    <img
                      src={item?.logo ?? defaultImageStore}
                      alt=""
                      style={{ maxWidth: '100%' }}
                    />
                  </CustomStyle>
                  <div>
                    <div
                      className="title-list"
                      style={{ fontSize: 14, lineHeight: '18px' }}
                    >
                      {item.name}
                    </div>
                    <AddressCustom>{item?.full_address}</AddressCustom>
                  </div>
                </div>
                <div>
                  {!item?.name.includes('SANDBOX') &&
                  dataDetail.normal_address !== item.normal_address ? (
                    <Tooltip
                      mouseEnterDelay={0.5}
                      title="Địa chỉ lấy hàng của hàng hóa phải giống địa chỉ kho trên sàn (xã, huyện/quận, tỉnh/TP, Quốc gia)"
                    >
                      <Checkbox
                        disabled={true}
                        value={item.id}
                        onChange={handleChecked}
                        checked={item.id == storeChecked.checked}
                      />
                    </Tooltip>
                  ) : (
                    <Checkbox
                      disabled={
                        item.status === 'inactive' ||
                        item.auth_status === 'token_expired' ||
                        (dataDetail.normal_address !== item.normal_address &&
                          !item?.name.includes('SANDBOX'))
                      }
                      value={item.id}
                      onChange={handleChecked}
                      checked={item.id == storeChecked.checked}
                    />
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </SectionWrapper>
  );
}
const WrapperAction = styled.div`
  display: flex;
  background: #fff;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.stroke};
`;

const BoxStatusCustom = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
`;

const ButtonChose = styled.div`
  .btn-select-store {
    background: #ffffff;
    border: 1px solid #ebebf0;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    height: 35px;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: space-around;

    .btn-title {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #333333;
    }
  }
`;
const AddressCustom = styled.div`
  font-size: 12px;
  color: #717c71;
  margin-top: 2px;
`;
