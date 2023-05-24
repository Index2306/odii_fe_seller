import React from 'react';
import styled from 'styled-components/macro';
import { ProductCategoryList } from '../styles/Header';
import request from 'utils/request';
import { Dropdown } from 'antd';
// import { DownOutlined } from '@ant-design/icons';
import { Image } from 'app/components';
import Color from 'color';
import { genImgUrl } from 'utils/helpers';
import MoreIcon from 'assets/images/more.svg';
import { CustomStyle } from 'styles/commons';

export default function Categories(props) {
  const [categories, setCategories] = React.useState([]);
  const [categoriesInDropDown, setCategoriesInDropDown] = React.useState([]);
  const [selected, setSelected] = React.useState('');
  const [isShowAll, setIsShowAll] = React.useState(false);

  React.useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  React.useEffect(() => {
    const getCategories = async () => {
      const response = await request(
        'product-service/categories-listing?page=1&page_size=100&is_top=true',
        {},
      )
        .then(response => response)
        .catch(error => error);

      if (response.is_success) {
        const listDataDropdown = response.data.slice(9);
        setCategoriesInDropDown(listDataDropdown);
        setCategories(response.data);
        props.onCategoryCallBack(response.data);
      }
    };

    getCategories();
  }, []);

  const handleShowAll = () => {
    setIsShowAll(!isShowAll);
  };

  const handleChangeCategory = value => {
    props.onChangeCategory(value);
  };

  const menu = (
    <DropdownBody>
      {categoriesInDropDown.map(item => (
        <CustomStyle
          onClick={() =>
            handleChangeCategory(item.id === selected ? '' : item.id)
          }
        >
          <CustomStyle
            className={`${item.id === selected ? 'active' : ''} menu-item`}
          >
            <CustomStyle mr={{ xs: 's3' }}>
              <Image src={item?.thumb?.location} size="20x20" alt="" />
            </CustomStyle>
            {item.name}
          </CustomStyle>
        </CustomStyle>
      ))}
    </DropdownBody>
  );

  return (
    <ProductCategoryList className={isShowAll ? 'category-showall' : ''}>
      {categories?.map(category => (
        <CategoryItem
          category={category}
          key={category.id}
          onSelect={handleChangeCategory}
          isActive={category.id === selected}
        />
      ))}
      <Dropdown overlay={menu} placement="bottomRight">
        <div
          className="category-item category-item-button"
          // onClick={handleShowAll}
        >
          <div className="category-thumb">
            <img src={MoreIcon} alt="" />
          </div>

          <div className="category-name">
            {isShowAll ? 'Thu gọn' : 'Danh mục khác'}
          </div>
        </div>
      </Dropdown>
    </ProductCategoryList>
  );
}

function CategoryItem(props) {
  const handleClick = () => {
    if (props.isActive) {
      props.onSelect();
    } else {
      props.onSelect(props.category.id);
    }
  };

  return (
    <div
      className={`category-item ${props.isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="category-thumb">
        <img
          src={genImgUrl({
            width: 300,
            height: 300,
            location: props.category?.thumb?.location,
          })}
          alt=""
        />
      </div>

      <div className="category-name">{props.category?.name}</div>
    </div>
  );
}

const DropdownBody = styled.div`
  width: 250px;
  height: 400px;
  overflow: hidden;
  overflow-y: scroll;
  background-color: #fff;
  .menu-item {
    cursor: pointer;
    display: flex;
    padding: 7px;
    color: ${({ theme }) => theme.gray2};
    :hover {
      background-color: ${({ theme }) => theme.backgroundBlue};
    }
    &.active {
      color: #fff;
      background-color: ${({ theme }) => Color(theme.primary).fade(0.1)};
    }
  }
`;
