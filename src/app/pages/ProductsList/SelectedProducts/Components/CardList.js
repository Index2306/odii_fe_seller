/**
 *
 * SelectedProducts
 *
 */
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Pagination } from 'app/components';
import { isEmpty, isEqual } from 'lodash';
import usePrevious from 'app/hooks/UsePrevious';
import { CustomStyle, SectionWrapper } from 'styles/commons';
import { getCategoriesTikTok } from 'utils/common';
// import { EditOutlined } from '@ant-design/icons';
import {
  selectData,
  selectDetails,
  selectListSelected,
  selectListStores,
  selectListUpdateDetail,
  selectLoading,
  selectPagination,
} from '../slice/selectors';
import { FilterBar } from '../Features';
import CardItem from './CardItem';
import { useSelectedProductsSlice } from '../slice';

export default function CardList({ history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useSelectedProductsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const listSelected = useSelector(selectListSelected);
  const listStores = useSelector(selectListStores);
  const details = useSelector(selectDetails);
  const listUpdateDetail = useSelector(selectListUpdateDetail);
  const preData = usePrevious(data) || [];
  const [tikTokCate, setTikTokCate] = useState([]);

  React.useEffect(() => {
    // gotoPage();
    getCategoriesTikTok().then(data => {
      setTikTokCate(data);
    });
  }, []);

  React.useEffect(() => {
    if (listUpdateDetail?.some(v => v.status === 'done')) {
      gotoPage(history.location.search);
    }
  }, [listUpdateDetail]);

  React.useEffect(() => {
    if (!isEmpty(data) && history.location.search && !isEqual(preData, data)) {
      dispatch(actions.getDetail(data.map(item => item.id)));
    }
  }, [data]);

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  const getTikTokCategories = () => {
    return tikTokCate;
  };

  // const handleShowConfirm = data => status => {
  //   setDetail(data);
  //   setNewStatus(constants.PRODUCT_STATUS.find(item => item.id === status));
  //   toggleConfirmModal();
  // };

  return (
    <>
      <SectionWrapper className="">
        <CustomStyle className="title text-left" my={{ xs: 's0' }}>
          <FilterBar
            isLoading={isLoading}
            // gotoPage={gotoPage}
            listStores={listStores}
            history={history}
            showActionListCard={listSelected?.length > 1}
          />
        </CustomStyle>
      </SectionWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        {data.map((item, index) => {
          const currentStatus = listUpdateDetail?.find(v => v.id === item.id);
          return (
            <Spin
              tip={`${currentStatus?.title} ${item?.name}`}
              key={item.id}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
              spinning={currentStatus?.status === 'loading'}
            >
              <CardItem
                // key={item.id}
                status={item.status}
                index={index}
                isChecked={listSelected.includes(item.id)}
                history={history}
                dataDetail={details?.find(v => v.id === item.id)}
                getTikTokCategories={getTikTokCategories}
              />
            </Spin>
          );
        })}
        <Pagination
          searchSchema={{
            page_size: {
              required: true,
              default: 6,
              test: value => Number(value) <= 100,
            },
            keyword: {
              required: false,
            },
            status: {
              required: false,
            },
            store_id: {
              required: false,
            },
            platform: {
              required: false,
            },
          }}
          data={{ pagination }}
          actions={gotoPage}
        />
      </Spin>
    </>
  );
}
