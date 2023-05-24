/* --- STATE --- */
export interface dataAffiliate {
  // data: any;
  dataListSeller: any;
  dataListCommission: any;
}

export interface AffiliateState extends dataAffiliate {
  loading: boolean;
  showEmptyPageSeller: boolean;
  showEmptyPageCommission: boolean;
  isFirstSeller: boolean;
  isFirstCommission: boolean;
  detail: any;
  dataAffiliateCode: any;
  dataStatisticalAffiliate: any;
  dataListPayout: any;
  listSelected: any;
}

export type ContainerState = AffiliateState;
