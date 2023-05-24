/**
 *
 * SelectedProducts - Sản phẩm đang chọn
 *
 */
import * as React from 'react';
// import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  PageWrapper,
  EmptyPage,
  // BoxColor,
  Button,
  // Select,
} from 'app/components';
import { isEmpty } from 'lodash';
import { Tooltip } from 'antd';
// import constants from 'assets/constants';
import { tooltip } from 'assets/images/dashboards';
import { SearchOutlined } from '@ant-design/icons';
import {
  // SectionWrapper,
  CustomTitle,
  CustomStyle,
} from 'styles/commons';
// import { defaultImage } from 'assets/images';
// import { formatMoney } from 'utils/helpers';
// import { EditOutlined } from '@ant-design/icons';
import { useSelectedProductsSlice } from './slice';
import { getStores } from 'utils/providers';

import {
  // selectLoading,
  // selectData,
  // selectPagination,
  // selectListSelected,
  // selectListStores,
  selectShowEmptyPage,
} from './slice/selectors';
import { messages } from './messages';
import { CardList } from './Components';

export function SelectedProducts({ history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useSelectedProductsSlice();
  // const isLoading = useSelector(selectLoading);
  // const data = useSelector(selectData);
  // const pagination = useSelector(selectPagination);
  // const listSelected = useSelector(selectListSelected);
  // const listStores = useSelector(selectListStores);
  const showEmptyPage = useSelector(selectShowEmptyPage);

  React.useEffect(() => {
    getStores()
      .then(res => {
        if (!isEmpty(res?.data)) dispatch(actions.setListStores(res?.data));
      })
      .catch(() => null);
    return () => {
      dispatch(actions.resetWhenLeave());
    };
  }, []);

  // const gotoPage = ({ p = pagination.page, keyword = '' } = {}) => {
  //   dispatch(actions.getData({ page: p, keyword }));
  // };

  const goSearch = () => {
    history.push('products');
  };

  if (showEmptyPage) {
    return (
      <EmptyPage>
        <CustomStyle className="d-flex justify-content-center">
          <Button className="btn-md" onClick={goSearch} width="250px">
            <SearchOutlined />
            &nbsp;TÌM SẢN PHẨM NGAY
          </Button>
        </CustomStyle>
      </EmptyPage>
    );
  }

  return (
    <PageWrapper>
      <CustomStyle className="d-flex justify-content-between">
        <CustomTitle>
          {t(messages.title())}
          <Tooltip
            placement="right"
            title="Hãy chọn cửa hàng, chỉnh sửa nội dung và đưa lên các cửa hàng có cùng địa chỉ kho với nhà cung cấp sản phẩm"
          >
            <img
              className="tooltip"
              src={tooltip}
              alt=""
              style={{ marginLeft: '7px' }}
            />
          </Tooltip>
        </CustomTitle>
        <Button className="btn-sm" onClick={goSearch}>
          + Tìm thêm sản phẩm
        </Button>
      </CustomStyle>
      <CardList history={history} />
    </PageWrapper>
  );
}

// const WrapperOption = styled.div``;
