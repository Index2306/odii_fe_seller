import React, { useState } from 'react';
import {
  FilterButton,
  FilterDrawer as Drawer,
  DrawerButtonGroup,
} from '../styles/Main';
import DrawerItem from './DrawerItem';
import PriceFilter from './filter/Price';
import CategoryFilter from './filter/Category';
import { Button } from 'app/components';
import TimesPushedFilter from './filter/TimesPushed';
import InventoryFilter from './filter/Inventory';
import RatingFilter from './filter/Rating';

export default function FilterDrawer(props) {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState({});

  React.useEffect(() => {
    setFilter(props.filter);
  }, [props.filter]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleChangeCategories = value => {
    const filterClone = { ...filter };

    if (!value.length) {
      delete filterClone['child_category_id'];
    } else {
      filterClone['child_category_id'] = value;
    }

    setFilter(filterClone);
  };

  const handleChangePrice = value => {
    setFilter({
      ...filter,
      ...value,
    });
  };

  const handleChangeTimesPushed = value => {
    const filterClone = { ...filter };

    if (!value.length) {
      delete filterClone['filter_times_pushed'];
    } else {
      filterClone['filter_times_pushed'] = value;
    }

    setFilter(filterClone);
  };

  const handleChangeInventory = value => {
    const filterClone = { ...filter };

    if (!value.length) {
      delete filterClone['filter_quantity'];
    } else {
      filterClone['filter_quantity'] = value;
    }

    setFilter(filterClone);
  };

  const handleChangeFilter = () => {
    props.onChangeFilter(filter);
  };

  const handleResetFilter = () => {
    props.onResetFilter();
  };

  return (
    <>
      <FilterButton onClick={showDrawer}>
        <i className="far fa-layer-group" />
        Bộ lọc
      </FilterButton>

      <Drawer closable={false} onClose={onClose} visible={visible}>
        <div className="drawer-title">Bộ lọc tìm kiếm</div>

        <DrawerItem title="Giá sản phẩm">
          <PriceFilter onChangePrice={handleChangePrice} />
        </DrawerItem>

        {filter.category_id && (
          <DrawerItem title="Theo ngành hàng">
            <CategoryFilter
              onChangeCategories={handleChangeCategories}
              parentId={filter.category_id}
              selectedChildCategory={filter.child_category_id || []}
            />
          </DrawerItem>
        )}

        <DrawerItem title="Lượt chọn">
          <TimesPushedFilter
            value={filter.filter_times_pushed}
            onChangeTimesPushed={handleChangeTimesPushed}
          />
        </DrawerItem>

        <DrawerItem title="Tồn kho">
          <InventoryFilter
            value={filter.filter_quantity}
            onChangeInventory={handleChangeInventory}
          />
        </DrawerItem>

        <DrawerButtonGroup>
          <Button
            context="secondary"
            className="btn-sm"
            onClick={handleResetFilter}
          >
            Hủy
          </Button>
          <Button onClick={handleChangeFilter} className="btn-sm">
            Áp dụng
          </Button>
        </DrawerButtonGroup>
      </Drawer>
    </>
  );
}
