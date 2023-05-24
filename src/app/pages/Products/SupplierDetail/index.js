/**
 *
 * Products
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Spin, Skeleton } from 'antd';
import request from 'utils/request';
import { useSelector, useDispatch } from 'react-redux';
import { useProductsSlice } from '../slice';
import Product from '../styles';
import { isEmpty, isEqual } from 'lodash';
import { serialize } from 'utils/helpers';
import { getListWarehousing } from 'utils/providers';
import { useLocation } from 'react-router-dom';
import { MainWrapper } from '../styles/Main';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';
import {
  selectLoading,
  selectDetailId,
  selectIsFirstGetList,
  selectProductList,
} from '../slice/selectors';
import ProductDetail from '../components/ProductDetail';
import { SupplierInfo, Statistic, Filter } from './components';
import { getDetailSuppliers } from 'utils/providers';
const initialSearchParams = {
  page: '1',
  page_size: '20',
};

export function SupplierDetail({ match, history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useProductsSlice();
  const isFirstCome = React.useRef(true);
  const loading = useSelector(selectLoading);
  const detailId = useSelector(selectDetailId);
  const isFirstGetList = useSelector(selectIsFirstGetList);
  const productList = useSelector(selectProductList);
  const [searchParams, setSearchParams] = React.useState(initialSearchParams);
  const [detail, setDetail] = React.useState({});
  const [warehousing, setWarehousing] = React.useState([]);
  const [detailRate, setDetailRate] = React.useState({});
  const [dataStatistic, setDataStatistic] = React.useState({});
  const [tab, setTab] = React.useState('0');

  const location = useLocation();
  const id = match?.params?.id;

  React.useEffect(() => {
    if (!id) {
      history.push('/products');
      return;
    }
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
    getListWarehousing({ supplier_id: id })
      .then(res => {
        if (!isEmpty(res?.data)) {
          setWarehousing(res?.data);
        }
      })
      .catch(() => null);
    getDetailSuppliers(id)
      .then(res => {
        if (!isEmpty(res?.data)) {
          setDetail(res?.data);
        }
      })
      .catch(() => null);
    request(`oms/seller/detail-stats-supplier`, {
      params: { supplier_id: id },
    })
      .then(res => {
        if (!isEmpty(res?.data)) {
          setDetailRate(res?.data);
        }
      })
      .catch(error => error);
    request(`oms/seller/detail-stats-supplier/today`, {
      params: { supplier_id: id },
    })
      .then(res => {
        if (!isEmpty(res?.data)) {
          setDataStatistic(res?.data);
        }
      })
      .catch(error => error);
    return () => {
      // dispatch(actions.resetWhenLeave());
    };
  }, []);

  React.useEffect(() => {
    if (match?.params?.detailId)
      dispatch(actions.getProductDetail(match?.params?.detailId));
  }, [match?.params?.detailId]);

  React.useEffect(() => {
    history.push({
      pathname: location.pathname,
      search: serialize(searchParams),
    });
    if (!(isFirstCome.current && !isEmpty(productList))) {
      dispatch(actions.getProductList({ ...searchParams, supplier_id: id }));
    }
    if (isFirstCome.current) {
      isFirstCome.current = false;
    }
  }, [searchParams]);

  const handleChangeTab = value => {
    setTab(value);
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

  const handleChangeRating = value => {
    const searchParamsClone = { ...searchParams };

    if (value) {
      searchParamsClone['from_rating'] = value;
      searchParamsClone['to_rating'] = 5;
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
        <>
          {showSkeleton ? (
            <Skeleton
              active
              size="large"
              title={false}
              paragraph={{ rows: 4 }}
            />
          ) : (
            <>
              <SupplierInfo
                detail={detail}
                detailRate={detailRate}
                handleChangeTab={handleChangeTab}
                tab={tab}
              />
            </>
          )}
        </>
        <MainWrapper>
          {tab === '0' ? (
            <>
              {!showSkeleton && (
                <Filter
                  filter={searchParams}
                  warehousing={warehousing}
                  handleFilter={handleFilter}
                  onResetFilter={handleResetFilter}
                  onChangeRating={handleChangeRating}
                />
              )}
              <ProductList showSkeleton={showSkeleton} />

              <Pagination
                searchParams={searchParams}
                onChangePage={handleChangePage}
              />
            </>
          ) : (
            <Statistic dataStatistic={dataStatistic} detailRate={detailRate} />
          )}
        </MainWrapper>
        {!!detailId && (
          <ProductDetail source={match.url.replace(/\/([^/]*$)/, '')} />
        )}
      </Product.Page>
    </Spin>
  );
}
