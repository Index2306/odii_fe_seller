/**
 *
 * Asynchronously loads the component for Stores
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ConnectSaleChannel = lazyLoad(
  () => import('./index'),
  module => module.ConnectSaleChannel,
);
