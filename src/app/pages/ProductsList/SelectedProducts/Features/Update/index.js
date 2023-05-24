import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Form as F, Space, Modal, List, Tooltip } from 'antd';
import { isEmpty, omitBy, isNil, isEqual, cloneDeep, uniq } from 'lodash';
import { Button, PageWrapper, Form, Checkbox, Select } from 'app/components';
import { defaultImage, defaultImageStore } from 'assets/images';
import constants from 'assets/constants';
import { globalActions } from 'app/pages/AppPrivate/slice';
import usePrevious from 'app/hooks/UsePrevious';
import notification from 'utils/notification';
import {
  numberOfVariation,
  convertExtraAttributesToAttributes,
  handleAttributesInForm,
} from 'app/pages/ProductsList/utils';
import {
  selectLoading,
  selectDetails,
  selectListSelected,
  selectListStores,
  selectListUpdateDetail,
} from '../../slice/selectors';
import { useSelectedProductsSlice } from '../../slice';
import {
  Description,
  ListVariations,
  ProductImages,
  Store,
  Name,
  Category,
  Price,
  ListSelected,
  Attributes,
  AttributesShopee,
  ShortDescription,
} from 'app/pages/ProductsList/Components';
import styled from 'styled-components';
import { CustomStyle } from 'styles/commons';
import Confirm from 'app/components/Modal/Confirm';
import { getStoreCategories, getAttributes, getStores } from 'utils/providers';
import CategoriesModal from 'app/components/Modal/CategoriesModal';
import { ProductImagesModal } from 'app/pages/ProductsList/Components/modals';
import { CustomSectionWrapper } from '../../../Components/styled';
import { getCategoriesTikTok } from 'utils/common';

const Item = F.Item;

const getIdFromUrl = search => {
  const params = new URLSearchParams(search);
  const ids = params.get('ids');
  if (!ids) return null;
  return uniq(ids.split(','));
};

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};
const listWarning = [
  { lazada: 'color_family', origin: 'Màu sắc' },
  { lazada: 'size', origin: 'Kích cỡ' },
];
export function UpdateSelectedProducts({ location, history }) {
  const dispatch = useDispatch();
  const { actions } = useSelectedProductsSlice();
  const [form] = Form.useForm();
  const listStores = useSelector(selectListStores);
  const isLoading = useSelector(selectLoading);
  const details = useSelector(selectDetails);
  const listSelected = useSelector(selectListSelected);
  const listUpdateDetail = useSelector(selectListUpdateDetail);

  // const [, forceUpdate] = useState();
  const [variations, setVariations] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [originDetails, setOriginDetails] = useState([]);
  const [current, setCurrent] = useState({});
  const [showProductImagesModal, setShowProductImagesModal] = useState(false);
  const [detailVariations, setDetailVariations] = useState([]);
  const [listChannel, setListChannel] = useState([]);
  const [listAttributes, setListAttributes] = useState([]);
  const [isShowCategories, setIsShowCategories] = useState(false);

  const {
    id,
    has_variation,
    store_product_images,
    thumb,
    option_1,
    option_2,
    option_3,
    platform,
  } = current || {};
  const { setFieldsValue, getFieldsValue, validateFields } = form;
  const { defaultVariation, attributes } = getFieldsValue();

  const [storeChecked, setStoreChecked] = React.useState({
    checked: current?.store_id,
  });
  const [isModalStore, setIsModalStore] = React.useState();
  const [listFilter, setListFilter] = React.useState(
    platform
      ? listStores.filter(e => e.platform == current?.platform)
      : listStores,
  );
  const [defaultSelect, setDefaultSelect] = React.useState(current?.platform);

  const showModalChoose = () => {
    setIsModalStore(true);
  };

  const handleOk = () => {
    onValuesChange({ store_id: storeChecked.checked });
    setIsModalStore(false);
  };

  const handleCancel = () => {
    setIsModalStore(false);
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

  let preCurrent, draftCurrent;
  if (isEmpty(preCurrent?.current) || preCurrent.current?.id !== current.id) {
    draftCurrent = current;
  } else {
    draftCurrent = preCurrent;
  }
  preCurrent = usePrevious(draftCurrent) || {};

  useEffect(() => {
    setListFilter(
      platform
        ? listStores.filter(e => e.platform == current?.platform)
        : listStores,
    );
    setStoreChecked({ checked: current?.store_id || null });
    setDefaultSelect(current?.platform);
  }, [isModalStore]);

  useEffect(() => {
    const ids = getIdFromUrl(location.search);
    if (isEmpty(listSelected) && !ids) {
      // history.push('/selected-products');
    } else {
      const listCurrent = details.filter(v => ids.includes(v.id));
      if (isEmpty(listCurrent)) {
        getData(ids);
      }
      dispatch(actions.getDetailDone(listCurrent));
      // if (isEmpty(listSelected)) {
      //   dispatch(actions.setListSelected(ids));
      //   getData(ids);
      // } else {
      //   getData(listSelected);
      // }
    }
    if (isEmpty(listStores)) {
      getStores()
        .then(res => {
          if (!isEmpty(res?.data)) dispatch(actions.setListStores(res?.data));
        })
        .catch(() => null);
    }

    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone([]));
      dispatch(actions.clearData());
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(listSelected)) {
      history.replace({
        search: `ids=${listSelected.join(',')}`,
      });
    }
  }, [listSelected]);

  useEffect(() => {
    const firstItem = details?.find(
      item => item.id === getIdFromUrl(location.search)[0],
    );
    if (details.forceUpdate) {
      setCurrent(firstItem);
      setOriginDetails(details);
      return;
    }
    if (isEmpty(current) || !details.some(item => item.id === current.id))
      setCurrent(firstItem);
    // const ids = getIdFromUrl(location.search);
    if (isEmpty(originDetails)) setOriginDetails(details);
  }, [details]);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Sản phẩm đã chọn',
          link: '/selected-products',
        },
        {
          name: 'Chi tiết sản phẩm',
        },
      ],
      fixWidth: true,
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            <Space>
              <Button
                context="secondary"
                onClick={pushStores}
                needWait
                disabled={listUpdateDetail.some(
                  item => item.status === 'loading',
                )}
                width={145}
                className="btn-sm"
              >
                <span>Đưa lên cửa hàng</span>
              </Button>
              {/* <Button
                onClick={goBack}
                className="btn-sm"
                context="secondary"
                // color="white"
              >
                <span>Trở về</span>
              </Button> */}
              <Button
                className="btn-sm mr-2"
                // disabled={!id}
                width={100}
                onClick={submitAll}
                color="blue"
              >
                <span>Lưu</span>
              </Button>
            </Space>
          </div>
        </Item>
      ),
    };
    if (!isEmpty(current) && !isEqual(preCurrent, current)) {
      const dataUse = preCurrent.id === current.id ? current : preCurrent; // change current

      const newDetails = details.map(item => {
        return item.id === dataUse.id
          ? {
              ...dataUse,
              variations,
              attributes,
              platform_extra_attributes: listAttributes,
            }
          : item;
      });
      if (!isEqual(newDetails, details)) {
        // dispatch(actions.getDetailDone(newDetails));
      }
    }
    dataBreadcrumb.title = current?.name;
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [current, variations, listAttributes]);

  useEffect(() => {
    if (!platform) {
      setListChannel([]);
      return;
    }
    // if (preCurrent.platform !== platform) {
    //   setListChannel([]);
    // }
    // setListAttributes(current[`${current.platform}_attributes`]);

    if (platform === 'tiktok') {
      getCategoriesTikTok().then(data => {
        setListChannel(data);
        setFieldsValue({
          primary_cat_id: current.primary_cat_id?.toString(),
        });
      });
    } else {
      getStoreCategories({
        platform: current?.platform,
        odii_cat_id: current.product_category_id,
        page_size: 100,
      })
        .then(result => {
          if (result.is_success) {
            // let handleChannels = result.data.data;
            // const listAllow = current?.top_category?.lazada_categories_allow;
            // if (listAllow) {
            //   handleChannels = result.data.filter(item =>
            //     listAllow.includes(item.name),
            //   );
            // }
            // setListChannel(handleChannels);
            // if ( // default cat lazada by cat odii (odii_product_categories_metadata)
            //   isEmpty(
            //     current?.primary_cat_metadata &&
            //       current?.platform === 'lazada' &&
            //       !isEmpty(current?.odii_product_categories_metadata),
            //   )
            // ) {
            //   handleSetCurrent('primary_cat_metadata')(
            //     current.odii_product_categories_metadata,
            //   );
            // }
            const catData = result.data;
            setListChannel(catData);
            const originDetailItem = originDetails.find(
              v => v.id === current.id,
            );
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
              originDetailItem.platform === current.platform &&
              originDetailItem.primary_cat_id
            ) {
              setFieldsValue({
                primary_cat_id: originDetailItem.primary_cat_id,
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
            if (preCurrent.platform !== platform && platform === 'shopee') {
              setVariations(
                (isEmpty(variations) ? current.variations : variations).map(
                  v => ({
                    ...v,
                    status: 'active',
                    isDisabled: false,
                  }),
                ),
              );
            }
          } else {
            setListChannel([]);
          }
        })
        .catch(err => {
          setListChannel([]);
        });
    }
  }, [current?.platform]);
  useEffect(() => {
    if (!isEmpty(current)) {
      const newAttributes = isEmpty(current.attributes)
        ? convertExtraAttributesToAttributes(
            current.platform,
            isEmpty(current?.platform_extra_attributes)
              ? current?.[`${current.platform}_attributes`]
              : current?.platform_extra_attributes,
          )
        : current.attributes;
      setFieldsValue({
        name: current?.name || '',
        store_id: current?.store_id || null,
        description: current?.description || '',
        short_description: current?.short_description || '',
        defaultVariation: current?.variations?.[0] || { box_length_cm: '' },
        thumb: current?.thumb || null,
        attributes: isEmpty(newAttributes) ? '' : newAttributes,
        store_product_images: current?.store_product_images || [],
        product_category: current?.product_category || [],
        has_variation: current?.has_variation,
        tags: current?.tags || [],
        // variations: current?.variations,
      });

      if (isEmpty(variations) || !isEqual(variations, current?.variations)) {
        setVariations(current?.variations || []);
      }
      setPromotions(current?.promotions || []);
    } else {
    }
  }, [current, isModalStore]);
  useEffect(() => {
    if (!current?.platform) {
      setListChannel([]);
      setListAttributes([]);
      return;
    }

    if (!current?.primary_cat_id) {
      setListAttributes([]);
      return;
    }
    if (preCurrent.primary_cat_id == current?.primary_cat_id) {
      return;
    }
    const {
      primary_cat_id,
      product_id,
      platform,
      store,
      product_category,
      product_category_id,
      platform_extra_attributes,
    } = current;

    if (platform !== 'tiktok') {
      getAttributes({
        platform_category_id: primary_cat_id,
        platform,
        product_category_id: product_category_id || product_category?.id,
        product_id,
      })
        .then(result => {
          if (result.is_success) {
            const dataAttributes = result.data.attributes.map((v, i) => ({
              ...v,
              value:
                store?.platform === platform
                  ? platform_extra_attributes?.[i]?.value || ''
                  : '',
            }));

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
                      handleItem.odiiOption = 'Kích cỡ';
                      break;
                    // case 'services':
                    //   handleItem.odiiOption = 'Dịch Vụ';
                    //   break;
                    default:
                      break;
                  }
                  listOptionAccept.push({ ...itemAttr, ...handleItem });
                }

                // if (!isEmpty(itemAttr)) {
                //   const listOptionDisabled = [];
                //   const options = [option_1, option_2, option_3];
                //   options.forEach((item, i) => {
                //     if (
                //       !item ||
                //       !listOptionAccept.some(v => v.odiiOption === item)
                //     ) {
                //       listOptionDisabled.push(`option_${i + 1}`);
                //     }
                //   });
                //   newVariations = newVariations.reduce((final, item) => {
                //     const handleItemVariations = {
                //       option_1: item.option_1,
                //       option_2: item.option_2,
                //       option_3: item.option_3,
                //     };
                //     listOptionDisabled.forEach(v => {
                //       handleItemVariations[v] = null;
                //     });
                //     const isDisabled = final.some(
                //       v =>
                //         v.option_1 === handleItemVariations.option_1 &&
                //         v.option_2 === handleItemVariations.option_2 &&
                //         v.option_3 === handleItemVariations.option_3,
                //     );
                //     final = [
                //       ...final,
                //       {
                //         ...item,
                //         ...handleItemVariations,
                //         isDisabled,
                //         status: isDisabled ? 'inactive' : item.status,
                //       },
                //     ];
                //     return final;
                //   }, []);
                // }
              }
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
              setVariations(newVariations);
            } else {
              const originDetailItem = originDetails.find(
                v => v.id === current.id,
              );
              setVariations(originDetailItem.variations);
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
  }, [current?.primary_cat_id]);

  const getData = React.useCallback(ids => {
    dispatch(actions.getDetail(ids));
  }, []);

  const fullImages = React.useMemo(() => {
    return [...[thumb || []], ...(store_product_images || [])];
  }, [thumb, store_product_images]);

  const handleSetCurrent = type => value => {
    const newData = { ...current, [type]: value };
    if (type === 'primary_cat_metadata') {
      const lastItemId = value?.slice(-1)?.[0];
      newData.primary_cat_id = (
        lastItemId?.category_id ?? lastItemId?.id
      )?.toString();
      setIsShowCategories(false);
    }
    setCurrent(newData);
  };

  const handleShowWarning = params => {
    // if (!has_variation && isEmpty(params)) return false;
    const listOptions = [option_1, option_2, option_3];
    const listError = listWarning.filter(item => {
      if (
        params.some(v => v.name === item.lazada) &&
        !listOptions.includes(item.origin)
      ) {
        return true;
      } else return false;
    });
    if (!isEmpty(listError)) {
      notification(
        'warning',
        listError.map(item => item.origin).join(', '),
        'Vui lòng chọn danh mục khác. Sản phẩm không có thuộc tính dưới đây',
      );
      return true;
    }
    return false;
  };

  const handleErrorPushAll = (params, callBack) => {
    validateFields()
      .then(result => {
        const listError = params.filter(
          item =>
            !item.primary_cat_metadata ||
            isEmpty(item.platform_extra_attributes) ||
            item.platform_extra_attributes.some(v => {
              if (v.name === 'warranty') {
                const noWarranty =
                  item.platform_extra_attributes.find(
                    c => c.name === 'warranty_type',
                  )?.value === 'No Warranty';
                return noWarranty ? false : !v.value;
              } else {
                return !v.value;
              }
            }),
        );
        callBack();
        // if (!isEmpty(listError)) {
        //   notification(
        //     'error',
        //     listError.map(item => item.name).join(', '),
        //     "Vui lòng điền thêm danh mục và 'Thông tin thêm' cho các sản phẩn dưới đây!",
        //   );
        // } else {
        //   callBack();
        // }
      })
      .catch(err => {
        notification(
          'error',
          err?.errorFields?.map(item => item.errors.join(', ')).join(', '),
          'Error',
          // "Cần điền thêm thông tin!",
        );
      });
  };

  const submitAll = () => {
    const newDetails = details.map(item => {
      return item.id === current.id
        ? {
            ...current,
            variations,
            number_of_variation: numberOfVariation(
              current.has_variation,
              variations,
            ),
            publish_status: 'ready',
            store_product_images_ids:
              store_product_images?.map(item => item.id.toString()) ?? [],
            primary_cat_metadata:
              current.primary_cat_metadata ||
              current[`${current.platform}_product_categories_metadata`],
            primary_cat_id:
              current.primary_cat_id ||
              current[`${current.platform}_cat_id`]?.toString(),
            platform_extra_attributes: listAttributes,
            tags: (typeof current?.tags != 'object' && current?.tags) || [],
          }
        : {
            ...item,
            publish_status: 'ready',
          };
    });
    handleErrorPushAll(newDetails, () =>
      dispatch(
        actions.update({
          listData: newDetails,
        }),
      ),
    );
  };

  const pushStores = () => {
    const newDetails = details.map(item => {
      return item.id === current.id
        ? {
            ...current,
            publish_status: 'ready',
            variations,
            number_of_variation: numberOfVariation(
              current.has_variation,
              variations,
            ),
            store_product_images_ids:
              store_product_images?.map(item => item.id.toString()) ?? [],
            primary_cat_id:
              current.primary_cat_id ||
              current[`${current.platform}_cat_id`]?.toString(),
            primary_cat_metadata:
              current.primary_cat_metadata ||
              current[`${current.platform}_product_categories_metadata`],
            platform_extra_attributes: listAttributes,
            tags: current?.tags || [],
          }
        : {
            ...item,
            publish_status: 'ready',
          };
    });
    // console.log('details', details);
    handleErrorPushAll(newDetails, () =>
      dispatch(
        actions.pushStores({
          listData: newDetails,
        }),
      ),
    );
  };
  // console.log('newAttributes1 :>> ', listAttributes?.[1]?.value);
  const onValuesChange = params => {
    const newData = { ...current, variations, ...params };
    if (params.hasOwnProperty('defaultVariation')) {
      setVariations([{ ...variations[0], ...params.defaultVariation }]);
      // setCurrent({
      //   ...current,
      //   variations: [{ ...variations[0], ...params.defaultVariation }],
      // });
    } else if (params.hasOwnProperty('attributes')) {
      const newAttributes = handleAttributesInForm(
        listAttributes,
        current.platform,
        params.attributes,
      );
      // setCurrent({
      //   ...newData,
      //   attributes: { ...current.attributes, ...newData.attributes },
      // });
      setListAttributes(newAttributes);
    } else if (params.hasOwnProperty('store_id')) {
      const currentStore = listStores.find(item => item.id === params.store_id);
      if (currentStore.province_name === current.from_location.province) {
        setCurrent({
          ...newData,
          platform: currentStore?.platform,
          // primary_cat_id: current.odii_cat.store_cat_id,
        });
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
              handleCancel: () => {
                setFieldsValue({ store_id: current.store_id });
                dispatch(globalActions.hideModal());
              },
              callBackConfirm: () =>
                setCurrent({
                  ...newData,
                  platform: currentStore?.platform,
                  // primary_cat_id: current.odii_cat.store_cat_id,
                }),
            },
          }),
        );
      }
      // const lastItemId = current[
      //   `${platform}_product_categories_metadata`
      // ]?.slice(-1)?.[0];
      // const primary_cat_id = (
      //   lastItemId?.category_id ?? lastItemId?.id
      // )?.toString();
    } else {
      setCurrent(newData);
    }
  };

  const toggleImagesModal = useCallback(() => {
    setShowProductImagesModal(!showProductImagesModal);
  }, [showProductImagesModal]);

  // const toggleImagesModal = () => {
  //   setShowProductImagesModal(!showProductImagesModal);
  // };

  const onClear = () => {
    // const origin = originDetails.find(item => item.id === current.id);
    // setCurrent(origin);
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          isModalVisible: true,
          data: {
            message: 'Bạn có chắc chắn muốn thoát và huỷ phiên làm việc?',
          },
          callBackConfirm: () => history.push('/selected-products'),
        },
      }),
    );
  };

  const toggleCategoriesModal = () => {
    setIsShowCategories(!isShowCategories);
  };

  const handleDelete = () => {
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          isModalVisible: true,
          title: 'Xác nhận xoá',
          color: 'red',
          data: { message: `Bạn có chắc chắn muốn xoá '${current?.name}?'` },
          callBackConfirm: () => dispatch(actions.delete({ id: current.id })),
        },
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

  const handleListVariations = data => {
    const handleVariations = data.map(item => omitBy(item, isNil));
    return handleVariations;
    // return handleVariations.filter(item => !item.isDisabled);
  };

  const onFinish = values => {
    // if (!isFieldsTouched(id ? ['name'] : ['name'])) {
    //   return message.error('Vui lòng thêm thông tin!');
    // }
    const {
      defaultVariation,
      publish_status,
      supplier_warehousing,
      product_category,
      thumb,
      store_product_images,
      primary_cat_id,
      ...resValues
    } = values;
    // const { primary_cat_metadata, ...resCurrent } = current;
    // const primary_cat_metadata = current.map(item => {
    //   const { children, ...res } = item;
    //   return res;
    // });
    const dataSend = {
      ...resValues,
      name: resValues.name?.trim(),
      publish_status: 'ready',
      primary_cat_id:
        primary_cat_id || current[`${current.platform}_cat_id`]?.toString(),
      primary_cat_metadata:
        current[`${current.platform}_product_categories_metadata`],
      // variations: handleListVariations(variations),
      variations,
      number_of_variation: numberOfVariation(current.has_variation, variations),
      platform_extra_attributes: listAttributes,
      supplier_warehousing_id: supplier_warehousing?.id?.toString(),
      product_category_id: product_category?.id?.toString(),
      store_product_images_ids:
        store_product_images?.map(item => item.id.toString()) ?? [],
    };
    const handleDataSend = omitBy(dataSend, isNil);
    dispatch(
      actions.update({
        listData: [
          {
            // ...data,
            ...current,
            ...handleDataSend,
            // primary_cat_metadata,
          },
        ],
      }),
    );
  };
  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
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
          <>
            <Row gutter={24} justify="center">
              {details?.length === 1 || (
                <Col span={7}>
                  <ListSelected
                    listData={details}
                    listUpdateDetail={listUpdateDetail}
                    setCurrent={setCurrent}
                    current={current}
                  />
                </Col>
              )}
              <Col span={17}>
                <CustomSectionWrapper mt={{ xs: 's4' }}>
                  <div className="title">Chọn cửa hàng sẽ bán sản phẩm này</div>
                  {/* <Store layout={layout} form={form} listStores={listStores} /> */}
                  <CustomStyle width="660px" pb={20} mr={{ xs: 's4' }}>
                    <ButtonChose>
                      <div
                        className="btn-select-store"
                        onClick={showModalChoose}
                      >
                        <div className="btn-title">
                          {constants?.SALE_CHANNEL.map(item => {
                            return (
                              <>
                                {listStores.map(e => {
                                  if (e.id == current?.store_id) {
                                    if (e.platform == item.id.toLowerCase()) {
                                      return (
                                        <div className="btn-logo-icon">
                                          <CustomStyle
                                            pr={{ xs: 's3' }}
                                            display="flex"
                                            alignItems="center"
                                          >
                                            <CustomStyle
                                              mr={{ xs: 's2' }}
                                              width="16px"
                                            >
                                              <img
                                                src={item?.icon ?? defaultImage}
                                                alt=""
                                                style={{ maxWidth: '100%' }}
                                              />
                                            </CustomStyle>
                                            <CustomStyle
                                              width="calc(100% - 20px)"
                                              color={
                                                item.id == 'SHOPEE'
                                                  ? 'red'
                                                  : item.id == 'TIKTOK'
                                                  ? 'black'
                                                  : 'blue'
                                              }
                                            >
                                              <Tooltip
                                                mouseEnterDelay={0.8}
                                                title={item.name}
                                              >
                                                {item.name}
                                              </Tooltip>
                                            </CustomStyle>
                                          </CustomStyle>
                                        </div>
                                      );
                                    }
                                  }
                                })}
                              </>
                            );
                          })}
                          <div className="btn-name-store">
                            {current?.store_id
                              ? listStores.find(
                                  item => item.id == current?.store_id,
                                )?.name
                              : 'Chọn cửa hàng'}
                          </div>
                        </div>
                        <div className="btn-icon">
                          <i className="fas fa-chevron-down"></i>
                        </div>
                      </div>
                    </ButtonChose>
                  </CustomStyle>
                </CustomSectionWrapper>
                <Name layout={layout} form={form} name={current?.name} />
                {current?.platform && (
                  <Category
                    // onClick={toggleCategoriesModal}
                    platform={current.platform}
                    // odiiCat={
                    //   current?.[
                    //     `${current.platform}_product_categories_metadata`
                    //   ]
                    // }
                    disabled={isEmpty(listChannel)}
                    // data={current?.primary_cat_metadata}
                    data={listChannel}
                    handleSelectCat={handleSetCurrent('primary_cat_metadata')}
                  />
                )}
                {(isEmpty(listAttributes) && !current?.primary_cat_id) ||
                  (current?.platform === 'shopee' ? (
                    <AttributesShopee
                      // onClick={toggleCategoriesModal}
                      data={listAttributes}
                      platform={current?.platform}
                      setListAttributes={setListAttributes}
                      setFieldsValue={setFieldsValue}
                      // arrayDataAttributes={current?.platform_extra_attributes}
                      attributes={attributes || {}}
                    />
                  ) : (
                    <Attributes
                      // onClick={toggleCategoriesModal}
                      data={listAttributes}
                      platform={current?.platform}
                      setListAttributes={setListAttributes}
                      setFieldsValue={setFieldsValue}
                      // arrayDataAttributes={current?.platform_extra_attributes}
                      attributes={attributes || {}}
                    />
                  ))}
                <Description
                  layout={layout}
                  form={form}
                  platform={current?.platform}
                />
                {/* <ShortDescription layout={layout} /> */}
                <ProductImages
                  productId={id}
                  layout={layout}
                  images={fullImages}
                  reloadData={getData}
                  listIds={listSelected}
                />
                {has_variation ? (
                  <ListVariations
                    setVariations={setVariations}
                    setDetailVariations={setDetailVariations}
                    toggleImagesModal={toggleImagesModal}
                    variations={variations}
                    promotions={promotions}
                    options={[option_1, option_2, option_3]}
                  />
                ) : (
                  <Price layout={layout} defaultVariation={defaultVariation} />
                )}
              </Col>
            </Row>
            <Item shouldUpdate>
              <Row gutter={24} justify="center">
                {details?.length === 1 || <Col xs={24} md={7}></Col>}
                <Col xs={24} md={17}>
                  <CustomStyle className="d-flex justify-content-between">
                    <Button
                      color="red"
                      onClick={handleDelete}
                      className="btn-sm"
                    >
                      <span>Xoá</span>
                    </Button>
                    <Space>
                      <Button
                        color="grayBlue"
                        onClick={onClear}
                        className="btn-sm"
                      >
                        <span>Hủy</span>
                      </Button>
                      <Button
                        // onClick={onMenuClick(null, 2)}
                        type="primary"
                        htmlType="submit"
                        width={100}
                        className="btn-sm mr-2"
                        // disabled={!id}
                        color="blue"
                      >
                        <span>{id ? 'Lưu' : 'Lưu'}</span>
                      </Button>
                    </Space>
                  </CustomStyle>
                </Col>
              </Row>
            </Item>
          </>
        </Form>
      </Spin>
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
      {isShowCategories && (
        <CategoriesModal
          data={listChannel}
          defaultActives={
            current?.primary_cat_metadata ||
            (isEmpty(current?.odii_product_categories_metadata)
              ? []
              : current.odii_product_categories_metadata)
          }
          className="modal-1"
          isModalVisible={isShowCategories}
          callBackCancel={toggleCategoriesModal}
          handleConfirm={handleSetCurrent('primary_cat_metadata')}
        />
      )}
      <Modal
        visible={isModalStore}
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
                  <div
                    className="title-list"
                    style={{ fontSize: 14, lineHeight: '18px' }}
                  >
                    {item.name}
                  </div>
                </div>
                <div>
                  <Checkbox
                    disabled={
                      item.status === 'inactive' ||
                      item.auth_status === 'token_expired'
                    }
                    value={item.id}
                    onChange={handleChecked}
                    checked={item.id == storeChecked.checked}
                  />
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </PageWrapper>
  );
}

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
    justify-content: space-between;
    padding-right: 12px;

    .btn-title {
      display: flex;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #333333;
      align-items: center;
      height: 100%;

      .btn-logo-icon {
        display: flex;
        align-items: center;
        height: 100%;
        width: 105px;
        background: #f7f7f9;
        border: 1px solid #ebebf0;
        border-radius: 4px 0px 0px 4px;
        justify-content: center;
        margin-right: 24px;
      }

      .btn-name-store {
        padding-left: 11px;
      }
    }
  }
`;
