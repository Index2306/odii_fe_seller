import React, { useState, useEffect } from 'react';
import { Input, Select, Form } from 'app/components';
import { Row, Col } from 'antd';
import { isEmpty } from 'lodash';
import { getLocation } from 'utils/providers';
import { CustomSectionWrapper } from '../../styled';

const Item = Form.Item;

function Location({ layout, form, province }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    if (province?.value) getDistricts();
  }, [province]);

  const getDistricts = () => {
    getLocation({ parent_id: province?.value, type: 'district' }).then(res => {
      if (!isEmpty(res?.data)) setDistricts(res?.data);
    });
  };

  function getProvinces() {
    getLocation({ type: 'province' }).then(res => {
      if (!isEmpty(res?.data)) setProvinces(res?.data);
    });
  }

  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <Row>
          <Col xs={24} lg={17}>
            <Row gutter={24}>
              <Col span={12}>
                <Item
                  name={['location_data', 'country_code']}
                  label="Quốc gia"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your country!',
                    },
                  ]}
                >
                  <Select>
                    {[{ value: 'VN', label: 'Viet Nam' }]?.map(v => (
                      <Select.Option key={v.value} value={v.value}>
                        {v.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              <Col span={12}>
                <Item
                  name="province"
                  label="Tỉnh / Thành"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your province!',
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {provinces?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Item
                  name="district"
                  label="Quận / Huyện"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your district!',
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {districts?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col>
              {/* <Col span={12}>
                <Item
                  name="odii_compare_price"
                  label="Phường / Xã"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your odii_compare_price!',
                    },
                  ]}
                >
                  <Select labelInValue
                  >
                    {constants?.CURRENCY_LIST?.map(v => (
                      <Select.Option key={v.id} value={v.id}>
                        {v.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Item>
              </Col> */}
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Item
                  name={['location_data', 'address1']}
                  label="Địa chỉ"
                  {...layout}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your address!',
                    },
                  ]}
                >
                  <Input placeholder="Nhập số nhà và tên đường" />
                </Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </CustomSectionWrapper>
    </div>
  );
}

export default Location;
