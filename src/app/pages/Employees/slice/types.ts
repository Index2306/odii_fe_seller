/* --- STATE --- */
export interface dataEmployees {
  data: any;
}

export interface EmployeesState extends dataEmployees {
  loading: boolean;
  showEmptyPage: boolean;
  isFirst: boolean;
  detail: any;
  dataRole: any;
  dataStoreIds: any;
  listSelected: any;
}

export type ContainerState = EmployeesState;
