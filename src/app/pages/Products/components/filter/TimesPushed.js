import React from 'react';
import { Checkbox } from 'app/components';

const times = [
  { value: '0-500', label: 'Dưới 500 lượt' },
  { value: '500-1000', label: 'Từ 500 - 1,000 lượt' },
  { value: '1000-2000', label: 'Từ 1,000 - 2,000 lượt' },
  { value: '2000-max', label: 'Trên 2,000 lượt' },
];

export default function TimesPushedFilter(props) {
  const handleChange = value => {
    props.onChangeTimesPushed(value);
  };

  return (
    <Checkbox.Group
      options={times}
      defaultValue={props.value}
      onChange={handleChange}
      value={props.value ? props.value : []}
    />
  );
}
