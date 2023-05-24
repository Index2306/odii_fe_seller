import React from 'react';
import { Radio } from 'antd';

export default function RatingFilter(props) {
  const onChange = e => {
    props.onChangeRating(e.target.value);
  };

  return (
    <Radio.Group
      onChange={onChange}
      value={props.value}
      className="drawer-item-rating"
    >
      <Radio value={5}>
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
      </Radio>

      <Radio value={4}>
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="far fa-star" />
        <span>Trở lên</span>
      </Radio>

      <Radio value={3}>
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="far fa-star" />
        <i className="far fa-star" />

        <span>Trở lên</span>
      </Radio>

      <Radio value={2}>
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="far fa-star" />
        <i className="far fa-star" />
        <i className="far fa-star" />

        <span>Trở lên</span>
      </Radio>

      <Radio value={1}>
        <i className="fas fa-star" />
        <i className="far fa-star" />
        <i className="far fa-star" />
        <i className="far fa-star" />
        <i className="far fa-star" />

        <span>Trở lên</span>
      </Radio>
    </Radio.Group>
  );
}
