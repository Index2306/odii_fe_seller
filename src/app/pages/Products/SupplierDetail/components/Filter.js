import * as React from 'react';
import {
  Header,
  Title,
  Filter,
  WarehousingSelect as Select,
} from '../../styles/Main';
// import { Select } from 'app/components';
import { useSelector } from 'react-redux';
import SortSelect from '../../components/SortSelect';
import RatingSelect from '../../components/RatingSelect';
import { selectPagination } from '../../slice/selectors';

const { Option } = Select;

export default function MainHeader({
  warehousing,
  handleFilter,
  onResetFilter,
  onChangeRating,
  filter = {},
}) {
  const pagination = useSelector(selectPagination);
  const {
    from_rating,
    supplier_warehousing_id,
    order_by,
    order_direction,
  } = filter;

  const handleChangeFilter = type => value => {
    handleFilter({ [type]: value });
  };

  const handleResetFilter = () => {
    onResetFilter();
  };

  const handleChangeRating = value => {
    onChangeRating(value);
  };

  return (
    <Header>
      <Title>{pagination?.total} sản phẩm</Title>

      <Filter>
        <Select
          placeholder="Kho hàng"
          dropdownClassName="rating-filter-overlay"
          value={supplier_warehousing_id}
          onSelect={handleChangeFilter('supplier_warehousing_id')}
        >
          <Option value={0}>Kho hàng</Option>
          {warehousing.map(v => (
            <Option value={v.id} key={v.id}>
              {v.name}
            </Option>
          ))}
        </Select>
        <RatingSelect value={from_rating} onChangeRating={handleChangeRating} />
        <SortSelect
          handleFilter={handleFilter}
          value={order_by ? `${order_by}_${order_direction}` : 'newer'}
        />
      </Filter>
    </Header>
  );
}
