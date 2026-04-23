export enum InBodyBaseUrl {
  Korea = 'https://appapikr.lookinbody.com',
  Europe = 'https://appapieur.lookinbody.com',
  USA = 'https://appapiusav2.lookinbody.com',
}

export * from './responses';

export interface InBodyCredentials {
  id?: string;
  password?: string;
}

export interface InBodyApiOptions extends InBodyCredentials {
  /** Country-specific API base URL. Defaults to the Korean endpoint. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30 000. */
  timeoutMs?: number;
  /** Country dialing code sent with login payload. Defaults to '82' (Korea). */
  countryCode?: string;
  /** App version string sent with login payload. Defaults to '1.0.0'. */
  appVersion?: string;
  /** Device type string sent with login payload. Defaults to 'Android'. */
  deviceType?: string;
}

export interface InBodyTokens {
  accessToken: string;
  refreshToken: string;
}

export interface InBodyApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

/** Extra options that can be passed to login() to override or supply credentials and sync-datetime fields. */
export interface LoginOptions {
  /** Overrides the id set on the constructor for this call. */
  loginId?: string;
  /** Overrides the password set on the constructor for this call. */
  loginPw?: string;
  countryCode?: string;
  appVersion?: string;
  type?: string;
  deviceType?: string;
  customKey?: string;
  syncType?: string;
  syncDatetime?: string;
  syncDatetimeInBody?: string;
  syncDatetimeExercise?: string;
  syncDatetimeNutrition?: string;
  syncDatetimeSleep?: string;
  syncDatetimeCardiac?: string;
  syncDatetimeBasalMedical?: string;
}

export interface GetInBodyDataParams {
  uid: string;
  syncDatetime?: string;
  numberPerData?: number | string;
  currentIndex?: number | string;
  language?: string;
}

export interface GetInBodyDataTotalCountParams {
  uid: string;
  syncDatetimeInBody?: string;
}

export interface GetInBodyBodyTypeParams {
  uidDatetimes: string;
  language?: string;
}
