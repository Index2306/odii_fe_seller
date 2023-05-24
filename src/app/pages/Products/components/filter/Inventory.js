import React from 'react';
import { Checkbox } from 'app/components';

const inventoryFilter = [
  { value: '0-100', label: 'Từ 0 - 100 sản phẩm' },
  { value: '100-500', label: 'Từ 100 - 500 sản phẩm' },
  { value: '500-1000', label: 'Từ 500 - 1,000 sản phẩm' },
  { value: '1000-max', label: 'Trên 1,000 sản phẩm' },
];

export default function InventoryFilter(props) {
  const handleChange = value => {
    props.onChangeInventory(value);
  };

  return (
    <Checkbox.Group
      options={inventoryFilter}
      defaultValue={props.value}
      onChange={handleChange}
      value={props.value ? props.value : []}
    />
  );
}
