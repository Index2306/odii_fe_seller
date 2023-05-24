import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Button, Input, Select } from 'app/components';
import styled from 'styled-components/macro';
import { SearchOutlined } from '@ant-design/icons';
import CustomModal from 'app/components/Modal';
import { ProductSearchBar as SearchBar } from '../styles/Header';
import { useSelector } from 'react-redux';
import { CustomStyle } from 'styles/commons';
import { isEmpty, cloneDeep } from 'lodash';
import request from 'utils/request';
import { getListSuppliers, getListWarehousing } from 'utils/providers';
import { selectProvince } from 'app/pages/AppPrivate/slice/selectors';

const { Option } = Select;
const requestURL = 'common-service/location-country';

const defaultDraft = {
  draftProvince: { id: 0, name: 'Toàn quốc' },
  draftDistrict: { id: 0, name: 'Tất cả' },
  draftSupplier: { id: 0, name: 'Tất cả' },
};
export function ProductSearchBar(props) {
  const [keyword, setKeyword] = useState('');
  const [defaultValue, setDefaultValue] = useState({});
  const [districtOptions, setDistrictOptions] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [warehousing, setWarehousing] = React.useState([]);
  const [draftValue, setDraftValue] = useState({});
  const [isShowSelectProvince, setIsShowSelectProvince] = useState(false);
  const provinces = useSelector(selectProvince);
  const {
    draftProvince,
    draftDistrict,
    draftSupplier,
    draftWarehousing,
  } = draftValue;
  const { searchParams } = props;

  useEffect(() => {
    getListSupplier();
    getWarehousing();
  }, []);

  useEffect(() => {
    if (props.keyword) {
      setKeyword(props.keyword);
    }
  }, [props.keyword]);

  // useEffect(() => {
  //   if (searchParams.from_district_id) {
  //     handleSelectProvince(searchParams.from_district_id);
  //   }
  // }, [searchParams.from_district_id]);

  useEffect(() => {
    if (!isShowSelectProvince) return;
    const currentProvince = provinces.find(
      item => item.id === searchParams.from_province_id,
    );
    const currentSupplier = suppliers.find(
      item => item.id === searchParams.supplier_id,
    );
    const currentWarehousing = warehousing.find(
      item => item.id === searchParams.supplier_warehousing_id,
    );
    const newDraft = { ...draftValue };

    if (currentProvince) {
      newDraft.draftProvince = currentProvince;
    }
    if (searchParams.from_district_id) {
      newDraft.draftDistrict = { id: searchParams.from_district_id };
    }
    if (currentSupplier) {
      newDraft.draftSupplier = currentSupplier;
    }
    if (currentWarehousing) {
      newDraft.draftWarehousing = currentWarehousing;
    }
    if (searchParams.from_province_id) {
      handleSelectProvince(searchParams.from_province_id, newDraft);
    }
    setDraftValue(newDraft);
    setDefaultValue(newDraft);
  }, [searchParams, isShowSelectProvince]);
  const toggleShowSelectProvince = () => {
    setIsShowSelectProvince(!isShowSelectProvince);
  };

  const handleChangeSearchInput = e => {
    setKeyword(e.target.value);
  };

  const handleCancel = () => {
    setDraftValue(defaultValue);
    toggleShowSelectProvince();
  };

  const handleOk = () => {
    props.handleFilter({
      from_province_id: draftProvince?.id,
      from_district_id: draftDistrict?.id,
      supplier_id: draftSupplier?.id,
      supplier_warehousing_id: draftWarehousing?.id,
    });
    toggleShowSelectProvince();
  };

  const handleSearchProduct = () => {
    props.onSearchByKeyword(keyword?.trim());
  };

  const getListSupplier = params => {
    getListSuppliers(params)
      .then(res => {
        if (!isEmpty(res?.data)) {
          setSuppliers(res?.data);
        }
      })
      .catch(() => null);
    return () => {
      // dispatch(actions.resetWhenLeave());
    };
  };

  const getWarehousing = params => {
    getListWarehousing(params)
      .then(res => {
        if (!isEmpty(res?.data)) {
          setWarehousing(res?.data);
        }
      })
      .catch(() => null);
    return () => {
      // dispatch(actions.resetWhenLeave());
    };
  };

  const handleSelectProvince = async (option, drafts) => {
    let newDraftValue = cloneDeep(drafts || draftValue);
    if (!drafts) newDraftValue.draftDistrict = defaultDraft.draftDistrict;
    if (option === 0) {
      newDraftValue.draftProvince = defaultDraft.draftProvince;
      setDistrictOptions([]);
    } else {
      const { data } = await request(
        `${requestURL}?parent_id=${option}&type=district`,
        {},
      )
        .then(response => response)
        .catch(error => error);

      if (data) {
        const districts = data.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name,
          };
        });
        setDistrictOptions(districts);
        newDraftValue.draftProvince = provinces.find(
          item => item.id === option,
        );
      }
    }
    setDraftValue(newDraftValue);
  };

  const handleSelectDistrict = async option => {
    let newDraftValue = cloneDeep(draftValue);
    if (option === 0) {
      newDraftValue.draftDistrict = defaultDraft.draftDistrict;
    } else {
      newDraftValue.draftDistrict = districtOptions.find(
        item => item.id === option,
      );
    }
    setDraftValue(newDraftValue);
  };

  const handleSelectSupplier = async option => {
    let newDraftValue = cloneDeep(draftValue);
    if (option === 0) {
      newDraftValue.draftSupplier = defaultDraft.draftSupplier;
    } else {
      newDraftValue.draftSupplier = suppliers.find(item => item.id === option);
    }
    setDraftValue(newDraftValue);
  };

  const handleSelectWarehousing = async option => {
    let newDraftValue = cloneDeep(draftValue);
    if (option === 0) {
      newDraftValue.draftWarehousing = defaultDraft.draftWarehousing;
    } else {
      newDraftValue.draftWarehousing = warehousing.find(
        item => item.id === option,
      );
    }
    setDraftValue(newDraftValue);
  };

  const handleResetSearchKeyword = () => {
    setKeyword('');
    if (props.keyword) {
      props.onSearchByKeyword('');
    }
  };

  return (
    <SearchBar>
      <div className="form">
        <SearchBarInput
          placeholder="Nhập tên sản phẩm"
          onChange={handleChangeSearchInput}
          onPressEnter={handleSearchProduct}
          value={keyword}
        />

        {/* {keyword && (
          <i
            className="fas fa-times-circle"
            onClick={handleResetSearchKeyword}
          />
        )} */}

        <ButtonCustom
          context="secondary"
          className="btn-sm"
          onClick={toggleShowSelectProvince}
        >
          {/* {province?.name || (
            <>
              Chọn khu vực&nbsp;&nbsp;&nbsp;
              <i className="far fa-chevron-right" />
            </>
          )} */}
          Bộ lọc &nbsp;&nbsp;&nbsp;
          <i className="far fa-chevron-right" />
        </ButtonCustom>
      </div>

      <Button width="175px" onClick={handleSearchProduct}>
        <SearchOutlined />
        &nbsp;TÌM KIẾM
      </Button>
      {isShowSelectProvince && (
        <CustomModal
          // width={1000}
          isOpen
          className="modal-1"
          title="Bộ lọc tìm kiếm"
          callBackOk={handleOk}
          callBackCancel={handleCancel}
          disableOk={isEmpty(draftValue)}
        >
          <CustomStyle>
            <CustomStyle
              p={{ xs: 's5' }}
              mb={{ xs: 's7' }}
              border="1px solid"
              borderColor="stroke"
              borderRadius={6}
            >
              <CustomStyle className="" pb={{ xs: 's5' }}>
                <CustomStyle mb={{ xs: 's3' }} fontWeight="medium">
                  Khu vực kho hàng
                </CustomStyle>
                <Row gutter={10}>
                  <Col span={12}>
                    <CustomStyle color="primary">
                      <SearchBarSelect
                        showSearch
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Tỉnh thành"
                        onSelect={handleSelectProvince}
                        value={draftProvince?.id ?? null}
                      >
                        <Option value={0}>Toàn quốc</Option>
                        {provinces.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </SearchBarSelect>
                    </CustomStyle>
                  </Col>
                  <Col span={12}>
                    <CustomStyle>
                      <SearchBarSelect
                        showSearch
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn quận / huyện"
                        onSelect={handleSelectDistrict}
                        value={draftDistrict?.id ?? null}
                      >
                        <Option value={0}>Tất cả</Option>
                        {districtOptions.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </SearchBarSelect>
                    </CustomStyle>
                  </Col>
                </Row>
              </CustomStyle>

              <CustomStyle>
                <CustomStyle color="gray3" pb={{ xs: 's3' }}>
                  Phổ biến
                </CustomStyle>
                <WrapperPopularProvince>
                  {[
                    { id: '1', name: 'Hà Nội, Việt Nam' },
                    { id: '79', name: 'Hồ Chí Minh, Việt Nam' },
                  ].map(item => (
                    <CustomStyle onClick={() => handleSelectProvince(item.id)}>
                      {item.name}
                    </CustomStyle>
                  ))}
                </WrapperPopularProvince>
              </CustomStyle>
            </CustomStyle>

            <CustomStyle
              p={{ xs: 's5' }}
              border="1px solid"
              borderColor="stroke"
              borderRadius={6}
            >
              <CustomStyle mb={{ xs: 's3' }} fontWeight="medium">
                <CustomStyle mb={{ xs: 's3' }} fontWeight="medium">
                  Nhà cung cấp
                </CustomStyle>
                <CustomStyle mb={{ xs: 's4' }}>
                  <SearchBarSelect
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Tất cả NCC"
                    onSelect={handleSelectSupplier}
                    value={draftSupplier?.id ?? null}
                  >
                    <Option value={0}>Tất cả NCC</Option>
                    {suppliers.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </SearchBarSelect>
                </CustomStyle>
                <CustomStyle mb={{ xs: 's3' }} fontWeight="medium">
                  Chọn kho hàng
                </CustomStyle>
                <CustomStyle>
                  <SearchBarSelect
                    // showSearch
                    // filterOption={(input, option) =>
                    //   option.children
                    //     .toLowerCase()
                    //     .indexOf(input.toLowerCase()) >= 0
                    // }
                    placeholder="Tất cả kho hàng"
                    onSelect={handleSelectWarehousing}
                    value={draftWarehousing?.id ?? null}
                  >
                    <Option value={0}>Tất cả kho hàng</Option>
                    {warehousing.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </SearchBarSelect>
                </CustomStyle>
              </CustomStyle>
            </CustomStyle>
          </CustomStyle>
        </CustomModal>
      )}
    </SearchBar>
  );
}

const WrapperPopularProvince = styled.div`
  margin: 0 -8px;
  display: flex;
  flex-wrap: wrap;
  > * {
    margin: 0 8px;
    color: #2f80ed;
    /* border-bottom: 1px solids ${({ theme }) => theme.stroke}; */
    cursor: pointer;
    padding-bottom: 10px;
  }
`;

const ButtonCustom = styled(Button)`
  &.btn-sm {
    background-color: ${({ theme }) => theme.backgroundBlue};
    color: ${({ theme }) => theme.primary};
    margin-right: ${({ theme }) => theme.space.s1 * 1.5}px;
    border: none;
    font-weight: 500 !important;
    width: 120px;
    margin-top: ${({ theme }) => theme.space.s1 * 1.5}px;
    &:before {
      content: '\f3c5';
      font-family: 'Font Awesome 5 Pro';
      font-weight: 400;
      line-height: 32px;
      /* color: ${({ theme }) => theme.primary}!important; */
      margin-right: ${({ theme }) => theme.space.s4 / 2}px;
    }
    .far {
      font-size: 10px;
    }
  }
`;
const SearchBarInput = styled(Input)`
  border: none;

  &:focus {
    box-shadow: none;
  }
`;

const SearchBarSelect = styled(Select)`
  /* width: '100%'; */
  margin-right: ${({ theme }) => theme.space.s1 * 1.5}px;

  & .ant-select-selector {
    background-color: ${({ theme }) => theme.backgroundVariant}!important;
    border-radius: ${({ theme }) => theme.radius}px!important;
    border-color: ${({ theme }) => theme.backgroundVariant}!important;
    margin-top: ${({ theme }) => theme.space.s1 * 1.5}px;
    .ant-select-selection-search {
      /* margin-left: 18px; */
    }
    /* &:first-child:before {
      content: '\f3c5';
      font-family: 'Font Awesome 5 Pro';
      font-weight: 400;
      line-height: 36px;
      color: ${({
      theme,
    }) => theme.primary}!important;
      margin-right: ${({ theme }) =>
      theme.space.s4 / 2}px;
    } */
  }

  & .ant-select-selection-item {
    color: ${({ theme }) => theme.primary}!important;
    font-weight: 500;
  }
`;
