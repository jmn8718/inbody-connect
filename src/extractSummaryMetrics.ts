import type { InBodyRecord, InBodySummaryMetrics } from './types';

/**
 * Extracts a concise summary of key body composition metrics from a single
 * InBody record. Returns null for any metric that cannot be found in the record.
 */
export function extractSummaryMetrics(record: InBodyRecord): InBodySummaryMetrics {
  const sections = ['BCA', 'MFA', 'IMP', 'ED', 'LB', 'WC', 'Ranking'];

  const find = (rec: Record<string, unknown>, keys: string[], secs: string[] = []): string | null => {
    for (const key of keys) {
      const v = rec[key];
      if (v !== undefined && v !== null && v !== '') return String(v);
    }
    for (const sec of secs) {
      const secObj = rec[sec];
      if (!secObj || typeof secObj !== 'object') continue;
      for (const key of keys) {
        const v = (secObj as Record<string, unknown>)[key];
        if (v !== undefined && v !== null && v !== '') return String(v);
      }
    }
    return null;
  };

  const r = record as unknown as Record<string, unknown>;
  return {
    datetime: find(r, ['DATETIMES', 'Datetimes', 'datetime']),
    weight: find(r, ['WT', 'Weight', 'wt', 'weight'], sections),
    skeletalMuscleMass: find(r, ['SMM', 'smm', 'SkeletalMuscleMass'], sections),
    percentBodyFat: find(r, ['PBF', 'pbf', 'PercentBodyFat'], sections),
    bodyFatMass: find(r, ['BFM', 'bfm', 'BodyFatMass'], sections),
    bodyMassIndex: find(r, ['BMI', 'bmi'], sections),
  };
}
