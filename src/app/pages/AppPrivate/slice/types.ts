/* --- STATE --- */
export interface GlobalState {
  accessToken: string;
  userInfo: any;
  loading: boolean;
  error?: any;
  breadcrumb?: any;
  modalQ?: any;
  currentModal?: any;
  provinces: any;
  tokens: object;
}
