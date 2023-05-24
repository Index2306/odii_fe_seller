import React from 'react';
import { Row, Col } from 'antd';
import { isEmpty, cloneDeep } from 'lodash';
import { Input, Form, Select, Button, InputNumber } from 'app/components';
import { CustomSectionWrapper } from './styled';

const Item = Form.Item;

function AttributesShopee({
  platform,
  data,
  attributes,
  setFieldsValue,
  setListAttributes,
}) {
  const [listRequired, setListRequired] = React.useState([]);
  const [listFullRequired, setListFullRequired] = React.useState([]);
  const [listOptions, setListOptions] = React.useState([]);
  const [showOption, setShowOption] = React.useState(false);

  React.useEffect(() => {
    if (isEmpty(listFullRequired) && !isEmpty(listRequired)) {
      setListFullRequired(listRequired);
    }
    if (attributes.warranty_type === 'No Warranty') {
      setListRequired(listRequired.filter(item => item.name !== 'warranty'));
      setListAttributes(
        cloneDeep(data)?.map(v => {
          if (v.name === 'warranty') {
            v.value = '';
          }
          return v;
        }),
      );
      setFieldsValue({ attributes: { warranty: '' } });
    } else if (!isEmpty(listFullRequired)) {
      // setListRequired(listFullRequired);
      // setListFullRequired([]);
    }
  }, [attributes.warranty_type]);
  // React.useEffect(() => {
  //   if (isEmpty(listFull) && !isEmpty(finalData)) {
  //     setListFull(finalData);
  //   }
  //   if (attributes.warranty_type === 'No Warranty') {
  //     setFinalData(finalData.filter(item => item.name !== 'warranty'));

  //     setListAttributes(
  //       cloneDeep(data)?.map(v => {
  //         if (v.label === 'Warranty Period') {
  //           v.value = '';
  //         }
  //         return v;
  //       }),
  //     );
  //     setFieldsValue({ attributes: { warranty: '' } });
  //   } else if (!isEmpty(listFull)) {
  //     setFinalData(listFull);
  //     // setListFull([]);
  //   }
  // }, [attributes.warranty_type]);

  // React.useEffect(() => {
  //   if (isEmpty(data)) return;
  //   let handleData = [...data];
  //   if (data?.find(v => v.label === 'Warranty Type')?.value === 'No Warranty') {
  //     handleData = data.filter(item => item.name !== 'warranty');
  //   }
  //   setListFull(data);
  //   setFinalData(handleData);
  // }, [data]);

  React.useEffect(() => {
    if (!isEmpty(data)) {
      // const { listR, listO } = data.reduce(
      //   (final, item) => {
      //     if (
      //       item.is_mandatory &&
      //       item.is_sale_prop === 1 &&
      //       item.attribute_type === 'sku' &&
      //       isMultiValue(item)
      //     ) {
      //       // yêu cầu nhập trường này ở list variation (Rất ít cat yêu cầu cái này)
      //     } else {
      //       if (item.is_mandatory) {
      //         // Hiện thị form nhập ở section product (Không phải trong list variation)
      //         final.listR.push(item);
      //         return final;
      //       }
      //       if (item.label == 'Warranty Period') {
      //         const newListR = [];
      //         for (const v of final.listR) {
      //           if (v.label == 'Warranty Type') {
      //             newListR.push(v);
      //             newListR.push(item);
      //           } else newListR.push(v);
      //         }

      //         final.listR = newListR;
      //         return final;
      //       }

      //       if (!item.is_mandatory) {
      //         // hiển thị ở section product, "Xem thêm" thì mới hiển thị những trường này
      //         final.listO.push(item);
      //       }
      //     }
      //     return final;
      //   },
      //   { listR: [], listO: [] },
      // );

      // setFinalData(finalData.filter(item => item.name))
      const listR = data.slice(0, 6);
      const listO = data.slice(6);
      let handleListR = [...listR];
      if (
        (attributes?.warranty_type ||
          data?.find(v => v.label === 'Warranty Type')?.value) === 'No Warranty'
      ) {
        handleListR = listR.filter(item => item.name !== 'warranty');
        setListFullRequired(listR);
      }
      setListRequired(handleListR);
      setListOptions(listO);
    } else {
      setListRequired([]);
      setListOptions([]);
    }
    // setShowOption(false);
  }, [data]);

  const handleShowOption = () => {
    setShowOption(!showOption);
  };

  const renderInput = value => {
    const {
      input_type,
      attribute_value_list,
      attribute_type,
      format_type,
      attribute_unit,
    } = value;
    switch (input_type) {
      case 'TEXT_FILED':
        // case 'numeric':
        // case 'richText':
        if (format_type === 'QUANTITATIVE') {
          const lastUnit = attribute_unit.slice(-1).pop();
          return (
            // <InputNumber
            //   size="large"
            //   formatter={value => `${value} ${lastUnit}`}
            //   parser={value => value.replace(`/${lastUnit}\s?|(,*)/g`, '')}
            // />
            <Input type="number" addonAfter={lastUnit} />
          );
          // return (
          //   <Input.Group compact>
          //     <Select style={{ width: '30%' }} defaultValue="Home">
          //       <Select.Option value="Home">Home</Select.Option>
          //       <Select.Option value="Company">Company</Select.Option>
          //     </Select>
          //     <Input style={{ width: '70%' }} />
          //   </Input.Group>
          // );
        }
        return <Input />;
      case 'COMBO_BOX':
      case 'MULTIPLE_SELECT_COMBO_BOX':
      case 'DROP_DOWN':
        // case 'multiEnumInput':
        let handleOption = attribute_value_list;

        // if (name === 'color_family') {
        //   handleOption = warranties;
        // }
        const isSingle =
          input_type === 'DROP_DOWN' || input_type === 'COMBO_BOX';
        return (
          <Select
            mode={isSingle ? '' : 'multiple'}
            // defaultValue={text}
            // value={newStatus?.id === detail?.id ? newStatus?.name : text}
            // style={{ width: 120 }}
            // onSelect={handleShowConfirm(record)}
            // filterOption={(input, option) =>
            //   option.props.children
            //     .toLowerCase()
            //     .indexOf(input.toLowerCase()) >= 0
            // }
          >
            {handleOption?.map(v => (
              <Select.Option
                key={v.original_value_name}
                value={v.original_value_name}
              >
                {v.display_value_name}
              </Select.Option>
            ))}
          </Select>
        );

      default:
        break;
    }
  };

  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="title">Thông tin thêm</div>
        <div className="">
          <div className="">
            <Row gutter={24}>
              {listRequired?.map(item => (
                <Col xs={24} lg={12} key={item.original_attribute_name}>
                  <Item
                    name={['attributes', item.original_attribute_name]}
                    label={
                      item.display_attribute_name ||
                      item.original_attribute_name
                    }
                    // {...layout}
                    rules={[
                      {
                        required:
                          item.is_mandatory ||
                          item.original_attribute_name === 'warranty',
                        message: `Please input your ${
                          item.display_attribute_name ||
                          item.original_attribute_name
                        }!`,
                      },
                      // {
                      //   validator: (_, value) => {
                      //     if (item.format_type === 'QUANTITATIVE') {
                      //       if (!value || /^\d+$/.test(value))
                      //         return Promise.resolve();
                      //       return Promise.reject(new Error('111'));
                      //     }
                      //   },
                      // },
                    ]}
                  >
                    {renderInput(item)}
                  </Item>
                </Col>
              ))}
            </Row>

            {showOption && (
              <Row gutter={24}>
                {listOptions?.map(item => (
                  <Col xs={24} lg={12} key={item.original_attribute_name}>
                    <Item
                      name={['attributes', item.original_attribute_name]}
                      label={
                        item.display_attribute_name ||
                        item.original_attribute_name
                      }
                      rules={[
                        {
                          required:
                            item.is_mandatory ||
                            item.original_attribute_name === 'warranty',
                          message: `Please input your ${
                            item.display_attribute_name ||
                            item.original_attribute_name
                          }!`,
                        },
                      ]}
                    >
                      {renderInput(item)}
                    </Item>
                  </Col>
                ))}
              </Row>
            )}

            {isEmpty(listOptions) || (
              <Row>
                <Col>
                  <Button
                    className="btn-sm"
                    color="green"
                    mb={{ xs: 's5' }}
                    onClick={handleShowOption}
                  >
                    {showOption ? 'Thu gọn' : 'Xem thêm'}
                  </Button>
                </Col>
              </Row>
            )}
          </div>
        </div>
      </CustomSectionWrapper>
    </div>
  );
}

export default AttributesShopee;
