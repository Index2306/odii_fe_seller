/* --- STATE --- */
export interface dataProducts {
  productList: any;
  pagination: any;
  productDetail: any;
  detailId: any;
  loading: boolean;
  loadingDetail: boolean;
  isFirstGetList: boolean;
}

export interface ProductsState extends dataProducts {}

export type ContainerState = ProductsState;
