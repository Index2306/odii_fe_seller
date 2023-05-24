/**
 *
 * Asynchronously loads the component for SupplierDetail
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SupplierDetail = lazyLoad(
  () => import('./index'),
  module => module.SupplierDetail,
);
