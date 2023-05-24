/**
 *
 * Asynchronously loads the component for Stores
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Stores = lazyLoad(
  () => import('./index'),
  module => module.Stores,
);
