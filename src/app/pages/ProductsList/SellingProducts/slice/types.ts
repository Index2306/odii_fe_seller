/* --- STATE --- */
export interface dataProducts {
  data: any;
}

export interface SellingProductsState extends dataProducts {
  loading: boolean;
  showEmptyPage: boolean;
  isFirst: boolean;
  details: any;
  listSelling: any;
  listStores: any;
}

export type ContainerState = SellingProductsState;
