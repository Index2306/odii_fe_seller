import React, { memo, useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Tags, Form } from 'app/components';
import styled from 'styled-components';
import { Input } from 'app/components';
import { isEmpty } from 'lodash';
const Item = Form.Item;

export default memo(function Options({
  layout,
  variations = [],
  getFieldsValue,
  setVariations,
}) {
  const [options, setOptions] = useState({
    options1: [],
    options2: [],
    options3: [],
  });

  useEffect(() => {
    setOptions(
      variations.reduce(
        (final, item) => {
          if (item.option_1 && !final.options1.includes(item.option_1)) {
            final.options1.push(item.option_1);
          }
          if (item.option_2 && !final.options2.includes(item.option_2)) {
            final.options2.push(item.option_2);
          }
          if (item.option_3 && !final.options3.includes(item.option_3)) {
            final.options3.push(item.option_3);
          }
          return final;
        },
        {
          options1: [],
          options2: [],
          options3: [],
        },
      ),
    );
  }, []);

  const { options1, options2, options3 } = options;
  const handleChangeVariations = _type => _value => {
    const allOption = { options1, options2, options3 };
    const newVariations = [];
    allOption[_type] = _value;
    setOptions(allOption);

    const {
      origin_supplier_price,
      high_retail_price,
      low_retail_price,
      total_quantity,
    } = getFieldsValue();
    const initVariation = {
      origin_supplier_price: origin_supplier_price || '',
      high_retail_price: high_retail_price || '',
      low_retail_price: low_retail_price || '',
      total_quantity: total_quantity || '',
      status: 'active',
    };
    if (!isEmpty(allOption.options1)) {
      for (const item1 of allOption.options1) {
        if (!isEmpty(allOption.options2)) {
          for (const item2 of allOption.options2) {
            if (!isEmpty(allOption.options3)) {
              for (const item3 of allOption.options3) {
                newVariations.push({
                  ...initVariation,
                  option_1: item1,
                  option_2: item2,
                  option_3: item3,
                });
              }
            } else {
              newVariations.push({
                ...initVariation,
                option_1: item1,
                option_2: item2,
              });
            }
          }
        } else {
          if (!isEmpty(allOption.options3)) {
            for (const item3 of allOption.options3) {
              newVariations.push({
                ...initVariation,
                option_1: item1,
                option_3: item3,
              });
            }
          } else {
            newVariations.push({
              ...initVariation,
              option_1: item1,
            });
          }
        }
      }
    } else {
      if (!isEmpty(allOption.options2)) {
        for (const item2 of allOption.options2) {
          if (!isEmpty(allOption.options3)) {
            for (const item3 of allOption.options3) {
              newVariations.push({
                ...initVariation,
                option_2: item2,
                option_3: item3,
              });
            }
          } else {
            newVariations.push({
              ...initVariation,
              option_2: item2,
            });
          }
        }
      } else {
        if (!isEmpty(allOption.options3)) {
          for (const item3 of allOption.options3) {
            newVariations.push({
              ...initVariation,
              option_3: item3,
            });
          }
        }
      }
    }
    setVariations(newVariations);
  };

  return (
    <div>
      <>
        {/* <div className="title">Option</div> */}
        <div className="">
          <Row gutter={24}>
            <Col span={4}>
              <Item
                name="option_1"
                label="Thuộc tính 1"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your Option 1!',
                //   },
                // ]}
              >
                <Input placeholder="" />
              </Item>
            </Col>
            <Col span={18}>
              <WrapperItem>
                <Item name="" defaultValue={options1} label="1" {...layout}>
                  <Tags
                    defaultShowInput
                    data={options1}
                    onChange={handleChangeVariations('options1')}
                  />
                </Item>
              </WrapperItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={4}>
              <Item
                name="option_2"
                label="Thuộc tính 2"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your Option 2!',
                //   },
                // ]}
              >
                <Input placeholder="" />
              </Item>
            </Col>
            <Col span={18}>
              <WrapperItem>
                <Item name="" defaultValue={options2} label="2" {...layout}>
                  <Tags
                    defaultShowInput
                    data={options2}
                    onChange={handleChangeVariations('options2')}
                  />
                </Item>
              </WrapperItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={4}>
              <Item
                name="option_3"
                label="Thuộc tính 3"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your Option 3!',
                //   },
                // ]}
              >
                <Input placeholder="" />
              </Item>
            </Col>
            <Col span={18}>
              <WrapperItem>
                <Item name="" defaultValue={options3} label="3" {...layout}>
                  <Tags
                    defaultShowInput
                    data={options3}
                    onChange={handleChangeVariations('options3')}
                  />
                </Item>
              </WrapperItem>
            </Col>
          </Row>
        </div>
      </>
    </div>
  );
});

const WrapperItem = styled.div`
  label {
    visibility: hidden;
  }
  .ant-form-item-control {
    border: 1px solid #d9d9d9;
  }
  .ant-form-item-control-input-content {
    padding: 7px;
    min-height: 38px;
  }
`;
