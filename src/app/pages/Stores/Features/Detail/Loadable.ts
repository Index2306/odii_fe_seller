/**
 *
 * Asynchronously loads the component for Stores
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailStores = lazyLoad(
  () => import('./index'),
  module => module.DetailStores,
);
