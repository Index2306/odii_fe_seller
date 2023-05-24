/**
 *
 * store detail
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Spin, Skeleton, Button } from 'antd';
import request from 'utils/request';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import { Pagination, EmptyPage, PageWrapper } from 'app/components';
import { getListWarehousing } from 'utils/providers';
import { useLocation } from 'react-router-dom';
import { getDetailSuppliers } from 'utils/providers';
import { useStoresSlice } from '../../slice';
import { MainWrapper } from '../../styles';
import notification from 'utils/notification';
import {
  selectLoading,
  selectDetailId,
  selectIsFirstGetList,
  selectProductList,
  selectProductPagination,
} from '../../slice/selectors';
import {
  StoreInfo,
  Statistic,
  Filter,
  // ProductDetail,
  ProductList,
  ProductTable,
} from '../../components';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components';
const initialSearchParams = {
  page: 1,
  page_size: 20,
};

export function DetailStores({ match, history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useStoresSlice();
  const isFirstCome = React.useRef(true);
  const loading = useSelector(selectLoading);
  const detailId = useSelector(selectDetailId);
  const pagination = useSelector(selectProductPagination);
  const isFirstGetList = useSelector(selectIsFirstGetList);
  const productList = useSelector(selectProductList);
  const [searchParams, setSearchParams] = React.useState(initialSearchParams);
  const [detail, setDetail] = React.useState({});
  const [warehousing, setWarehousing] = React.useState([]);
  const [detailRate, setDetailRate] = React.useState({});
  const [dataStatistic, setDataStatistic] = React.useState({});
  const [tab, setTab] = React.useState('0');
  const [change, setChange] = React.useState(true);

  const location = useLocation();
  const id = match?.params?.id;

  const syncData = () => {
    dispatch(actions.setLoading(true));
    request(`/product-service/seller/stores/${id}/sync-all-product`, {
      method: 'post',
    })
      .then(res => {
        if (res?.is_success) {
          dispatch(
            actions.getProductListV2(
              `?page_size=20&store_id=${id}&isNotOdii=true`,
            ),
          );
          notification('success', res.message);
        } else {
          notification('error', 'Có lỗi xảy ra vui lòng đồng bộ sau!');
          dispatch(actions.setLoading(false));
        }
      })
      .catch(error => {
        dispatch(actions.setLoading(false));
      });
  };
  const syncAddress = () => {
    dispatch(actions.setLoading(true));
    request(`/product-service/seller/stores/${id}/sync-address`, {
      method: 'post',
    })
      .then(res => {
        if (res?.is_success) {
          request(`/product-service/seller/store/${id}`, {})
            .then(res => {
              if (!isEmpty(res?.data)) {
                setDetail(res?.data);
              }
              dispatch(actions.setLoading(false));
            })
            .catch(() => {
              dispatch(actions.setLoading(false));
            });
          notification('success', res.message);
        } else {
          notification('error', 'Có lỗi xảy ra vui lòng đồng bộ sau!');
          dispatch(actions.setLoading(false));
        }
      })
      .catch(error => {
        dispatch(actions.setLoading(false));
      });
  };
  React.useEffect(() => {
    if (!id) {
      history.push('/stores');
      return;
    }
    // if(tab === 0){
    // setChange(true)
    // }
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
    // getListWarehousing({ supplier_id: id })
    //   .then(res => {
    //     if (!isEmpty(res?.data)) {
    //       setWarehousing(res?.data);
    //     }
    //   })
    //   .catch(() => null);
    request(`/product-service/seller/store/${id}`, {})
      .then(res => {
        if (!isEmpty(res?.data)) {
          setDetail(res?.data);
        }
      })
      .catch(() => null);
    // request(`oms/seller/detail-stats-supplier`, {
    //   params: { supplier_id: id },
    // })
    //   .then(res => {
    //     if (!isEmpty(res?.data)) {
    //       setDetailRate(res?.data);
    //     }
    //   })
    //   .catch(error => error);
    // request(`oms/seller/detail-stats-supplier/today`, {
    //   params: { supplier_id: id },
    // })
    //   .then(res => {
    //     if (!isEmpty(res?.data)) {
    //       setDataStatistic(res?.data);
    //     }
    //   })
    //   .catch(error => error);
    return () => {
      // dispatch(actions.resetWhenLeave());
    };
  }, []);

  React.useEffect(() => {
    if (!showSkeleton && loading) {
      setChange(change);
    }
  }, [loading]);

  React.useEffect(() => {
    gotoPage('?page=1&page_size=20');
  }, [tab]);

  const handleChangeTab = value => {
    setTab(value);
  };

  const handleChangeKing = value => {
    setChange(value);
  };

  const gotoPage = params => {
    dispatch(
      actions.getProductListV2(
        `${params}&store_id=${id}&isNotOdii=${tab != 0}`,
      ),
    );
  };

  const showSkeleton = isFirstGetList && loading;
  return (
    <Spin tip="Đang tải..." spinning={!showSkeleton && loading}>
      <div>
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
              <StoreInfo
                detail={detail}
                detailRate={detailRate}
                handleChangeTab={handleChangeTab}
                tab={tab}
                onSyncAddress={syncAddress}
              />
            </>
          )}
        </>
        <MainWrapper>
          {tab === '0' ? (
            <>
              {!showSkeleton && (
                <CustomStyle mb={{ xs: 's6' }}>
                  <Filter
                    // filter={searchParams}
                    // warehousing={warehousing}
                    // handleFilter={handleFilter}
                    // onResetFilter={handleResetFilter}
                    // onChangeRating={handleChangeRating}
                    isLoading={loading}
                    id={id}
                    // gotoPage={gotoPage}
                    changeState={change}
                    history={history}
                    handleChangeKing={handleChangeKing}
                    tab={tab}
                    // showActionListCard={listSelected?.length > 1}
                  />
                </CustomStyle>
              )}
              {change ? (
                <ProductList showSkeleton={showSkeleton} />
              ) : (
                <ProductTable />
              )}
              <Pagination
                searchSchema={{
                  page_size: {
                    required: true,
                    default: 20,
                    test: value => Number(value) <= 100,
                  },
                  keyword: {
                    required: false,
                  },
                  status: {
                    required: false,
                  },
                }}
                data={{ pagination }}
                actions={gotoPage}
              />
            </>
          ) : productList.length < 0 &&
            (location.search != null ||
              location.search == '?page=1&page_size=20') ? (
            <PageWrapper>
              <CustomStyle
                height="calc(100vh - 120px)"
                className="d-flex flex-column"
              >
                <EmptyPage>
                  <CustomStyle className="d-flex justify-content-center">
                    <ButtonStyle>
                      <Button
                        className={
                          detail.platform == 'lazada' ? 'btn-sm' : 'btn-md'
                        }
                        onClick={syncData}
                      >
                        <i className="fas fa-sync-alt"></i>
                        Đồng bộ từ {detail.platform}
                      </Button>
                    </ButtonStyle>
                  </CustomStyle>
                </EmptyPage>
              </CustomStyle>
            </PageWrapper>
          ) : (
            <>
              {!showSkeleton && (
                <CustomStyle mb={{ xs: 's6' }}>
                  <Filter
                    // filter={searchParams}
                    // warehousing={warehousing}
                    // handleFilter={handleFilter}
                    // onResetFilter={handleResetFilter}
                    // onChangeRating={handleChangeRating}
                    isLoading={loading}
                    id={id}
                    // gotoPage={gotoPage}
                    changeState={change}
                    history={history}
                    handleChangeKing={handleChangeKing}
                    isNotOdii={true}
                    detail={detail}
                    tab={tab}
                    // showActionListCard={listSelected?.length > 1}
                  />
                </CustomStyle>
              )}
              {change ? (
                <ProductList showSkeleton={showSkeleton} />
              ) : (
                <ProductTable />
              )}
              <Pagination
                searchSchema={{
                  page_size: {
                    required: true,
                    default: 20,
                    test: value => Number(value) <= 100,
                  },
                  keyword: {
                    required: false,
                  },
                  status: {
                    required: false,
                  },
                }}
                data={{ pagination }}
                actions={gotoPage}
              />
            </>
          )}
        </MainWrapper>
        {/* {!!detailId && (
          <ProductDetail source={match.url.replace(/\/([^/]*$)/, '')} />
        )} */}
      </div>
    </Spin>
  );
}
const ButtonStyle = styled.div`
  .btn-md {
    background: #ea501f;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    width: 162px;
    height: 36px;
    border-color: #ea501f;

    color: #ffffff;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;

    &:hover {
      background: #ea501f99;
    }

    i {
      color: #fff;
      padding-right: 4px;
      margin-left: -4px;
    }
  }

  .btn-sm {
    background: #3d56a6;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    width: 162px;
    height: 36px;
    border-color: #3d56a6;

    color: #ffffff;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;

    &:hover {
      background: #3d56a699;
    }

    i {
      color: #fff;
      padding-right: 4px;
      margin-left: -4px;
    }
  }
`;
