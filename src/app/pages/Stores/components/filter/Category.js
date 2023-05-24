import React from 'react';
import styled from 'styled-components/macro';
import request from 'utils/request';
import { Checkbox } from 'app/components';

export default function CategoryFilter(props) {
  const [categories, setCategories] = React.useState([]);
  const [isShowAll, setIsShowAll] = React.useState(false);

  React.useEffect(() => {
    const getCategories = async () => {
      const response = await request(
        `product-service/categories-listing?page=1&page_size=100&parent_id=${props.parentId}`,
        {},
      )
        .then(response => response)
        .catch(error => error);

      if (response.is_success) {
        const categories = response.data.map(item => {
          return { ...item, label: item.name, value: item.id };
        });
        setCategories(categories);
      }
    };

    getCategories();
  }, [props.parentId]);

  const handleChange = value => {
    props.onChangeCategories(value);
  };

  return (
    <Category className={isShowAll ? 'showall' : ''}>
      <Checkbox.Group
        options={categories}
        defaultValue={props.selectedChildCategory}
        onChange={handleChange}
      />

      <span className="view-more" onClick={() => setIsShowAll(!isShowAll)}>
        {isShowAll ? 'Thu gọn' : 'Xem thêm'}
      </span>
    </Category>
  );
}

const Category = styled.div`
  .ant-checkbox-wrapper:nth-child(n + 6) {
    display: none;
  }

  &.showall .ant-checkbox-wrapper:nth-child(n + 6) {
    display: flex;
  }

  .view-more {
    display: block;
    color: ${({ theme }) => theme.primary};
    text-decoration: underline;
  }

  &.showall .view-more {
    margin-top: ${({ theme }) => theme.space.s4}px;
  }
`;
