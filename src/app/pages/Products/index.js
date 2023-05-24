/**
 *
 * Products
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Spin, Skeleton, Breadcrumb } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useProductsSlice } from './slice';
import { messages } from './messages';
import Product from './styles';
import { isEmpty, isEqual, omitBy } from 'lodash';
import { ProductSearchBar as SearchBar } from './components/SearchBar';
import { serialize } from 'utils/helpers';
import { useLocation, useHistory } from 'react-router-dom';
import { MainWrapper } from './styles/Main';
import MainHeader from './components/MainHeader';
import ProductList from './components/ProductList';
import Pagination from './components/Pagination';
import {
  selectLoading,
  selectDetailId,
  selectIsFirstGetList,
  selectProductList,
  selectPagination,
} from './slice/selectors';
import ProductDetail from './components/ProductDetail';
import Categories from './components/Category';
import CategoryList from './components/CategoryList';
import styled from 'styled-components';

const initialSearchParams = {
  page: '1',
  page_size: '20',
};

export function Products({ match }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useProductsSlice();
  const isFirstCome = React.useRef(true);
  const loading = useSelector(selectLoading);
  const detailId = useSelector(selectDetailId);
  const isFirstGetList = useSelector(selectIsFirstGetList);
  const productList = useSelector(selectProductList);
  const pagination = useSelector(selectPagination);
  const [searchParams, setSearchParams] = React.useState(initialSearchParams);
  const [categories, setCategories] = React.useState();

  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    if (!location.search) {
      setSearchParams(initialSearchParams);
    } else {
      const searchObject = Object.fromEntries(
        new URLSearchParams(location.search),
      );

      const newSearchParams = {};

      Object.keys(searchObject).forEach(key => {
        if (
          key === 'filter_times_pushed' ||
          key === 'child_category_id' ||
          key === 'filter_quantity'
        ) {
          newSearchParams[key] = searchObject[key].split(',');
        } else {
          newSearchParams[key] = searchObject[key];
        }
      });
      if (!isEqual(newSearchParams, searchParams)) {
        setSearchParams(newSearchParams);
      }
    }
    dispatch(actions.getProductList(searchParams));
  }, []);

  React.useEffect(() => {
    history.push({
      pathname: location.pathname,
      search: serialize(searchParams),
    });
    if (!(isFirstCome.current && !isEmpty(productList))) {
      dispatch(actions.getProductList(searchParams));
    }
    if (isFirstCome.current) {
      isFirstCome.current = false;
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (match?.params?.id)
      dispatch(actions.getProductDetail(match?.params?.id));
  }, [match?.params?.id]);

  const handleSearchByKeyword = value => {
    const params = { ...searchParams };

    if (value !== '') {
      setSearchParams({
        ...params,
        keyword: value,
      });
    } else {
      delete params['keyword'];
      setSearchParams({ ...params });
    }
  };

  const handleFilter = value => {
    setSearchParams({
      ...searchParams,
      ...value,
    });
  };

  const handleChangePage = value => {
    setSearchParams({
      ...searchParams,
      page: value,
    });
  };

  const handleChangeFilter = value => {
    setSearchParams(value);
  };

  const handleChangeCategory = value => {
    const searchParamsClone = { ...searchParams };
    if (value) {
      searchParamsClone['category_id'] = value;
    } else {
      delete searchParamsClone['category_id'];
    }

    setSearchParams(searchParamsClone);
  };

  const handleChangeRating = value => {
    const searchParamsClone = { ...searchParams };

    if (value) {
      searchParamsClone['from_rating'] = value;
      searchParamsClone['to_rating'] = value;
    } else {
      delete searchParamsClone['from_rating'];
      delete searchParamsClone['to_rating'];
    }

    setSearchParams(searchParamsClone);
  };

  const handleResetFilter = () => {
    setSearchParams(initialSearchParams);
  };
  const showSkeleton = isFirstGetList && loading;
  return (
    <Spin tip="Đang tải..." spinning={!showSkeleton && loading}>
      <Product.Page>
        <Product.Header>
          {showSkeleton ? (
            <Skeleton
              active
              size="large"
              title={false}
              paragraph={{ rows: 4 }}
            />
          ) : (
            <>
              <SearchBar
                keyword={searchParams.keyword}
                searchParams={searchParams}
                onSearchByKeyword={handleSearchByKeyword}
                handleFilter={handleFilter}
              />

              {searchParams.keyword ? (
                <CategoryList
                  selected={searchParams.category_id || ''}
                  onChangeCategory={handleChangeCategory}
                  onCategoryCallBack={e => setCategories(e)}
                  onSearchByKeyword={e => setSearchParams(e)}
                />
              ) : (
                <Categories
                  selected={searchParams.category_id || ''}
                  onChangeCategory={handleChangeCategory}
                  onCategoryCallBack={e => setCategories(e)}
                />
              )}
            </>
          )}
        </Product.Header>
        <MainWrapper>
          {(searchParams.keyword || searchParams.category_id) && (
            <CustomBreadcrumb>
              <Breadcrumb>
                <Breadcrumb.Item>Tìm sản phẩm</Breadcrumb.Item>
                {searchParams?.category_id && (
                  <Breadcrumb.Item>
                    <a href="">
                      {
                        categories?.find(e => e.id == searchParams?.category_id)
                          ?.name
                      }
                    </a>
                  </Breadcrumb.Item>
                )}
                {searchParams?.keyword && (
                  <Breadcrumb.Item>
                    <a href="">Tìm kiếm "{searchParams.keyword}"</a>
                  </Breadcrumb.Item>
                )}
              </Breadcrumb>
            </CustomBreadcrumb>
          )}
          {!showSkeleton && (
            <MainHeader
              filter={searchParams}
              pagination={pagination}
              onChangeFilter={handleChangeFilter}
              onResetFilter={handleResetFilter}
              onChangeRating={handleChangeRating}
              handleFilter={handleFilter}
            />
          )}
          <ProductList showSkeleton={showSkeleton} />

          <Pagination
            searchParams={searchParams}
            onChangePage={handleChangePage}
          />
        </MainWrapper>

        {!!detailId && <ProductDetail handleFilter={handleFilter} />}
      </Product.Page>
    </Spin>
  );
}
const CustomBreadcrumb = styled.div`
  margin-bottom: 15px;

  .ant-breadcrumb {
    .ant-breadcrumb-link {
      font-weight: 400;
      font-size: 12px;
      line-height: 22px;
      color: #bdbdbd;
    }
  }
  @media (min-width: 1600px) {
    .ant-breadcrumb {
      .ant-breadcrumb-link {
        font-size: 15px;
      }
    }
  }
`;
