/**
 *
 * Asynchronously loads the component for Affiliate
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Affiliate = lazyLoad(
  () => import('./index'),
  module => module.Affiliate,
);
