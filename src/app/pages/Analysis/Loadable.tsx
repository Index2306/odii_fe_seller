/**
 * Asynchronously loads the component for Analysis
 */

import { lazyLoad } from 'utils/loadable';

export const Analysis = lazyLoad(
  () => import('./index'),
  module => module.Analysis,
);
