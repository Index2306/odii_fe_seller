import React from 'react';
import { ProductPagination as Pagination } from '../styles/Main';
import { useSelector } from 'react-redux';
import { selectPagination } from '../slice/selectors';

export default function ProductPagination(props) {
  const pagination = useSelector(selectPagination);

  const showTotal = () => {
    return `Trang: ${pagination?.page ?? '_'} / ${
      pagination?.last_page ?? '_'
    }`;
  };

  const itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <i className="far fa-chevron-left" />;
    }
    if (type === 'next') {
      return <i className="far fa-chevron-right" />;
    }
    return originalElement;
  };

  const handleChangePage = (page, pageSize) => {
    props.onChangePage(page);
  };

  return (
    <Pagination
      total={pagination?.total}
      current={pagination?.page}
      showTotal={showTotal}
      itemRender={itemRender}
      pageSize={props.searchParams.page_size}
      onChange={handleChangePage}
      showSizeChanger={false}
    />
  );
}
