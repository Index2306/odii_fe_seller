/* --- STATE --- */

export enum RepoErrorType {
  RESPONSE_ERROR = 1,
  USER_NOT_FOUND = 2,
}

export interface AuthState {
  loading: boolean;
  accessToken: string | null;
  error?: RepoErrorType | any;
  repositories: object;
  isUserActived: boolean;
}

export type ContainerState = AuthState;
