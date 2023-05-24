import { GlobalState } from 'app/pages/AppPrivate/slice/types';
import { AuthState } from 'app/pages/Auth/slice/types';
import { VerifyState } from 'app/pages/Verify/slice/types';
import { ProductsState } from 'app/pages/Products/slice/types';
import { CategoriesState } from 'app/pages/Categories/slice/types';
// import { SelectedProductsState } from 'app/pages/ProductsList/SelectedProducts/slice/types';
import { SellingProductsState } from 'app/pages/ProductsList/SellingProducts/slice/types';
import { MyWalletState } from 'app/pages/MyWallet/slice/types';
import { MyProfileState } from 'app/pages/MyProfile/slice/types';
import { EmployeesState } from 'app/pages/Employees/slice/types';
import { AffiliateState } from 'app/pages/Affiliate/slice/types';

import { ThemeState } from 'styles/theme/slice/types';

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  theme?: ThemeState;
  global?: GlobalState;
  auth?: AuthState;
  verify?: VerifyState;
  products?: ProductsState;
  categories?: CategoriesState;
  selectedProducts?: any;
  sellingProducts?: SellingProductsState;
  mywallet?: MyWalletState;
  myprofile?: MyProfileState;
  employees?: EmployeesState;
  affiliate?: AffiliateState;
  // warehousing?: WarehousingState;
  orders?: any;
  analysis?: any;

  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
