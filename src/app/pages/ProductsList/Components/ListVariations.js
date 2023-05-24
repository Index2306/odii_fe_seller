import React, { memo, useMemo, useState, useEffect } from 'react';
import { Space, Menu, Dropdown, Tooltip, Form } from 'antd';
import { formatMoney } from 'utils/helpers';
import styled from 'styled-components';
import { List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { flatten, isEmpty, union, isNumber, isNil, omitBy } from 'lodash';
import { Table, Image, Button, Switch, Input } from 'app/components';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { CustomStyle } from 'styles/commons';
import { DownOutlined } from '@ant-design/icons';
import { useDebouncedCallback } from 'use-debounce';
import { CustomSectionWrapper } from './styled';
import { EditPrice } from './modals';

export default memo(function ListVariations({
  variations,
  setVariations,
  promotions,
  setDetailVariations,
  toggleImagesModal,
  styleWrapper = {},
  hiddenTitle,
  options = [],
  // form,
}) {
  // const { getFieldsValue } = form;
  // const { categories } = getFieldsValue();
  const [listSelected, setListSelected] = useState([]);
  const [listOption, setListOption] = useState([]);
  const [currentOption, setCurrentOption] = useState([]);
  const [statusModal, setStatusModal] = useState('');
  const [lengthPlusTable, setLengthPlusTable] = useState(0);
  const debounced = useDebouncedCallback(
    // function
    value => {
      // setVariations(value);
    },
    // delay in ms
    300,
  );
  // useEffect(() => {
  //   if (!isEmpty(categories)) {
  //     const listChecked = [];
  //     categories.forEach(currentItem => {
  //       listChecked.push(
  //         `${currentItem.parent_id ? `${currentItem.parent_id}-` : ''}${
  //           currentItem.id
  //         }`,
  //       );
  //     });
  //   }
  // }, [categories]);

  const getSupplierPriceText = record => {
    let finalPrice = record?.origin_supplier_price;
    if (!isEmpty(record?.promotion)) {
      finalPrice = record?.promotion?.final_price;
      return (
        <>
          <Tooltip
            mouseEnterDelay={0.25}
            placement="bottomLeft"
            title={`Giá gợi ý: ${formatMoney(record.recommend_retail_price)}`}
          >
            <div className="">{formatMoney(finalPrice)}</div>
            <div
              style={{
                textDecoration: 'line-through',
                color: 'gray',
                fontSize: '12px',
              }}
            >
              {formatMoney(record?.origin_supplier_price)}
            </div>
          </Tooltip>
        </>
      );
    } else {
      return <div className="">{formatMoney(finalPrice)}</div>;
    }
  };

  useEffect(() => {
    const handlePushOption = (type, list, item, position) => {
      if (
        list[position].every(v => type !== v.type || item[type] !== v.value)
      ) {
        list[position].push({ type: type, value: item[type] });
      }
    };
    const listChildOption = variations.reduce(
      (final, item) => {
        if (item.option_1) {
          handlePushOption('option_1', final, item, 0);
        }
        if (item.option_2) {
          handlePushOption('option_2', final, item, 1);
        }
        if (item.option_3) {
          handlePushOption('option_3', final, item, 2);
        }
        return final;
      },
      [[], [], []],
    );
    setListOption(flatten(listChildOption));
  }, [variations]);

  const handlePickImage = (index, isDisabled) => () => {
    if (isDisabled) return;
    setDetailVariations([index]);
    toggleImagesModal();
  };

  const handleChangeDetail = (type, index, isNumberField) => e => {
    const newVariations = variations.slice(0);
    if (type === 'status') {
      if (e) {
        newVariations[index] = { ...newVariations[index], [type]: 'active' };
      } else
        newVariations[index] = { ...newVariations[index], [type]: 'inactive' };
      setVariations(newVariations);
      return;
    }
    const value = e?.target?.value ?? e;
    if (isNumberField ? isNumber(value) : value) {
      newVariations[index] = {
        ...newVariations[index],
        [type]: isNumberField ? +value : value,
      };
    } else if (!value) {
      newVariations[index] = { ...newVariations[index], [type]: '' };
    }
    setVariations(newVariations);
    // debounced(newVariations);
  };

  const { columns } = useMemo(() => {
    if (isEmpty(variations)) return { columns: [] };
    const listOptions = [];
    let lengthTable = 0;
    for (let [i, item] of options.entries()) {
      if (item) {
        lengthTable += 150;
        listOptions.push({
          title: (
            <div className="custome-header">
              <div className="title-box">{item}</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: `option_${i + 1}`,
          key: `option_${i + 1}`,
          width: 150,
          render: (text, record, index) => (
            <Input
              size="medium"
              placeholder={item}
              disabled={record.isDisabled}
              value={text}
              onChange={handleChangeDetail(`option_${i + 1}`, index)}
            />
          ),
        });
      }
    }
    if (lengthTable) setLengthPlusTable(lengthTable);
    return {
      columns: [
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Biến thể</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'name',
          key: 'name',
          // width: 120,
          render: (text, record, index) => (
            <WrapperOption>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    record?.thumb?.location ? (
                      <Image
                        size="200x200"
                        src={record?.thumb?.location}
                        onClick={handlePickImage(index, record.isDisabled)}
                      />
                    ) : (
                      <div
                        className="add-image"
                        onClick={handlePickImage(index, record.isDisabled)}
                      >
                        <PlusOutlined />
                      </div>
                    )
                  }
                  title={text || record.sku || record.barcode}
                  // description={`${record.option_1}${
                  //   record.option_2 ? `/${record.option_2}` : ''
                  // }${record.option_3 ? `/${record.option_3}` : ''}`}
                />
              </List.Item>
            </WrapperOption>
          ),
        },
        ...listOptions,
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Tồn kho</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'total_quantity',
          key: 'total_quantity',
          width: 100,
          render: text => <div className="">{text}</div>,
        },

        {
          title: (
            <div className="custome-header">
              <div className="title-box">Giá NCC</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'origin_supplier_price',
          key: 'origin_supplier_price',
          width: 120,
          render: (text, record) =>
            !isEmpty(record?.promotion) ? (
              getSupplierPriceText(record)
            ) : (
              <Tooltip
                mouseEnterDelay={0.25}
                placement="bottomLeft"
                title={`Giá gợi ý: ${formatMoney(
                  record.recommend_retail_price,
                )}`}
              >
                {formatMoney(text)}
              </Tooltip>
            ),
        },
        // {
        //   title: (
        //     <div className="custome-header">
        //       <div className="title-box">Giá bán thấp nhất</div>
        //       {/* <div className="addition"></div> */}
        //     </div>
        //   ),
        //   dataIndex: 'low_retail_price',
        //   key: 'low_retail_price',
        //   width: 120,
        //   render: text => <div className="">{formatMoney(text)}</div>,
        // },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Giá bán</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'retail_price',
          key: 'retail_price',
          width: 120,
          render: (text, record, index) => (
            <Form.Item
              label=""
              name={`retail_price_${record.id}`}
              valuePropName="retail_price"
              style={{ marginBottom: '0px' }}
              rules={[
                {
                  type: 'number',
                  min: record.low_retail_price,
                  message: `Giá bán tối thiểu: ${formatMoney(
                    record.low_retail_price,
                  )}`,
                },
              ]}
              validateTrigger="onBlur"
            >
              <InputMoney
                placeholder="Giá"
                disabled={record.isDisabled}
                value={text}
                status="error"
                onChange={handleChangeDetail('retail_price', index, true)}
              />
            </Form.Item>
          ),
        },
        // {
        //   title: (
        //     <div className="custome-header">
        //       <div className="title-box">Giá bán gốc</div>
        //       {/* <div className="addition"></div> */}
        //     </div>
        //   ),
        //   dataIndex: 'retail_price_compare_at',
        //   key: 'retail_price_compare_at',
        //   width: 120,
        //   render: (text, _, index) => (
        //     <InputMoney
        //       placeholder="Giá"
        //       value={text}
        //       onChange={handleChangeDetail(
        //         'retail_price_compare_at',
        //         index,
        //         true,
        //       )}
        //     />
        //   ),
        // },
        {
          title: (
            <div className="custome-header">
              <div className="title-box">Lợi nhuận</div>
              {/* <div className="addition"></div> */}
            </div>
          ),
          dataIndex: 'origin_supplier_price',
          key: 'origin_supplier_price',
          width: 120,
          render: (text, record) => (
            <CustomStyle color="greenMedium">
              {record.retail_price
                ? !isEmpty(record?.promotion)
                  ? formatMoney(
                      +record.retail_price - record?.promotion?.final_price,
                    )
                  : formatMoney(
                      +record.retail_price - (record.odii_price ?? text),
                    )
                : 0}
            </CustomStyle>
          ),
        },
        {
          title: '',
          key: 'status',
          dataIndex: 'status',
          fixed: 'right',
          width: 100,
          render: (text, record, index) => {
            return (
              <div className="">
                <Space>
                  <CustomStyle
                    fontSize={{ xs: 'f5' }}
                    color="primary"
                    className="pointer"
                  >
                    {/* <EditOutlined /> */}
                  </CustomStyle>
                  <Switch
                    disabled={record.isDisabled}
                    onChange={handleChangeDetail('status', index)}
                    checked={text === 'active'}
                  ></Switch>
                </Space>
              </div>
            );
          },
        },
      ],
    };
  }, [variations]);
  const rowSelection = {
    onChange: selectedRowKeys => {
      // setListOption([]);
      setListSelected(selectedRowKeys);
    },
    getCheckboxProps: record => ({
      disabled: record.isDisabled,
    }),
  };

  const handleSelect = (type, value) => () => {
    if (type !== 'none' && currentOption.some(item => item.type === 'all'))
      return;
    let newSelected = listSelected;
    let newOption = currentOption.some(item => item.value === value)
      ? currentOption
      : [...currentOption, { type, value }];
    let optionSelected = listOption;

    const handleOption = params => {
      const lists = [];
      for (const [index, item] of variations.entries()) {
        if (item.active || item[params] === value) lists.push(index);
      }
      // const lists = variations
      //   .filter(item => item.active || item[params] === value)
      //   .map((_, index) => index);
      newSelected = union(lists, newSelected);
      optionSelected = listOption.map(item => ({
        ...item,
        active: item.active || item.value === value,
      }));
      // return { newSelected, optionSelected };
    };

    switch (type) {
      case 'all':
        newOption = [{ type, value }];
        newSelected = variations.map((_, index) => index);
        // setCurrentOption([]);
        optionSelected = listOption.map(item => ({
          ...item,
          active: false,
        }));
        break;
      case 'none':
        newSelected = [];
        newOption = [];
        // setCurrentOption([]);
        optionSelected = listOption.map(item => ({
          ...item,
          active: false,
        }));
        break;
      case 'option_1':
        handleOption('option_1');
        break;
      case 'option_2':
        handleOption('option_2');
        break;
      case 'option_3':
        handleOption('option_3');
        break;

      default:
        break;
    }
    setCurrentOption(newOption);
    setListSelected(newSelected.filter(v => !variations[v].isDisabled));
    setListOption(optionSelected);
  };

  const handleMenuClick = Type => () => {
    setStatusModal(Type);
  };

  const handleModalShow = () => {
    const listModal = [
      {
        title: 'Sửa giá',
        Component: EditPrice,
      },
    ];
    return (
      <Menu>
        {listModal.map(({ title, Component }) => (
          <Menu.Item
            key={title}
            onClick={handleMenuClick(
              <Component
                title={title}
                // data={intersectionWith(
                //   variations,
                //   listSelected,
                //   (o, id) => o.id === id,
                // )}
                data={listSelected?.map((_, index) => ({
                  ...variations?.[index],
                }))}
                variations={variations}
                setVariations={setVariations}
                callBackCancel={handleMenuClick('')}
              />,
            )}
          >
            {title}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }} {...styleWrapper}>
        {hiddenTitle || <div className="title">Biến thể đã nhập</div>}
        <CustomStyle className="" mb={{ xs: 's5' }}>
          <Space wrap>
            <span>Chọn:</span>
            <Button
              context="secondary"
              color="transparent"
              className={
                currentOption.some(item => item.type === 'all') ? 'active' : ''
              }
              onClick={handleSelect('all')}
            >
              Chọn tất cả
            </Button>
            <Button
              context="secondary"
              color="transparent"
              onClick={handleSelect('none')}
            >
              Bỏ chọn
            </Button>
            {listOption.map(item => (
              <Button
                context="secondary"
                key={item.value}
                className={item.active ? 'active' : ''}
                color="transparent"
                onClick={handleSelect(item.type, item.value)}
              >
                {item.value}
              </Button>
            ))}
          </Space>
        </CustomStyle>

        {isEmpty(listSelected) || (
          <CustomStyle
            pb={{ xs: 's5' }}
            className="d-flex align-items-center justify-content-between"
          >
            <CustomStyle fontWeight="bold" px={{ xs: 's5' }}>
              Đã chọn {listSelected.length} Biến thể
            </CustomStyle>
            <Dropdown overlay={handleModalShow()}>
              <Button
                className="btn-sm"
                // onClick={handleCancel}
                color="default"
                context="secondary"
              >
                Sửa hàng loạt &nbsp; <DownOutlined />
              </Button>
            </Dropdown>
          </CustomStyle>
        )}

        <CustomTable
          className="custom"
          columns={columns}
          // rowClassName="pointer"
          dataSource={variations || []}
          rowSelection={{
            selectedRowKeys: listSelected,
            type: 'checkbox',
            ...rowSelection,
          }}
          scroll={{ x: 820 + lengthPlusTable, y: 5000 }}
          pagination={false}
          notNeedRedirect={true}
          rowKey={(_, index) => index}
        />
      </CustomSectionWrapper>
      {statusModal}
      {/* {statusModal === 'editPrice' && <EditPrice />} */}
    </div>
  );
});

const WrapperOption = styled.div`
  .add-image {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 45px;
    height: 45px;
    border-radius: 4px;
    color: ${({ theme }) => theme.grayBlue};
    background-color: ${({ theme }) => theme.backgroundBlue};
    border: 1px dashed #d9dbe2;
  }
  .ant-image {
    cursor: pointer;
    width: 45px;
    border-radius: 4px;
  }
  .ant-list-item-meta-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ant-list-item-meta-description {
    font-weight: 400;
    font-size: 12;
    color: rgba(0, 0, 0, 0.4);
  }
`;

const CustomTable = styled(Table)`
  color: #4d4d4d;
`;
