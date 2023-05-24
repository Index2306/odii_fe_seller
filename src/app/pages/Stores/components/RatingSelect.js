import React from 'react';
import { RatingSelect as Select, RatingSelectOption } from '../styles';
const { Option } = Select;

const ratings = [
  {
    value: 0,
    label: 'Tất cả',
    // label: (
    //   <>
    //     <i className="fas fa-star" />
    //     <i className="fas fa-star" />
    //     <i className="fas fa-star" />
    //     <i className="fas fa-star" />
    //     <i className="fas fa-star" />
    //   </>
    // ),
  },
  {
    value: '5',
    label: (
      <RatingSelectOption>
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />

        {/* <span>Trở lên</span> */}
      </RatingSelectOption>
    ),
  },
  {
    value: '4',
    label: (
      <RatingSelectOption>
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        {/* <i className="far fa-star" /> */}

        {/* <span>Trở lên</span> */}
      </RatingSelectOption>
    ),
  },
  {
    value: '3',
    label: (
      <RatingSelectOption>
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        {/* <i className="far fa-star" /> */}
        {/* <i className="far fa-star" /> */}

        {/* <span>Trở lên</span> */}
      </RatingSelectOption>
    ),
  },
  {
    value: '2',
    label: (
      <RatingSelectOption>
        <i className="fas fa-star" />
        <i className="fas fa-star" />
        {/* <i className="far fa-star" /> */}
        {/* <i className="far fa-star" /> */}
        {/* <i className="far fa-star" /> */}

        {/* <span>Trở lên</span> */}
      </RatingSelectOption>
    ),
  },
  {
    value: '1',
    label: (
      <RatingSelectOption>
        <i className="fas fa-star" />
        {/* <i className="far fa-star" />
        <i className="far fa-star" />
        <i className="far fa-star" />
        <i className="far fa-star" /> */}

        {/* <span>Trở lên</span> */}
      </RatingSelectOption>
    ),
  },
];

export default function RatingSelect(props) {
  const handleChangeRating = value => {
    props.onChangeRating(value);
  };

  return (
    <Select
      placeholder="Đánh giá"
      dropdownClassName="rating-filter-overlay"
      value={props.value}
      onSelect={handleChangeRating}
    >
      {ratings.map(rating => (
        <Option value={rating.value} key={rating.value}>
          {rating.label}
        </Option>
      ))}
    </Select>
  );
}
