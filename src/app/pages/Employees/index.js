/**
 *
 * Employees
 *
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Spin,
  Form as F,
  Checkbox,
  Divider,
  Select,
  Space,
} from 'antd';
import { PlusOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import {
  Button,
  Table,
  PageWrapper,
  BoxColor,
  LoadingIndicator,
  Form,
  Input,
} from 'app/components';
import constants from 'assets/constants';
import { CustomTitle, CustomStyle } from 'styles/commons';
import { useEmployeesSlice } from './slice';
import { FilterBar } from './Features';
import {
  selectLoading,
  selectData,
  selectListSelected,
  selectDataRole,
  selectDataStoreIds,
  selectPagination,
} from './slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { messages } from './messages';
import {
  CustomModal,
  TxtRequired,
  CustomAvatar,
  CustomLink,
  CustomDivRole,
  CustomDivRoleOwner,
  CustomSelect,
  CustomDivStore,
} from './styles';
import { formatDate } from 'utils/helpers';

const { Option } = Select;
const Item = F.Item;
const { roles } = constants;
export function Employees({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { actions } = useEmployeesSlice();
  const listSelected = useSelector(selectListSelected);
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const dataRoles = useSelector(selectDataRole);
  const dataStoreIds = useSelector(selectDataStoreIds);
  const pagination = useSelector(selectPagination);

  const [isMissRole, setIsMissRole] = useState('');
  const [allStoreId, setAllStoreId] = useState([]);
  const [dataRolesFormat, setDataRolesFormat] = useState([]);
  const [visibleModal, setvisibleModal] = useState('');
  const [role_ids, setRole_Ids] = useState([]);
  const [store_ids, setStore_Ids] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledStore, setIsDisabledStore] = useState(false);
  const [listOwner, setListOwner] = useState([]);
  const currentUser = useSelector(selectCurrentUser);
  // const host = 'https://i.odii.xyz/';
  const host = process.env.REACT_APP_IMAGE_STATIC_HOST + '/';

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

  useEffect(() => {
    const delaySecond = 10000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        gotoPage('', true);
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);
  useEffect(() => {
    // dispatch(actions.getData({}));
    dispatch(actions.getDataRole({}));
    dispatch(actions.getDataStoreIds({}));
    return () => {
      dispatch(actions.resetWhenLeave());
    };
  }, []);

  useEffect(() => {
    const formatDataRoles = () => {
      if (!isEmpty(dataRoles)) {
        const temp = dataRoles
          .filter(item => item.title !== 'partner_store')
          .filter(item => item.title !== 'partner_source')
          .map(item => {
            return {
              ...item,
              titleFormat: item.title.replace('partner_', ''),
            };
          })
          .map(item => {
            return {
              ...item,
              titleFormat: item.title.replace('owner', 'Admin'),
            };
          })
          .map(item2 => {
            return {
              ...item2,
              titleFormat:
                item2.titleFormat.charAt(0).toUpperCase() +
                item2.titleFormat.substr(1),
            };
          });
        setDataRolesFormat(temp);
      }
    };
    formatDataRoles();
  }, [dataRoles]);

  useEffect(() => {
    const getAllStoreId = () => {
      if (!isEmpty(dataStoreIds)) {
        const temp = [];
        for (let store of dataStoreIds) {
          temp.push(store.id);
        }
        setAllStoreId(temp);
      }
    };
    getAllStoreId();
  }, [dataStoreIds]);

  const rowSelection = {
    onChange: selectedRowKeys => {
      // setListOption([]);'
      dispatch(actions.setListSelected(selectedRowKeys));
    },
    getCheckboxProps: record => ({
      // disabled: listOwner.includes(record.id) || record.id === '1',
      disabled: listOwner.includes(record.id) || record.is_owner === true,
      name: record.name,
    }),
  };

  const goCreate = () => {
    setvisibleModal(true);
  };

  const onChangeRole = values => {
    setRole_Ids(values);
    if (values.includes('1')) {
      setIsDisabled(true);
      setRole_Ids(['1']);
    }
  };

  const onChangeStoreIds = values => {
    if (values.includes('all')) {
      setIsDisabledStore(true);
      setStore_Ids(allStoreId);
    } else {
      setStore_Ids(values);
      setIsDisabledStore(false);
    }
  };

  const onFinish = values => {
    if (isEmpty(role_ids)) {
      setIsMissRole(true);
    } else {
      setIsMissRole(false);
      dispatch(
        actions.inviteUser({
          data: {
            full_name: values.full_name.trim(),
            email: values.email.trim(),
            role_ids: role_ids,
            store_ids: store_ids,
          },
        }),
      );
      onClose();
    }
  };

  const onClose = () => {
    setvisibleModal(false);
    onClear();
  };

  const onClear = () => {
    setRole_Ids([]);
    form.resetFields();
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Nhân viên</div>
          </div>
        ),
        dataIndex: 'full_name',
        key: 'full_name',
        width: 200,
        render: (text, record) => {
          return (
            <>
              <CustomAvatar
                src={
                  record.avatar?.location
                    ? host + record.avatar?.location
                    : record.avatar?.origin
                }
                icon={<UserOutlined />}
              />
              &emsp;
              <CustomLink to={`/employees/${record.id}/detail/profile`}>
                {text || 'N/A'}
              </CustomLink>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Vai trò</div>
          </div>
        ),
        width: 170,
        render: (_, record) => {
          let temp = '';
          if (record.is_owner) {
            listOwner.push(record.id);
            return <CustomDivRoleOwner>Owner</CustomDivRoleOwner>;
          } else {
            for (const role of record.roles) {
              temp =
                temp +
                ', ' +
                (role.title === 'owner'
                  ? role.title.replace('owner', 'Admin')
                  : role.title.replace('partner_', '').charAt(0).toUpperCase() +
                    role.title.replace('partner_', '').substr(1));
            }
          }
          return (
            <>
              <CustomDivRole>{temp.substr(1)}</CustomDivRole>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Tài khoản Email</div>
          </div>
        ),
        dataIndex: 'email',
        key: 'email',
        width: 200,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Điện thoại</div>
          </div>
        ),
        dataIndex: 'phone',
        key: 'phone',
        width: 100,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giới tính</div>
          </div>
        ),
        dataIndex: 'gender',
        key: 'gender',
        width: 100,
        align: 'center',
        render: text => {
          return <div>{t(`user.${text}`)}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày tham gia</div>
          </div>
        ),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        render: text => {
          return <div style={{ color: '#828282' }}>{formatDate(text)}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'is_partner_user_active',
        key: 'is_partner_user_active',
        width: 120,

        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.EMPLOYEE_STATUS.find(
            v => v.id === text,
          );
          return (
            <BoxColor
              fontWeight="medium"
              colorValue={currentStatus?.color}
              width="120px"
            >
              {currentStatus?.name || ''}
            </BoxColor>
          );
        },
      },
    ],
    [data],
  );

  return (
    <PageWrapper>
      <div className="header d-flex justify-content-between">
        <CustomTitle>{t(messages.title())}</CustomTitle>
        <Button
          className="btn-sm"
          onClick={goCreate}
          color="blue"
          disabled={isLoading || !currentUser?.roles.includes(roles.owner)}
        >
          <PlusOutlined /> &nbsp; Thêm nhân viên
        </Button>
      </div>
      <SectionWrapper>
        <CustomStyle className="title text-left" my={{ xs: 's5' }}>
          <FilterBar
            isLoading={isLoading}
            gotoPage={gotoPage}
            history={history}
            showAction={!isEmpty(listSelected)}
          />
        </CustomStyle>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <div>
                <Table
                  className="custom"
                  // rowSelection={{}}
                  rowSelection={{
                    selectedRowKeys: listSelected,
                    type: 'checkbox',
                    ...rowSelection,
                  }}
                  columns={columns}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100, y: 1000 }}
                  actions={gotoPage}
                  rowKey={record => record.id}
                />
              </div>
            </Col>
          </Row>
        </Spin>
      </SectionWrapper>
      <CustomModal
        name="modal_invite-user"
        visible={visibleModal}
        footer={null}
        className="modal-invite"
        onCancel={onClose}
        style={{ height: 'calc(100vh - 200px)' }}
        bodyStyle={{ overflowY: 'scroll' }}
        // bodyStyle={{ overflowX: 'scroll' }}
      >
        {isLoading && <LoadingIndicator />}
        <Form
          form={form}
          name="form-invite"
          className="form-invite"
          initialValues={{}}
          onFinish={onFinish}
        >
          <Item>
            <div className="title">Thêm nhân viên</div>
            <div className="content">
              Gửi lời mời tham gia hệ thống đến nhân viên của bạn
            </div>
          </Item>
          <CustomItem
            name="full_name"
            label="Họ tên nhân viên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập Họ tên nhân viên',
              },
            ]}
          >
            <Input
              className="input"
              placeholder="Nhập chính xác Họ tên nhân viên"
            />
          </CustomItem>
          <CustomItem
            name="email"
            label="Email nhân viên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email',
              },
              {
                type: 'email',
                message: 'Email chưa đúng định dạng',
              },
            ]}
          >
            <Input
              className="input"
              placeholder="Nhập chính xác email nhân viên"
            />
          </CustomItem>
          <CustomItem name="store_ids" label="Cửa hàng" className="store">
            <div className="label-desc">
              Chọn cửa hàng giao Nhân viên quản lý
            </div>
            <CustomSelect
              mode="multiple"
              allowClear
              optionLabelProp="label"
              optionFilterProp="label"
              placeholder="Chọn cửa hàng"
              onChange={onChangeStoreIds}
              maxTagCount="responsive"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="all" label="Tất cả cửa hàng">
                <CustomDivStore>
                  <CustomAvatar icon={<ShopOutlined />} />
                  <div className="store-info">
                    <div className="store-name">Tất cả cửa hàng</div>
                  </div>
                </CustomDivStore>
              </Option>
              {dataStoreIds?.map((store, index) => {
                return (
                  <Option
                    value={store?.id}
                    key={index}
                    label={store?.name}
                    disabled={isDisabledStore}
                  >
                    <CustomDivStore>
                      <CustomAvatar src={store?.logo} icon={<ShopOutlined />} />
                      <div className="store-info">
                        <div className="store-name">{store?.name}</div>
                        <div className="store-address">
                          {store?.shop_location}
                        </div>
                      </div>
                    </CustomDivStore>
                  </Option>
                );
              })}
            </CustomSelect>
          </CustomItem>
          <CustomItem name="role_ids" label="Vai trò" className="required">
            <div className="label-desc">Chọn quyền giao Nhân viên quản lý</div>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChangeRole}>
              {dataRolesFormat
                ? dataRolesFormat?.map((role, index) => (
                    <Checkbox
                      value={role?.id}
                      key={index}
                      disabled={role?.title === 'owner' ? false : isDisabled}
                      onClick={
                        role?.title === 'owner'
                          ? () => setIsDisabled(!isDisabled)
                          : // setIsChecked(!isChecked)
                            ''
                      }
                    >
                      <div className="role-title">{role?.titleFormat}</div>
                      <div className="role-desc">
                        {role?.description === 'Chủ tài khoản'
                          ? 'Quản trị viên'
                          : role?.description}
                      </div>
                    </Checkbox>
                  ))
                : ''}
            </Checkbox.Group>
          </CustomItem>
          <Divider />
          <div className="d-flex justify-content-between">
            {isMissRole ? (
              <TxtRequired>Hãy phân quyền quản trị cho tài khoản</TxtRequired>
            ) : (
              <div></div>
            )}
            <Space align="end">
              <Button
                context="secondary"
                className="btn-sm"
                color="default"
                style={{
                  color: 'white',
                  background: '#6C798F',
                }}
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                className="btn-sm"
                color="blue"
                htmlType="submit"
              >
                Hoàn tất
              </Button>
            </Space>
          </div>
        </Form>
      </CustomModal>
    </PageWrapper>
  );
}

const CustomItem = styled(Item)`
  display: block;
  .ant-form-item-label {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #333333;
  }
  .label-desc {
    margin-bottom: 16px;
  }
  .ant-checkbox-group {
    display: grid;
    .ant-checkbox-wrapper {
      margin-left: 0;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
      .ant-checkbox {
        top: 12px;
        position: relative;
      }
      .ant-checkbox-inner {
        border-radius: 50%;
      }
    }
  }
  .role-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
  .role-desc {
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
`;
