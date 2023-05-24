/**
 *
 * Asynchronously loads the component for Products
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UpdateSellingProducts = lazyLoad(
  () => import('./index'),
  module => module.UpdateSellingProducts,
);
