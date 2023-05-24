/* --- STATE --- */
export interface dataProducts {
  data: any;
}

export interface SelectedProductsState extends dataProducts {
  loading: boolean;
  details: any;
  listSelected: any;
  listStores: any;
}

export type ContainerState = SelectedProductsState;
