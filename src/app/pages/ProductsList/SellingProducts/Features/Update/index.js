import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import styled from 'styled-components/macro';
import { Row, Col, Spin, Form as F, Space } from 'antd';
import { isEmpty, omitBy, isNil, isEqual, cloneDeep } from 'lodash';
import { Button, PageWrapper, Form } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import usePrevious from 'app/hooks/UsePrevious';
import notification from 'utils/notification';
import { getStoreCategories } from 'utils/providers';
import {
  convertExtraAttributesToAttributes,
  handleAttributesInForm,
} from 'app/pages/ProductsList/utils';
import {
  selectLoading,
  selectDetails,
  selectListSelling,
  selectListStores,
} from '../../slice/selectors';
import { useSellingProductsSlice } from '../../slice';
import {
  Description,
  ShortDescription,
  ListVariations,
  ProductImages,
  StoreDetail,
  Name,
  AttributesShopee,
  // CategoryProduct,
  Price,
  Tags,
  Supplier,
  // ListSelling,
  Category,
  Attributes,
  ProductStatus,
} from 'app/pages/ProductsList/Components';
import CategoriesModal from 'app/components/Modal/CategoriesModal';
import { CustomStyle } from 'styles/commons';
import {
  CustomSectionWrapper,
  //   WrapperCheckbox,
} from 'app/pages/ProductsList/Components/styled';
import Confirm from 'app/components/Modal/Confirm';
import { ProductImagesModal } from 'app/pages/ProductsList/Components/modals';
import { getCategoriesTikTok } from 'utils/common';

const Item = F.Item;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

const listWarning = [
  { lazada: 'color_family', origin: 'Màu sắc' },
  { lazada: 'size', origin: 'Kích cỡ' },
];
export function UpdateSellingProducts({ match, history }) {
  const dispatch = useDispatch();
  const { actions } = useSellingProductsSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const details = useSelector(selectDetails);
  const listSelling = useSelector(selectListSelling);
  const [listAttributes, setListAttributes] = useState([]);
  const [listChannel, setListChannel] = useState([]);

  // const [, forceUpdate] = useState();
  const [variations, setVariations] = useState([]);
  const [originDetails, setOriginDetails] = useState([]);
  const [current, setCurrent] = useState({});
  const [showProductImagesModal, setShowProductImagesModal] = useState(false);
  const [detailVariations, setDetailVariations] = useState([]);
  const [isShowCategories, setIsShowCategories] = useState(false);
  const {
    id,
    has_variation,
    store_product_images,
    thumb,
    option_1,
    option_2,
    option_3,
  } = current || {};
  const {
    setFieldsValue,
    getFieldsValue,
    // isFieldsTouched,
    submit,
  } = form;
  const { defaultVariation, attributes } = getFieldsValue();
  const preCurrent = usePrevious(current) || {};

  useEffect(() => {
    if (isEmpty(listSelling) && !match?.params?.id) {
      history.push('/selling-products');
    } else {
      getData(isEmpty(listSelling) ? [match?.params?.id] : listSelling);
    }
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone([]));
    };
  }, [listSelling]);

  useEffect(() => {
    if (!current?.platform) {
      setListChannel([]);
      return;
    }

    if (current?.platform === 'tiktok') {
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
      })
        .then(result => {
          if (result.is_success) {
            const catData = result.data;
            setListChannel(catData);
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
    if (details.forceUpdate) {
      setCurrent(details?.[0]);
      setOriginDetails(details);
      return;
    }
    if (isEmpty(current) || !details.some(item => item.id === current.id))
      setCurrent(details?.[0]);
    if (isEmpty(originDetails)) setOriginDetails(details);
  }, [details]);

  // useEffect(() => {
  //   if (!isEmpty(current) && !isEqual(preCurrent, current)) {
  //     const dataUse = preCurrent.id === current.id ? current : preCurrent; // change current
  //     const newDetails = details.map(item => {
  //       return item.id === dataUse.id ? { ...dataUse, variations } : item;
  //     });

  //     if (!isEqual(newDetails, details)) {
  //       dispatch(actions.getDetailDone(newDetails));
  //     }
  //   }
  //   // dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  // }, [current, variations]);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Sản phẩm đang bán',
          link: '/selling-products',
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
              <Button color="grayBlue" onClick={onClear} className="btn-sm">
                <span>Hủy</span>
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
                onClick={submit}
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
        return item.id === dataUse.id ? { ...dataUse, variations } : item;
      });

      if (!isEqual(newDetails, details)) {
        dispatch(actions.getDetailDone(newDetails));
      }
      dataBreadcrumb.title = current?.name;
    }
    dataBreadcrumb.title = current && current?.name;
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [current?.name]);

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
        primary_cat_id: current?.primary_cat_id || '',
        store_id: current?.store_id || null,
        tags: current?.tags || '',
        description: current?.description || '',
        short_description: current?.short_description || '',
        attributes: isEmpty(newAttributes) ? '' : newAttributes,
        defaultVariation: current?.variations?.[0] || { box_length_cm: '' },
        thumb: current?.thumb || null,
        store_product_images: current?.store_product_images || [],
        product_category: current?.product_category || [],
        has_variation: current?.has_variation,
        // variations: current?.variations,
      });
      setListAttributes(current.platform_extra_attributes);
      if (isEmpty(variations) || !isEqual(variations, current?.variations)) {
        setVariations(current?.variations || []);
      }
    }
  }, [current?.id]);

  // const goBack = () => {
  //   history.push('/products');
  // };

  const getData = React.useCallback(ids => {
    dispatch(actions.getDetail(ids));
  }, []);

  const fullImages = React.useMemo(() => {
    return [...[thumb || []], ...(store_product_images || [])];
  }, [thumb, store_product_images]);

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
  const onValuesChange = params => {
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
    } else {
      setCurrent({ ...current, variations, ...params });
    }
  };

  const toggleImagesModal = () => {
    setShowProductImagesModal(!showProductImagesModal);
  };

  const toggleCategoriesModal = () => {
    setIsShowCategories(!isShowCategories);
  };

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
          callBackConfirm: () => history.push('/selling-products'),
        },
      }),
    );
  };

  const handleDelete = () => {
    const isNeedActive = current?.publish_status === 'deactive';
    const isDelete = current?.publish_status !== 'deleted' && !isNeedActive;
    let textDelete = isDelete ? 'xoá' : 'khôi phục';
    if (isNeedActive) textDelete = 'kích hoạt';

    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          isModalVisible: true,
          title: `Xác nhận ${textDelete}`,
          color: isDelete ? 'red' : 'blue',
          data: {
            message: `Bạn có chắc chắn muốn ${textDelete} '${current?.name}?'`,
          },
          callBackConfirm: () =>
            dispatch(
              actions.delete({
                id: current.id,
                isDelete: current?.publish_status !== 'deleted',
                isNeedActive,
              }),
            ),
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

  const handleListVariations = (defaultVariation, resValues) => {
    const finalVariations = has_variation
      ? variations.map(({ thumb, ...res }) => ({
          ...res,
          product_image_id: thumb?.id.toString() ?? '',
        }))
      : [
          {
            ...(variations?.[0] || {}),
            is_default: true,
            ...defaultVariation,
            // origin_supplier_price: resValues.origin_supplier_price,
            // low_retail_price: resValues.low_retail_price,
            // high_retail_price: resValues.high_retail_price,
            // total_quantity: resValues.total_quantity,
          },
        ];
    const handleVariations = finalVariations.map(item => omitBy(item, isNil));
    return handleVariations;
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
      ...resValues
    } = values;

    const dataSend = {
      ...resValues,
      name: resValues.name?.trim(),
      // primary_cat_id: current[`${current.platform}_cat_id`]?.toString(),
      // primary_cat_metadata:
      //   current[`${current.platform}_product_categories_metadata`],
      platform_extra_attributes: listAttributes,
      variations: handleListVariations(defaultVariation, resValues),
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
          },
        ],
      }),
    );
  };

  const renderInfoAddition = () => {
    if (isEmpty(listAttributes) && !current?.primary_cat_id) return null;

    if (current?.platform === 'tiktok') return null;

    return (
      <>
        {current?.platform === 'shopee' ? (
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
        )}
      </>
    );
  };

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          scrollToFirstError
          form={form}
          name="normal_login"
          {...layout}
          className="login-form"
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
              <Col span={17}>
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
                    disabled
                    // data={current?.primary_cat_metadata}
                    data={listChannel}
                    handleSelectCat={handleSetCurrent('primary_cat_metadata')}
                  />
                )}
                {renderInfoAddition()}
                <Description layout={layout} form={form} />
                {/* <ShortDescription layout={layout} /> */}
                <ProductImages
                  productId={id}
                  layout={layout}
                  images={fullImages}
                  reloadData={getData}
                  listIds={listSelling}
                />
                {has_variation ? (
                  <ListVariations
                    layout={layout}
                    setVariations={setVariations}
                    setDetailVariations={setDetailVariations}
                    toggleImagesModal={toggleImagesModal}
                    form={form}
                    variations={variations}
                    options={[option_1, option_2, option_3]}
                  />
                ) : (
                  <Price
                    layout={layout}
                    defaultVariation={defaultVariation}
                    detail={current}
                  />
                )}
              </Col>
              <Col span={7}>
                <StoreDetail
                  data={current?.store}
                  shop_product_id={current?.shop_product_id}
                />
                <Supplier supplier={current?.supplier} />
                <Tags layout={layout} />
                <ProductStatus
                  name="Trạng thái sản phẩm"
                  status={current?.odii_status_name}
                />
                <ProductStatus
                  name="Trạng thái sàn"
                  status={current?.platform_status_name}
                />
                {current?.platform_reject_reason && (
                  <CustomSectionWrapper>
                    <div className="title">Lý do</div>
                    <div className="">
                      <CustomStyle
                        mb={{ xs: 's5' }}
                        p={{ xs: 's4' }}
                        className="d-flex align-items-center"
                        // border="1px solid"
                        // borderColor="stroke"
                        // borderRadius="4px"
                      >
                        <CustomStyle ml={{ xs: 's2' }}>
                          {current?.platform_reject_reason}
                        </CustomStyle>
                      </CustomStyle>
                    </div>
                  </CustomSectionWrapper>
                )}
              </Col>
            </Row>
            <Item shouldUpdate>
              <Row gutter={24}>
                <Col xs={24} md={17}>
                  <CustomStyle className="d-flex justify-content-between">
                    <Button
                      color={
                        current?.publish_status === 'deleted' ||
                        current?.publish_status === 'deactive'
                          ? 'blue'
                          : 'red'
                      }
                      onClick={handleDelete}
                      // disabled
                      disabled={current?.platform !== 'tiktok'}
                      className="btn-sm"
                    >
                      <span>
                        {current?.publish_status === 'deleted'
                          ? 'Khôi phục'
                          : current?.publish_status === 'deactive'
                          ? 'Kích hoạt'
                          : 'Xóa'}
                      </span>
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
                <Col xs={24} md={7}></Col>
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
    </PageWrapper>
  );
}
