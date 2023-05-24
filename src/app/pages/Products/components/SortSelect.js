import React from 'react';
import { SortSelect as Select } from '../styles/Main';
const { Option } = Select;

const SORT_VALUE = [
  {
    name: 'Mới nhất',
    type: 'newer',
    value: {
      order_by: '',
      order_direction: '',
    },
  },
  {
    name: 'Giá: Thấp đến cao',
    type: 'price_asc',
    value: {
      order_by: 'price',
      order_direction: 'asc',
    },
  },
  {
    name: 'Giá: Cao đến thấp',
    type: 'price_desc',
    value: {
      order_by: 'price',
      order_direction: 'desc',
    },
  },
];

export default function SortSelect({ handleFilter, value }) {
  const handleSort = option => {
    const currentSort = SORT_VALUE.find(v => v.type === option);
    handleFilter(currentSort.value);
  };

  return (
    <Select placeholder="Sắp xếp theo" onSelect={handleSort} value={value}>
      {SORT_VALUE.map(v => (
        <Option value={v.type} key={v.type}>
          {v.name}
        </Option>
      ))}
    </Select>
  );
}
