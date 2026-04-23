import ky from 'ky';
import { InBodyBaseUrl } from './types';
import type {
  BodyTypeResponse,
  GetInBodyBodyTypeParams,
  GetInBodyDataParams,
  GetInBodyDataTotalCountParams,
  InBodyApiOptions,
  InBodyApiResponse,
  InBodyDataResponse,
  InBodyTokens,
  LoginOptions,
  LoginResponse,
  TotalCountResponse,
} from './types';

const DEFAULT_BASE_URL = InBodyBaseUrl.Korea;
const DEFAULT_TIMEOUT_MS = 30_000;

export default class InBodyApi {
  private readonly _id: string;
  private readonly _password: string;
  private readonly _baseUrl: string;
  private readonly _timeoutMs: number;
  private readonly _countryCode: string;
  private readonly _appVersion: string;
  private readonly _deviceType: string;

  private _accessToken = '';
  private _refreshToken = '';

  constructor(options: InBodyApiOptions) {
    this._id = options.id ?? '';
    this._password = options.password ?? '';
    this._baseUrl = options.baseUrl ? String(options.baseUrl).replace(/\/+$/, '') : DEFAULT_BASE_URL;
    this._timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this._countryCode = options.countryCode ?? '82';
    this._appVersion = options.appVersion ?? '1.0.0';
    this._deviceType = options.deviceType ?? 'Android';
  }

  // ─── Token management ───────────────────────────────────────────────────────

  setTokens({ accessToken, refreshToken }: InBodyTokens): void {
    this._accessToken = accessToken ?? '';
    this._refreshToken = refreshToken ?? '';
  }

  getTokens(): InBodyTokens {
    return { accessToken: this._accessToken, refreshToken: this._refreshToken };
  }

  clearTokens(): void {
    this._accessToken = '';
    this._refreshToken = '';
  }

  // ─── HTTP primitives ────────────────────────────────────────────────────────

  /** Raw POST without any retry logic. Used directly by refreshAccessToken to avoid recursion. */
  private async _fetchJson<T = unknown>(url: string, body?: unknown): Promise<InBodyApiResponse<T>> {
    const headers: Record<string, string> = {};
    if (this._accessToken) {
      headers.Authorization = `Bearer ${this._accessToken}`;
    }

    const response = await ky.post(url, {
      json: body,
      headers,
      throwHttpErrors: false,
      timeout: this._timeoutMs,
    });

    const text = await response.text();
    let data: T;
    try {
      data = text ? (JSON.parse(text) as T) : (null as unknown as T);
    } catch {
      data = text as unknown as T;
    }

    return { ok: response.ok, status: response.status, data };
  }

  /** POST with automatic token refresh on 401. */
  private async _requestWithAutoRefresh<T = unknown>(url: string, body?: unknown): Promise<InBodyApiResponse<T>> {
    let r = await this._fetchJson<T>(url, body);

    if (r.status === 401 && this._refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed.accessToken) {
        r = await this._fetchJson<T>(url, body);
      }
    }

    return r;
  }

  /** Build the full URL for a given path, adding a leading / if needed. */
  private _buildUrl(path: string): string {
    return `${this._baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /** Returns both the primary path and its /V2/ variant, unless it already starts with V2/. */
  private _withV2Fallback(path: string): string[] {
    const clean = path.replace(/^\/+/, '');
    if (clean.toUpperCase().startsWith('V2/')) {
      return [path];
    }
    return [clean, `/V2/${clean}`];
  }

  /**
   * Tries each path in order; returns the first non-404 response.
   * Falls back to the first path if all paths return 404.
   */
  private async _postWith404Fallback<T = unknown>(paths: string[], payload?: unknown): Promise<InBodyApiResponse<T>> {
    for (const p of paths) {
      const r = await this._requestWithAutoRefresh<T>(this._buildUrl(p), payload);
      if (r.status !== 404) return r;
    }
    return this._requestWithAutoRefresh<T>(this._buildUrl(paths[0]), payload);
  }

  // ─── Auth ───────────────────────────────────────────────────────────────────

  /**
   * Logs in using the credentials supplied at construction and stores the
   * returned access + refresh tokens for subsequent calls.
   */
  async login(options: LoginOptions = {}): Promise<InBodyApiResponse<LoginResponse>> {
    const loginId = options.loginId ?? this._id;
    const loginPw = options.loginPw ?? this._password;
    if (!loginId || !loginPw) {
      throw new Error('loginId and loginPw are required: provide them in the constructor or as login() arguments');
    }
    const payload = {
      LoginID: loginId,
      LoginPW: loginPw,
      SyncDatetime: options.syncDatetime ?? '',
      SyncDatetimeInBody: options.syncDatetimeInBody ?? '',
      SyncDatetimeExercise: options.syncDatetimeExercise ?? '',
      SyncDatetimeNutrition: options.syncDatetimeNutrition ?? '',
      SyncDatetimeSleep: options.syncDatetimeSleep ?? '',
      SyncDatetimeCardiac: options.syncDatetimeCardiac ?? '',
      SyncDatetimeBasalMedical: options.syncDatetimeBasalMedical ?? '',
      CountryCode: options.countryCode ?? this._countryCode,
      CustomKey: options.customKey ?? '',
      SyncType: options.syncType ?? '',
      Type: options.type ?? '1',
      DeviceType: options.deviceType ?? this._deviceType,
      AppVersion: options.appVersion ?? this._appVersion,
    };

    const r = await this._postWith404Fallback<LoginResponse>(
      this._withV2Fallback('Main/GetLoginWithSyncDataPartV2'),
      payload,
    );

    if (r.ok && r.data) {
      const token = r.data.Token ?? '';
      const refreshToken = r.data.RefreshToken ?? '';
      if (token) this.setTokens({ accessToken: token, refreshToken });
    }

    return r;
  }

  /**
   * Exchanges the stored refresh token for a new access token.
   * Called automatically on 401 responses; can also be called manually.
   */
  async refreshAccessToken(): Promise<InBodyTokens & { ok: boolean; status: number }> {
    if (!this._refreshToken) {
      return { ok: false, status: 0, accessToken: '', refreshToken: '' };
    }

    const payload = { AccessToken: this._accessToken, RefreshToken: this._refreshToken };

    // Use _fetchJson directly to avoid recursion through _requestWithAutoRefresh.
    let r = await this._fetchJson(`${this._baseUrl}/Main/GetAccessToken`, payload);
    if (r.status === 404) {
      r = await this._fetchJson(`${this._baseUrl}/V2/Main/GetAccessToken`, payload);
    }

    if (r.ok && r.data && typeof r.data === 'object') {
      const data = r.data as Record<string, unknown>;
      const token = (data.Token as string) ?? '';
      const refreshToken = (data.RefreshToken as string) ?? this._refreshToken;
      if (token) this.setTokens({ accessToken: token, refreshToken });
    }

    return { ok: r.ok, status: r.status, accessToken: this._accessToken, refreshToken: this._refreshToken };
  }

  // ─── InBody data ────────────────────────────────────────────────────────────

  /** Fetches paged InBody measurement history. */
  async getInBodyData({
    uid,
    syncDatetime = '',
    numberPerData = '20',
    currentIndex = '0',
    language = 'en_us',
  }: GetInBodyDataParams): Promise<InBodyApiResponse<InBodyDataResponse>> {
    if (!uid) throw new Error('uid is required');
    return this._postWith404Fallback<InBodyDataResponse>(this._withV2Fallback('InBody/GetInBodyData'), {
      UID: uid,
      SyncDatetime: syncDatetime,
      NumberPerData: String(numberPerData),
      CurrentIndex: String(currentIndex),
      Language: language,
    });
  }

  /** Returns the total count of InBody records for sync freshness checks. */
  async getInBodyDataTotalCount({
    uid,
    syncDatetimeInBody = '',
  }: GetInBodyDataTotalCountParams): Promise<InBodyApiResponse<TotalCountResponse>> {
    if (!uid) throw new Error('uid is required');
    return this._postWith404Fallback<TotalCountResponse>(this._withV2Fallback('InBody/GetInBodyDataTotalCount'), {
      UID: uid,
      SyncDatetimeInBody: syncDatetimeInBody,
    });
  }

  /** Fetches body-type classification detail for a specific measurement record. */
  async getInBodyBodyType({
    uidDatetimes,
    language = 'en_us',
  }: GetInBodyBodyTypeParams): Promise<InBodyApiResponse<BodyTypeResponse>> {
    if (!uidDatetimes) throw new Error('uidDatetimes is required');
    return this._postWith404Fallback<BodyTypeResponse>(this._withV2Fallback('InBody_v3/GetInBodyBodyType'), {
      UID_DATETIMES: uidDatetimes,
      Language: language,
    });
  }
}
