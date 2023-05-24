import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { Row, Col, Spin, Divider, Skeleton } from 'antd';
import {
  selectLoading,
  selectDetail,
  selectDataRole,
} from '../../slice/selectors';
import { useEmployeesSlice } from '../../slice';
import {
  PageWrapper,
  Button,
  Form,
  Input,
  Checkbox,
  Radio,
} from 'app/components';
import { formatDate } from 'utils/helpers';
import * as Styles from '../../styles';
// import Confirm from 'app/components/Modal/Confirm';
import constants from 'assets/constants';
const { roles } = constants;
const Item = Form.Item;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

const genders = ['male', 'female', 'other'];

export function Detail({ match }) {
  const { t } = useTranslation();
  const id = match?.params?.id;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { actions } = useEmployeesSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);

  const dataRoles = useSelector(selectDataRole);

  const [dataRolesFormat, setDataRolesFormat] = useState([]);
  const [role_ids, setRole_Ids] = useState('');
  const [visiableModalConfirm, setVisiableModalConfirm] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  // const [showConfirmResetPass, setShowConfirmResetPass] = useState(false);
  const host = process.env.REACT_APP_IMAGE_STATIC_HOST + '/';

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
      dispatch(actions.getDone({}));
    };
  }, []);

  useEffect(() => {
    dispatch(actions.getDataRole({}));
  }, []);

  useEffect(() => {
    const setRoleIds = () => {
      if (!isEmpty(data)) {
        const temp = [];
        data.roles.map(item => {
          temp.push(item.id.toString());
        });
        setRole_Ids(temp);
      }
    };
    setRoleIds();
  }, [data]);

  useEffect(() => {
    const formatDataRoles = () => {
      if (!isEmpty(dataRoles)) {
        const temp = dataRoles
          .map(item => {
            return {
              ...item,
              titleFormat: item.title.includes('partner_')
                ? item.title.replace('partner_', '')
                : item.title.includes('admin_')
                ? item.title.replace('admin_', '')
                : item.title.includes('super_a')
                ? item.title.replace('super_a', '')
                : item.title,
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
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Nhân viên',
          link: '/employees',
        },
        {
          name: 'Thông tin nhân viên',
        },
      ],
      title: '',
      fixWidth: true,
      // status: '',
      // actions: (
      //   <Button
      //     className="btn-sm mr-2"
      //     onClick={handleUpdateRoles}
      //     color="blue"
      //   >
      //     <span>Lưu</span>
      //   </Button>
      // ),
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.full_name ? data?.full_name : 'N/A';
      // dataBreadcrumb.status = data.status;
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  const handleUpdateStatus = async () => {
    await dispatch(
      actions.updateStatusUser({
        id,
        data: {
          user_ids: [id],
          status: data?.is_partner_user_active === true ? 'inactive' : 'active',
        },
      }),
    );
  };

  const onChangeRole = values => {
    setRole_Ids(values);
  };

  const handleUpdateRoles = async () => {
    setVisiableModalConfirm(false);
    await dispatch(
      actions.updateUser({
        id,
        data: {
          user_id: id,
          role_ids: role_ids,
        },
      }),
    );
    await dispatch(actions.getDetail(id));
  };
  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Styles.CustomForm
          {...layout}
          form={form}
          name="profile"
          fields={[
            {
              name: ['id'],
              value: data?.id || '',
            },
            {
              name: ['created_at'],
              value: formatDate(data?.created_at) || '',
            },
            {
              name: ['full_name'],
              value: data?.full_name || '',
            },
            {
              name: ['first_name'],
              value: data?.first_name || '',
            },
            {
              name: ['last_name'],
              value: data?.last_name || '',
            },
            {
              name: ['gender'],
              value: data?.gender || '',
            },
            {
              name: ['email'],
              value: data?.email || '',
            },
            {
              name: ['phone'],
              value: data?.phone || '',
            },
            {
              name: ['country'],
              value: data?.country || '',
            },
            {
              name: ['province'],
              value: data?.province || '',
            },
            {
              name: ['address'],
              value: data?.address || '',
            },
            {
              name: ['role_ids'],
              value: role_ids,
            },
          ]}
        >
          <Row gutter={24}>
            <Col span={7}>
              <Styles.Section>
                {isLoading ? (
                  <Skeleton
                    active
                    paragraph={{ rows: 9 }}
                    className="loading"
                  />
                ) : (
                  <>
                    <Item name="avatar">
                      <div className="avatar">
                        <img
                          src={
                            data?.avatar?.location
                              ? host + data?.avatar?.location
                              : data?.avatar?.origin
                          }
                          disabled
                          alt=""
                        />
                        <div className="name">{data?.full_name}</div>
                      </div>
                    </Item>
                    <div className="divider"></div>

                    <div className="item">
                      <div className="label">Mã nhân viên</div>
                      <div>{data?.id}</div>
                    </div>

                    <div className="item mt-16">
                      <div className="label">Điện thoại</div>
                      <div className="phone">
                        {data?.phone ? '+84 ' + data?.phone : 'N/A'}
                      </div>
                    </div>

                    {!isEmpty(data) && (
                      <Item
                        name="is_partner_user_active"
                        className="mt-24 mb-0"
                      >
                        <div className="status">
                          <div className="label">{t('user.status')}:</div>
                          <Styles.CustomSwitch
                            checkedChildren="Hoạt động"
                            unCheckedChildren="Tạm khóa"
                            defaultChecked={
                              data?.is_partner_user_active === true
                            }
                            onChange={handleUpdateStatus}
                            disabled={
                              data?.is_owner ||
                              !currentUser?.roles?.includes(roles.owner)
                            }
                          />
                        </div>
                      </Item>
                    )}
                  </>
                )}
              </Styles.Section>
            </Col>
            <Col span={17}>
              <Styles.Section>
                {isLoading ? (
                  <Skeleton
                    active
                    paragraph={{ rows: 20 }}
                    className="loading"
                  />
                ) : (
                  <>
                    <Item>
                      <span className="bold">Tài khoản</span> <br />
                      Đây là thông tin tài khoản của nhân viên này
                    </Item>
                    <Item name="id" label={t('user.id')}>
                      <Input disabled />
                    </Item>
                    <Item name="email" label="E-mail">
                      <Input disabled />
                    </Item>
                    {/* <Item>
                      <AButton
                        type="link"
                        disabled={
                          data?.is_owner ||
                          !currentUser?.roles?.includes(roles.owner)
                        }
                        onClick={() => setShowConfirmResetPass(true)}
                      >
                        Reset và gửi lại mật khẩu
                      </AButton>
                    </Item> */}
                    <Item name="created_at" label={t('user.created_at')}>
                      <Input disabled />
                    </Item>
                    <Item name="gender" label={t('user.gender')}>
                      <Radio.Group disabled>
                        <Row gutter={10}>
                          {genders.map(gender => (
                            <Col key={gender}>
                              <Radio value={gender}>
                                {t(`user.${gender}`)}
                              </Radio>
                            </Col>
                          ))}
                        </Row>
                      </Radio.Group>
                    </Item>
                    <Item name="role_ids" label={t('user.userRoles')}>
                      <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={onChangeRole}
                      >
                        <Row gutter={8}>
                          {dataRolesFormat
                            ? dataRolesFormat?.map(
                                (role, index) =>
                                  (role.title.includes('partner_') ||
                                    role.title.includes('owner')) && (
                                    <div className="item-role">
                                      <Checkbox
                                        value={role?.id}
                                        key={index}
                                        disabled={
                                          data?.is_owner ||
                                          !currentUser?.roles?.includes(
                                            roles.owner,
                                          )
                                        }
                                      >
                                        <div
                                          className="title-role"
                                          style={{
                                            color: role.title.includes('owner')
                                              ? 'red'
                                              : '',
                                          }}
                                        >
                                          {role?.title.includes('owner')
                                            ? 'Admin'
                                            : role?.titleFormat}
                                        </div>
                                      </Checkbox>
                                    </div>
                                  ),
                              )
                            : ''}
                        </Row>
                      </Checkbox.Group>
                    </Item>
                    <Divider className="mt-48" />
                    <Item>
                      <div className="d-flex justify-content-between">
                        <div>
                          <span
                            className="bold"
                            style={{
                              color: 'red',
                            }}
                          >
                            Admin -{' '}
                          </span>
                          Quyền quản trị tương đương chủ tài khoản
                        </div>
                        <Button
                          // type="primary"
                          className="btn-sm"
                          color="blue"
                          // htmlType="submit"
                          onClick={() => setVisiableModalConfirm(true)}
                          disabled={data?.is_owner}
                        >
                          Lưu
                        </Button>
                      </div>
                    </Item>
                  </>
                )}
              </Styles.Section>
            </Col>
          </Row>
        </Styles.CustomForm>
        <Styles.CustomModalConfirm
          name="modal__confirm"
          className="modal__confirm"
          visible={visiableModalConfirm}
          footer={null}
          onCancel={() => setVisiableModalConfirm(!visiableModalConfirm)}
        >
          <div className="modal__title">Xác nhận thay đổi quyền nhân viên</div>
          <div className="modal__content">
            Sự thay đổi quyền quản trị của nhân viên sẽ ảnh hưởng đến tài nguyên
            và công việc trong hệ thống.
            <br />
            Bạn chắc chắn về sự thay đổi này ?
          </div>
          <div className="modal__btn">
            <Button
              context="secondary"
              className="btn-sm"
              color="default"
              style={{
                color: 'white',
                background: '#6C798F',
              }}
              width="200px"
              onClick={() => setVisiableModalConfirm(!visiableModalConfirm)}
            >
              Hủy
            </Button>
            <Button
              className="btn-sm"
              color="blue"
              width="200px"
              onClick={handleUpdateRoles}
            >
              Xác nhận
            </Button>
          </div>
        </Styles.CustomModalConfirm>
        {/* <Confirm
          data={{
            message: `Reset lại mật khẩu cho tài khoản ${data?.full_name}`,
          }}
          isFullWidthBtn
          isModalVisible={showConfirmResetPass}
          handleCancel={() => {
            setShowConfirmResetPass(false);
          }}
          handleConfirm={() => {}}
        /> */}
      </Spin>
    </PageWrapper>
  );
}
