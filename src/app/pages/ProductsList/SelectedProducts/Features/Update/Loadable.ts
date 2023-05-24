/**
 *
 * Asynchronously loads the component for Products
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UpdateSelectedProducts = lazyLoad(
  () => import('./index'),
  module => module.UpdateSelectedProducts,
);
