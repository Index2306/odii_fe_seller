/**
 *
 * AppPrivate
 *
 */
import React, { memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'app/components';
import { isEmpty } from 'lodash';
import { isAdmin } from 'utils/helpers';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectRoles } from 'app/pages/AppPrivate/slice/selectors';
import { menus } from 'app/pages/AppPrivate/Layout/constants';
import { AppLayout } from './Layout';
import { NotFoundPage, Incoming } from 'app/components';

import AuthRoute from './AuthRoute';
import { HomePage } from 'app/pages/HomePage/Loadable';
import { Products } from 'app/pages/Products/Loadable';
import { SupplierDetail } from 'app/pages/Products/SupplierDetail/Loadable';
import { Employees } from '../Employees/Loadable';
import { DetailEmployee } from '../Employees/Features/Detail/Loadable';
import { SelectedProducts } from 'app/pages/ProductsList/SelectedProducts/Loadable';
import { UpdateSelectedProducts } from 'app/pages/ProductsList/SelectedProducts/Features/Update/Loadable';
import { SellingProducts } from 'app/pages/ProductsList/SellingProducts/Loadable';
import { UpdateSellingProducts } from 'app/pages/ProductsList/SellingProducts/Features/Update/Loadable';
import { Dashboard } from 'app/pages/Dashboard/Loadable';
import { Analysis } from 'app/pages/Analysis/Loadable';
import { Categories } from 'app/pages/Categories/Loadable';
import { DetailCategories } from 'app/pages/Categories/Features/Detail/Loadable';
import { UpdateCategories } from 'app/pages/Categories/Features/CreateAndUpdate/Loadable';
import { CreateCategories } from 'app/pages/Categories/Features/CreateAndUpdate/Loadable';
import { Stores } from 'app/pages/Stores/Loadable';
import { DetailStores } from 'app/pages/Stores/Features/Detail/Loadable';
import { Orders } from 'app/pages/Orders/Loadable';
import { UpdateOrder } from 'app/pages/Orders/Features/Update/Loadable';
import { ConnectSaleChannel } from 'app/pages/Connect-Sale-Channel/Loadable';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';

import { MyWallet } from '../MyWallet/Loadable';
import { DetailTransaction } from '../MyWallet/Features/Detail/Loadable';
import { MyProfile } from '../MyProfile/Loadable';
import { DepositMoney } from '../MyWallet/Features/DepositMoney/Loadable';
import { WithdrawalMoney } from '../MyWallet/Features/WithdrawalMoney/Loadable';

import { Affiliate } from '../Affiliate/Loadable';

import { globalActions } from './slice';
import { CreateOrder } from '../Orders/Features/Create';
import { ImportOrder } from '../Orders/Features/Import';
import { AccountDebtPeriodOverview } from '../Accountant/AccountDebtPeriodOverview';
import { UserDebtDetail } from '../Accountant/AccountDebtPeriodOverview/Features/UserDebtDetail';
import { AccountantPeriodOverviewDetailTransaction } from '../Accountant/AccountDebtPeriodOverview/Features/DetailTransaction/Loadable';

const lists = [
  {
    path: '/',
    title: 'home',
    Component: HomePage,
  },
  {
    path: '/dashboard',
    title: 'dashboard.title',
    Component: Dashboard,
  },
  {
    path: '/analysis',
    title: 'analysis.title',
    Component: Analysis,
  },
  {
    path: '/transactions/list',
    title: 'transaction.list',
    Component: HomePage,
  },
  {
    path: '/transactions/verify',
    title: 'transaction.verify',
    Component: HomePage,
  },
  {
    path: '/products/:id?',
    title: 'product.list',
    Component: Products,
  },

  {
    path: '/selected-products',
    title: 'product.selected',
    Component: SelectedProducts,
  },
  {
    path: '/selected-products/update',
    title: 'product.selected-update',
    Component: UpdateSelectedProducts,
  },
  {
    path: '/selling-products',
    title: 'product.selling',
    Component: SellingProducts,
  },
  {
    path: '/selling-products/update/:id',
    title: 'product.selling-update',
    Component: UpdateSellingProducts,
  },
  {
    path: '/orders',
    title: 'order.list',
    Component: Orders,
  },
  {
    path: '/orders/update/:id',
    title: 'order.update',
    Component: UpdateOrder,
  },
  {
    path: '/orders/create',
    title: 'order.create',
    Component: CreateOrder,
  },
  {
    path: '/orders/import',
    title: 'order.import',
    Component: ImportOrder,
  },
  {
    path: '/stores',
    title: 'Cửa hàng đã kết nối',
    Component: Stores,
  },
  {
    path: '/stores/detail/:id/:detailId?',
    title: 'store.detail',
    Component: DetailStores,
  },
  {
    path: '/categories',
    title: 'category.list',
    Component: Categories,
  },
  {
    path: '/categories/Detail/:id',
    title: 'category.detail',
    Component: DetailCategories,
  },
  {
    path: '/categories/uc',
    title: 'category.create',
    Component: CreateCategories,
  },
  {
    path: '/categories/uc/:id?',
    title: 'category.update',
    Component: UpdateCategories,
  },
  {
    path: '/mywallet',
    title: 'mywallet.list',
    Component: MyWallet,
  },
  {
    path: '/mywallet/:id/detail',
    title: 'mywallet.detail',
    Component: DetailTransaction,
  },
  {
    path: '/mywallet/deposit',
    title: 'mywallet.deposit',
    Component: DepositMoney,
  },
  {
    path: '/mywallet/withdrawal',
    title: 'mywallet.withdrawal',
    Component: WithdrawalMoney,
  },
  {
    path: '/myprofile',
    title: 'myprofile.info',
    Component: MyProfile,
  },
  {
    path: '/employees',
    title: 'employee.list',
    Component: Employees,
  },
  {
    path: '/employees/:id/detail/:type',
    title: 'employee.info',
    Component: DetailEmployee,
  },

  {
    path: '/affiliate',
    title: 'affiliate.title',
    Component: Affiliate,
  },
  {
    path: '/accountant/debt-overview',
    title: 'accountant.debtOverview',
    Component: AccountDebtPeriodOverview,
  },
  {
    path: '/accountant/detail-user-debt',
    title: 'accountant.UserDebtDetail',
    Component: UserDebtDetail,
  },
  {
    path: '/accountant/detail-debt-transaction/:id',
    title: 'accountant.detail',
    Component: AccountantPeriodOverviewDetailTransaction,
  },
];

export const PrivateRoutes = memo(props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const roles = useSelector(selectRoles);

  const userInfo = useSelector(selectCurrentUser);

  React.useEffect(() => {
    dispatch(globalActions.getProvinces());
  }, []);

  React.useEffect(() => {
    if (userInfo?.status === 'inactive') {
      window.location.href = '/auth/sigin';
    }
  }, [userInfo]);

  const routerList = useMemo(() => {
    const admin = isAdmin(roles);

    const handleRouterShow = params => {
      if (
        admin ||
        isEmpty(params.requredRoles) ||
        roles.some(v => params.requredRoles?.includes(v))
      ) {
        return lists.filter(r => r.path.includes(params.link));
      }
      return [];
    };

    const listFinal = menus.reduce(
      (final, item) => {
        if (item.link) {
          final = final.concat(handleRouterShow(item));
        } else {
          item.subMenus.forEach(content => {
            final = final.concat(handleRouterShow(content));
          });
        }
        return final;
      },
      [
        {
          path: '/',
          title: 'Home',
          Component: HomePage,
        },
        {
          path: '/myprofile',
          title: 'myprofile.info',
          Component: MyProfile,
        },
        {
          path: '/incoming1',
          title: 'incoming',
          Component: Incoming,
        },
        {
          path: '/incoming2',
          title: 'incoming',
          Component: Incoming,
        },
        {
          path: '/supplier/detail/:id/:detailId?',
          title: 'Supplier Detail',
          Component: SupplierDetail,
        },
        {
          path: '/connect-sale-channel/:platform',
          title: 'Đang kết nối với cửa hàng',
          Component: ConnectSaleChannel,
        },
        {
          path: '/accountant/detail-user-debt',
          title: 'accountant.UserDebtDetail',
          Component: UserDebtDetail,
        },
        {
          path: '/accountant/detail-debt-transaction/:id',
          title: 'accountant.detail',
          Component: AccountantPeriodOverviewDetailTransaction,
        },
      ],
    );
    return listFinal;
  }, [roles]);

  return (
    <AppLayout>
      <Div>
        <Breadcrumb location={props.location} />
        <Switch>
          {routerList.map(item => (
            <AuthRoute
              {...props}
              path={item.path}
              exact={item.exact === false ? false : true}
              key={item.path}
              title={t(item.title)}
              component={item.Component}
            />
          ))}
          <Route component={NotFoundPage} />
        </Switch>
      </Div>
    </AppLayout>
  );
});

const Div = styled.div`
  .site-layout {
    min-height: 100vh;
  }
  .breadcrumb-header {
    display: flex;
  }
`;
