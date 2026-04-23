/**
 * Response types derived from live API responses.
 * Numeric measurements are returned as strings by the server.
 */

// ─── Common envelope ──────────────────────────────────────────────────────────

export interface InBodyEnvelope<T> {
  IsSuccess: boolean;
  Token: string | null;
  RefreshToken: string | null;
  Data: T;
  ErrorMsg: string | null;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export interface UserOpenFeature {
  IsOpenMyData: boolean;
  IsOpenInBodyAge: boolean;
  IsOpenConnectH40: boolean;
  IsOpenPopupBWABetaTest: boolean;
  IsBWAPreRelease: boolean;
  IsTouchEnable: boolean;
  IsOpenInBodyHiApp: boolean;
  IsOpenLiveCommerce: boolean;
  IsOpenConsumerEvent: boolean;
  IsOpenInBodyChallenge: boolean;
  IsOpenAcademyPopup: boolean;
  IsOpenH40BetaTester: boolean;
}

export interface LoginData {
  Result: string;
  /** Composite UID including device/customer suffix, e.g. "8173928_NoEqupiMB" */
  UID: string;
  /** Numeric part of the UID */
  UserID: string;
  LoginID: string;
  LoginPW: null;
  Name: string;
  UserNickName: string;
  UserType: string;
  Gender: 'M' | 'F' | string;
  Age: string;
  Birthday: string;
  TelHP: string;
  Email: string;
  UserRegDate: string;
  /** Customer/device suffix part of the composite UID */
  CID: string;
  UserState: string;
  UserPIcon: string | null;
  Height: string;
  Weight: string;
  HRPeriod: string;
  CountryCode: string;
  LangCode: string | null;
  IsNeedSyncData: boolean;
  NeedSyncUID: string;
  InternalAPIURL: string;
  UserOpenFeature: UserOpenFeature;
  SensitiveInfoAgree: boolean;
  LocationInfoAgree: boolean;
  ApplyMarketingAgree: boolean;
  IsInfoApplyAgree: boolean;
  IsMarketingAgree: boolean;
  IsOpenMyData: boolean;
  IsOpenCalibration: boolean;
  IsOpenInBodyAge: boolean;
  [key: string]: unknown;
}

export type LoginResponse = InBodyEnvelope<LoginData>;

// ─── Total count ──────────────────────────────────────────────────────────────

export interface TotalCountData {
  InBodyDataCount: number;
  IsNeedSync: boolean;
  /** Most recent measurement datetime, format yyyyMMddHHmmss */
  Datetimes: string;
  Equip: string;
}

export type TotalCountResponse = InBodyEnvelope<TotalCountData>;

// ─── InBody record sections ───────────────────────────────────────────────────

/** Body composition analysis — weights and segmental water/fat/protein/mineral. */
export interface BCASection {
  UID_DATETIMES: string | null;
  DATETIMES: string;
  UID: string | null;
  AppUID: string;
  /** Weight (kg) */
  WT: string;
  /** Fat-free mass (kg) */
  FFM: string;
  /** Body fat mass (kg) */
  BFM: string;
  BFM_MIN: string;
  BFM_MAX: string;
  /** Skeletal lean mass (kg) */
  SLM: string;
  /** Total body water (L) */
  TBW: string;
  /** Intracellular water (L) */
  ICW: string;
  /** Extracellular water (L) */
  ECW: string;
  PROTEIN: string;
  MINERAL: string;
  /** Fat mass index */
  BFMI: string;
  /** Fat-free mass index */
  FFMI: string;
  IsDeleted: boolean;
  DataType: string;
  EQUIP: string;
  [key: string]: unknown;
}

/** Muscle/fat analysis — BMI, PBF, SMM, and reference scores. */
export interface MFASection {
  UID_DATETIMES: string | null;
  UID: string | null;
  Datetimes: string;
  /** Ideal weight (% of current weight) */
  PWT: string;
  WT_MIN: string;
  WT_MAX: string;
  /** Skeletal muscle mass (% relative to height) */
  SMM: string;
  PSMM: string;
  SMM_MIN: string;
  SMM_MAX: string;
  /** Body mass index */
  BMI: string;
  BMI_MIN: string;
  BMI_MAX: string;
  /** Percent body fat */
  PBF: string;
  PBF_MIN: string;
  PBF_MAX: string;
  /** Percent body fat mass */
  PBFM: string;
  PBFM_MIN: string;
  PBFM_MAX: string;
  /** Waist-hip ratio */
  WHR: string;
  WHR_MIN: string;
  WHR_MAX: string;
  /** Ideal BMI */
  IBMI: string;
  /** Ideal PBF */
  IPBF: string;
  [key: string]: unknown;
}

/** Impedance raw values across frequencies and segments. */
export interface IMPSection {
  UID_DATETIMES: string | null;
  UID: string | null;
  Datetimes: string;
  [key: string]: unknown;
}

/** Extracellular dimension / circumference measurements. */
export interface EDSection {
  UID_DATETIMES: string | null;
  UID: string | null;
  Datetimes: string;
  [key: string]: unknown;
}

/** Lean body mass / segmental lean analysis. */
export interface LBSection {
  UID_DATETIMES: string | null;
  UID: string | null;
  Datetimes: string;
  [key: string]: unknown;
}

/** Wellness/control scores and basal metabolic rate. */
export interface WCSection {
  UID_DATETIMES: string | null;
  UID: string | null;
  Datetimes: string;
  /** Wellness score */
  WC: string;
  /** Fat control */
  FC: string;
  /** Muscle control */
  MC: string;
  /** Fitness score */
  FS: string;
  /** Visceral fat area */
  VFA: string;
  /** Visceral fat level */
  VFL: string;
  /** Height (cm) */
  HT: string;
  AGE: string;
  SEX: string;
  /** Basal metabolic rate (kcal) */
  BMR: string;
  BMR_MIN: string;
  BMR_MAX: string;
  FSRANK: string;
  [key: string]: unknown;
}

/** Health/fitness community ranking data. */
export interface RankingSection {
  UID_DATETIMES: string;
  UID: string;
  DATETIMES: string;
  HealthRankAllTotalMember: string;
  HealthRankAllMyRank: string;
  HealthRankAllMyRankPercent: string;
  HealthRankAllMyRankTop: string;
  SlimRankAllTotalMember: string;
  SlimRankAllMyRank: string;
  SlimRankAllMyRankPercent: string;
  MuscleRankAllTotalMember: string;
  MuscleRankAllMyRank: string;
  MuscleRankAllMyRankPercent: string;
  ReadGraph: boolean;
  [key: string]: unknown;
}

export interface InBodyRecord {
  /** Composite UID, e.g. "8173928_NoEqupiMB" */
  UID: string;
  LocalUID: string;
  /** Full record key used for fetching detail, e.g. "8173928_NoEqupiMB_20260421152441" */
  UID_DATETIMES: string;
  /** Measurement datetime, format yyyyMMddHHmmss */
  DATETIMES: string;
  BCA: BCASection;
  MFA: MFASection;
  IMP: IMPSection;
  ED: EDSection;
  LB: LBSection;
  WC: WCSection;
  Ranking: RankingSection;
}

export type InBodyDataResponse = InBodyEnvelope<InBodyRecord[]>;

// ─── Body type ────────────────────────────────────────────────────────────────

export interface BodyTypeData {
  [key: string]: unknown;
}

export type BodyTypeResponse = InBodyEnvelope<BodyTypeData | null>;

// ─── Summary metrics ──────────────────────────────────────────────────────────

/** Key body composition metrics extracted from a single InBody record. */
export interface InBodySummaryMetrics {
  /** Measurement datetime, format yyyyMMddHHmmss */
  datetime: string | null;
  /** Weight (kg) */
  weight: string | null;
  /** Skeletal muscle mass (kg) */
  skeletalMuscleMass: string | null;
  /** Percent body fat */
  percentBodyFat: string | null;
  /** Body fat mass (kg) */
  bodyFatMass: string | null;
  /** Body mass index */
  bodyMassIndex: string | null;
}
