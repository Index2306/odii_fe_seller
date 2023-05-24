/**
 * Menu sidebar tối giản theo design
 * Tối da 2 cấp.
 * Nếu có 2 cấp thì cấp 1 hay parent sẽ chỉ là title not link.
 */
import React, { useMemo } from 'react';
import { Divider, Menu } from 'antd';
import { Link } from 'app/components';
import { menus, menusCSKH, DEFAULT_ITEM } from './constants';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectRoles } from '../slice/selectors';
import { selectedTotal } from '../../ProductsList/SelectedProducts/slice/selectors';
import { selectTotal } from '../../ProductsList/SellingProducts/slice/selectors';

export function SidebarMenu({ sidebarIsCollapsed }) {
  const userRoles = useSelector(selectRoles);
  const select = useSelector(selectedTotal);
  const data = useSelector(selectTotal);

  function getMathMenuItem(pathname, menuItems) {
    let mathMenuItem;
    for (let menuItem of menuItems) {
      const subMenus = menuItem.subMenus;
      if (subMenus) {
        mathMenuItem = getMathMenuItem(pathname, subMenus);
      }
      if (mathMenuItem) {
        return mathMenuItem;
      }
      // not have subMenu
      const menuItemPath = menuItem.link || menuItem.name;
      if (pathname.startsWith(menuItemPath)) {
        return menuItemPath;
      }
    }
    return '';
  }

  const hasAuthor = menu => {
    const requiredRoles = menu.requiredRoles;
    return (
      !requiredRoles ||
      userRoles.some(userRole => requiredRoles.includes(userRole))
    );
  };

  const matchKey = useMemo(
    () => getMathMenuItem(window.location.pathname, menus),
    [window.location.pathname],
  );

  const authMenu = useMemo(() => {
    const result = [];
    for (let menuItem of menus) {
      const subMenus = menuItem.subMenus;
      if (!hasAuthor(menuItem) || menuItem.ignore) {
        continue;
      }
      if (subMenus) {
        const subAuthMenu = subMenus.filter(subMenu => hasAuthor(subMenu));
        if (subAuthMenu.length) {
          const parentMenu = { name: menuItem.name, subMenus: subAuthMenu };
          result.push(parentMenu);
        }
      } else {
        const menu = {
          name: menuItem.name,
          icon: menuItem.icon,
          link: menuItem.link,
          quantity:
            menuItem.name == DEFAULT_ITEM.sellingProduct
              ? data
              : menuItem.name == DEFAULT_ITEM.selectedProduct
              ? select
              : null,
        };
        result.push(menu);
      }
    }
    return result;
  }, [userRoles, data]);

  return (
    <Wrapper className="d-flex flex-column">
      <div>
        <CustomMenu mode="inline" style={{ flex: 1 }} selectedKeys={[matchKey]}>
          {authMenu.map(item => {
            const subMenus = item.subMenus;
            const menuItems = subMenus || [item];
            return (
              <>
                {subMenus && (
                  <li className="menu-parent">
                    {sidebarIsCollapsed ? <CustomDivider /> : item.name}
                  </li>
                )}
                {menuItems.map(menuItem => {
                  return (
                    <Menu.Item
                      key={menuItem.link}
                      icon={menuItem.icon && <img src={menuItem.icon} alt="" />}
                    >
                      <Link to={menuItem.link}>
                        <div className="custom-item">
                          {menuItem.name}
                          {/* {menuItem.quantity > 0 && (
                            <div className="quantity-box">
                              <span>{menuItem.quantity}</span>
                            </div>
                          )} */}
                        </div>
                      </Link>
                    </Menu.Item>
                  );
                })}
              </>
            );
          })}
        </CustomMenu>
      </div>
      <CustomMenuFooter>
        {menusCSKH.map(item => {
          return (
            <Menu.Item
              key={item.link}
              icon={item.icon ? <img src={item.icon} alt="" /> : undefined}
              title={item.name}
              className={
                item.key === 1 ? 'menu-footer' : 'menu-footer item-mess'
              }
            >
              <a href={item.link} target="blank">
                {item.name}
              </a>
            </Menu.Item>
          );
        })}
      </CustomMenuFooter>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  height: calc(100% - 64px);
  flex-direction: column;

  > :first-child {
    flex: 1;
    overflow: auto;
  }
`;

const CustomMenu = styled(Menu)`
  a,
  .ant-menu-item,
  .ant-menu-submenu-title {
    color: ${({ theme }) => theme.grayBlue};
    :hover {
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
  .menu-parent {
    color: #bdbdbd;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.02rem;
    padding-top: 2px;
    padding-left: 24px;
    height: 45px;
    display: flex;
    align-items: center;
  }
  .custom-item {
    display: flex;
    justify-content: space-between;
    line-height: 22px;

    .quantity-box {
      background: #6c798f;
      border-radius: 2px;
      min-width: 23px;
      width: auto;
      text-align: center;

      span {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: #fff;
      }
    }
  }
`;

const CustomMenuFooter = styled(Menu)`
  a,
  .ant-menu-item,
  .ant-menu-submenu-title {
    color: ${({ theme }) => theme.grayBlue};
    :hover {
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
    background-color: #ffffff !important;
  }
  .menu-footer {
    background: #fff;
    padding: 0 24px;
    margin-top: 0;
    margin-bottom: 0;
    &:first-child {
      margin-top: 0;
      margin-bottom: 0;
    }
    &:last-child {
      border-top: 1px solid #ebebf0;
      margin-bottom: 8px;
    }
  }
`;

const CustomDivider = styled(Divider)`
  margin: 15px -9px;
  border-top: 3px solid rgba(0, 0, 0, 0.3);
`;
