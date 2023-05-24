import React, { useMemo, useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link } from 'app/components';
import { menus, menusCSKH } from './constants';
// import Icon from '@ant-design/icons';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectRoles } from '../slice/selectors';
import constants from 'assets/constants';
import { CustomStyle } from 'styles/commons';

const { roles } = constants;
const { SubMenu } = Menu;

const menuKeyList = [];
(function getKeyList(arr, parent) {
  arr.forEach(item => {
    menuKeyList.push({ current: item.link || item.name, parent });
    if (item.subMenus) {
      getKeyList(item.subMenus, item.name);
    }
  });
})(menus);

function getMatchKey(pathname) {
  for (let i = 0; i < menuKeyList.length; i++) {
    if (pathname.startsWith(menuKeyList[i].current)) {
      return menuKeyList[i];
    }
  }
  return {};
}

export function SidebarMenu() {
  const currentUserRoles = useSelector(selectRoles);
  const [state, setState] = useState({ matchKey: '', defaultOpen: '' });

  useEffect(() => {
    const { current, parent } = getMatchKey(window.location.pathname);
    setState({ matchKey: current, defaultOpen: parent });
  }, [window.location.pathname]);

  const { matchKey, defaultOpen } = state;

  const filteredMenu = useMemo(() => {
    function hasAccessByRoles(requiredRoles) {
      if (!requiredRoles || currentUserRoles?.includes(roles.superAdmin))
        return true;
      for (let i = 0; i < requiredRoles.length; i++) {
        if (currentUserRoles.includes(requiredRoles[i])) {
          return true;
        }
      }
      return false;
    }
    const copiedMenuList = menus.filter(item => {
      return hasAccessByRoles(item.requiredRoles);
    });
    copiedMenuList.forEach(item => {
      if (item.subMenus) {
        item.subMenus = [...item.subMenus].filter(item => {
          return hasAccessByRoles(item.requiredRoles);
        });
      }
    });
    return copiedMenuList;
  }, [currentUserRoles]);

  return (
    <CustomerMenu
      mode="inline"
      // defaultOpenKeys={[defaultOpen]}
      openKeys={[defaultOpen]}
      style={{ height: '100%' }}
      // defaultSelectedKeys={[matchKey]}
      selectedKeys={[matchKey]}
    >
      {filteredMenu.map(item => {
        if (item.subMenus) {
          return (
            <SubMenu
              key={item.name}
              img={<img src={item.icon} alt="" />}
              title={item.name}
            >
              {item.subMenus.map(childItem => {
                return (
                  <Menu.Item
                    key={childItem.link}
                    icon={
                      childItem.icon ? (
                        <img src={childItem.icon} alt="" />
                      ) : undefined
                    }
                  >
                    <Link to={childItem.link}>{childItem.name}</Link>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={item.link}
              icon={item.icon ? <img src={item.icon} alt="" /> : undefined}
            >
              <Link to={item.link}>{item.name}</Link>
            </Menu.Item>
          );
        }
      })}
      <Menu.Item title="122" className="menu-footer item-version">
        <CustomStyle fontWeight="medium" color="primary">
          Phiên bản: {process.env.REACT_APP_VERSION_APP}
        </CustomStyle>
      </Menu.Item>
      {menusCSKH.map(item => {
        return (
          <Menu.Item
            key={item.link}
            icon={item.icon ? <img src={item.icon} alt="" /> : undefined}
            title={item.name}
            className={
              item.key === 1 ? 'menu-footer item-cskh' : 'menu-footer item-mess'
            }
          >
            <a href={item.link} target="blank">
              {item.name}
            </a>
          </Menu.Item>
        );
      })}
    </CustomerMenu>
  );
}

const CustomerMenu = styled(Menu)`
  height: 100%;
  overflow: auto;
  position: relative;
  a,
  .ant-menu-item,
  .ant-menu-submenu-title {
    /* color: red; */
    color: ${({ theme }) => theme.grayBlue};
    :hover {
      /* font-weight: 500; */
      color: ${({ theme }) => theme.primary};
    }
  }
  :not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: ${({ theme }) => theme.backgroundBlue};
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
    a {
      color: ${({ theme }) => theme.primary};
    }
  }
  .ant-menu-item::after {
    display: none;
  }
  .ant-menu-item {
    height: 45px;
    text-decoration: none;
    &-icon {
      width: 22px;
    }
    a {
      text-decoration: none;
    }
  }
  .ant-menu-item-selected {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #3d56a6;
    &::before {
      content: '';
      width: 4px;
      height: 45px;
      position: absolute;
      left: 0px;
      background: #3d56a6;
      border-radius: 0px 6px 6px 0px;
    }
  }
  .menu-footer {
    background: #fff;
    position: absolute;
  }
  .item-version {
    bottom: 152px;
  }
  .item-cskh {
    bottom: 112px;
  }
  .item-mess {
    bottom: 72px;
    border-top: 1px solid #ebebf0;
  }
`;
