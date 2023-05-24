import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form as F } from 'antd';
import { Input, Select } from 'app/components';
import { isEmpty } from 'lodash';
import { CustomSectionWrapper } from './styled';
import { useWarehousingSlice } from 'app/pages/Warehousing/slice';
import { selectData } from 'app/pages/Warehousing/slice/selectors';

const Item = F.Item;

const CustomWarehousing = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const listWarehousing = useSelector(selectData);
  const warehousingSlice = useWarehousingSlice();

  React.useEffect(() => {
    if (isEmpty(listWarehousing)) {
      dispatch(warehousingSlice.actions.getData());
    }
  }, [listWarehousing]);

  const handleChange = id => {
    onChange(listWarehousing.find(item => item.id === id));
  };

  return (
    <Select
      value={value?.id?.toString()}
      // labelInValue
      onChange={handleChange}
      showSearch
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {listWarehousing?.map(v => (
        <Select.Option key={v.id} value={v.id}>
          {v.name}
        </Select.Option>
      ))}
    </Select>
  );
};

function Info({ layout }) {
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };
  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <div className="">
          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="sku"
                label="SKU"
                {...layout}
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input your sku!',
                //   },
                // ]}
              >
                <Input placeholder="SKU" />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="barcode"
                label="Barcode (ISBN, UPC, GTIN, etc.)"
                {...layout}
              >
                <Input placeholder="Barcode" />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="supplier_warehousing"
                label="Chọn kho"
                valuePropName="value"
                getValueFromEvent={normFile}
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your warehousing!',
                  },
                ]}
              >
                <CustomWarehousing />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="total_quantity"
                label="Số lượng"
                {...layout}
                rules={[
                  {
                    required: true,
                    message: 'Please input your total_quantity!',
                  },
                ]}
              >
                <Input placeholder="Số lượng" />
              </Item>
            </Col>
          </Row>
        </div>
      </CustomSectionWrapper>
    </div>
  );
}

export default Info;
