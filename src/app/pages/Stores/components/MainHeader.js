import * as React from 'react';
import { Header, Title, Filter } from '../styles/Main';
import SortSelect from './SortSelect';
import FilterDrawer from './FilterDrawer';
import RatingSelect from './RatingSelect';

export default function MainHeader(props) {
  const { order_by, order_direction } = props.filter;
  const handleChangeFilter = value => {
    props.onChangeFilter(value);
  };

  const handleResetFilter = () => {
    props.onResetFilter();
  };

  const handleChangeRating = value => {
    props.onChangeRating(value);
  };

  return (
    <Header>
      <Title>{props.pagination.total} Sản phẩm</Title>

      <Filter>
        <RatingSelect
          value={props.filter.from_rating}
          onChangeRating={handleChangeRating}
        />

        <FilterDrawer
          filter={props.filter}
          onChangeFilter={handleChangeFilter}
          onResetFilter={handleResetFilter}
        />

        <SortSelect
          handleFilter={props.handleFilter}
          value={order_by ? `${order_by}_${order_direction}` : 'newer'}
        />
      </Filter>
    </Header>
  );
}
