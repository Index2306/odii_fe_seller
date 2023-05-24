/**
 *
 * Asynchronously loads the component for SellingProducts
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SellingProducts = lazyLoad(
  () => import('./index'),
  module => module.SellingProducts,
);
