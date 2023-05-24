/**
 *
 * Asynchronously loads the component for SelectedProducts
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectedProducts = lazyLoad(
  () => import('./index'),
  module => module.SelectedProducts,
);
