/* --- STATE --- */
export interface dataMyWallet {
  data: any;
}

export interface MyWalletState extends dataMyWallet {
  loading: boolean;
  detail: any;
  dataBankAdmin: any;
  dataBankSeller: any;
  dataCreaterTransaction: any;
  dataBalance: any;
  showEmptyPage: any;
  isFirst: any;
  isFirstBank: any;
  timeline: any;
}

export type ContainerState = MyWalletState;
