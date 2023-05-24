/**
 *
 * MyProfile
 *
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  // Tabs,
  Space,
  Form as F,
} from 'antd';
import { Button, Form, Radio, InputNumber } from 'app/components';
import { SectionWrapper } from 'styles/commons';
import { useMyProfileSlice } from '../slice';
// import { useAuthSlice } from 'app/pages/Auth/slice';
import styled from 'styled-components';
import { InfoCircleOutlined } from '@ant-design/icons';
import { InputMoney } from 'app/components/DataEntry/InputNumber';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import constants from 'assets/constants';
const { roles } = constants;

const Item = F.Item;

export default function Setting({ data }) {
  const dispatch = useDispatch();
  const { actions } = useMyProfileSlice();
  const [recommendPriceOption, setRecommendOption] = useState(0);
  const currentUser = useSelector(selectCurrentUser);
  // const { actions: authActions } = useAuthSlice();
  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    dispatch(actions.getData({}));
  }, []);

  const { setFieldsValue } = form;

  useEffect(() => {
    // const { province } = getFieldsValue();
    setFieldsValue({
      recommend_price_selected_type: data?.recommend_price_selected_type || 0,
      recommend_price_ratio: data?.recommend_price_ratio || 0,
      recommend_price_plus: data?.recommend_price_plus || 0,
    });
    setRecommendOption(data?.recommend_price_selected_type);
  }, [data]);

  const goUpdate = () => {
    setIsUpdate(true);
  };

  const onFinish = values => {
    dispatch(
      actions.updateUserSetting({
        data: { ...values },
      }),
    );
    setIsUpdate(false);
  };

  const handleCancel = () => {
    setFieldsValue({
      recommend_price_selected_type: data?.recommend_price_selected_type || 0,
      recommend_price_ratio: data?.recommend_price_ratio || 0,
      recommend_price_plus: data?.recommend_price_plus || 0,
    });
    setIsUpdate(false);
  };
  const onChangeRecommendPriceOption = e => {
    setRecommendOption(e.target.value);
  };

  return (
    <>
      <Form form={form} name="profile" onFinish={onFinish}>
        <CustomSectionWrapper>
          <Row gutter={24}>
            <Col span={12}>
              <CustomItem
                name="recommend_price_selected_type"
                label="Giá bán sản phẩm"
                tooltip={{
                  title:
                    'Áp dụng cho tất cả sản phẩm. Có thể chỉnh sửa trong từng sản phẩm',
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Radio.Group
                  disabled={!isUpdate}
                  onChange={onChangeRecommendPriceOption}
                  value="recommend_price_selected_type"
                >
                  <Space>
                    <Radio value={0}>Nhân với giá NCC</Radio>
                    <Radio value={1}>Cộng với giá NCC (VNĐ)</Radio>
                  </Space>
                </Radio.Group>
              </CustomItem>
            </Col>
            <Col span={12}>
              <CustomItem
                name={
                  recommendPriceOption === 0
                    ? 'recommend_price_ratio'
                    : 'recommend_price_plus'
                }
                label={`Giá gợi ý ${
                  recommendPriceOption === 0
                    ? '(nhân với hệ số)'
                    : '(cộng thêm VNĐ)'
                }`}
                className="odii-form-item"
                rules={[
                  {
                    required: true,
                    message: `Xin vui lòng nhập ${
                      recommendPriceOption === 0 ? 'hệ số' : 'số tiền'
                    }`,
                  },
                ]}
              >
                {recommendPriceOption === 1 ? (
                  <InputMoney
                    size="large"
                    placeholder="Nhập số tiền"
                    min="0"
                    disabled={!isUpdate}
                  />
                ) : (
                  <InputNumber
                    placeholder="Nhập hệ số"
                    min="0"
                    disabled={!isUpdate}
                  />
                )}
              </CustomItem>
            </Col>
          </Row>
        </CustomSectionWrapper>
        <Item shouldUpdate>
          {isUpdate ? (
            <CustomRow className="justify-content-end">
              <Col>
                <Button
                  context="secondary"
                  color="default"
                  className="btn-sm"
                  style={{
                    marginRight: '12px',
                    color: 'white',
                    background: '#6C798F',
                    minWidth: '60px',
                  }}
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  color="blue"
                  style={{
                    minWidth: '100px',
                    height: '32px',
                  }}
                  htmlType="submit"
                >
                  Lưu
                </Button>
              </Col>
            </CustomRow>
          ) : (
            <CustomRow className="justify-content-end">
              <Col>
                <Button
                  color="blue"
                  style={{
                    minWidth: '100px',
                    height: '32px',
                  }}
                  onClick={goUpdate}
                  disabled={!currentUser?.roles?.includes(roles.owner)}
                >
                  Chỉnh sửa
                </Button>
              </Col>
            </CustomRow>
          )}
        </Item>
      </Form>
    </>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  /* min-height: 410px; */
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  padding: 32px 40px;
`;
const CustomItem = styled(Item)`
  display: block;
  .ant-picker {
    min-width: 265px;
  }
  .ant-form-item-label {
    font-weight: bold;
  }
`;

const CustomRow = styled(Row)`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;
