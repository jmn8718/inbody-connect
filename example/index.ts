/**
 * Example: fetch all InBody read endpoints and record every response to JSON.
 *
 * Required env vars:
 *   INBODY_LOGIN_ID   — your InBody account login ID
 *   INBODY_LOGIN_PW   — your InBody account password
 *
 * Optional env vars:
 *   INBODY_BASE_URL      — API base URL (defaults to Korea)
 *   INBODY_UID           — account UID (detected from login response when omitted)
 *   INBODY_UID_DATETIMES — "<uid>_<yyyyMMddHHmmss>" key for getInBodyBodyType
 *   INBODY_LANGUAGE      — language code, e.g. "en_us" (default)
 *   INBODY_PAGE_SIZE     — records per page for getInBodyData (default: 20)
 *   INBODY_PAGE_INDEX    — page offset for getInBodyData (default: 0)
 *   INBODY_OUTPUT_DIR    — directory for JSON output files (default: ./example/output)
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { InBodyApi, InBodyBaseUrl } from '../src/index.js';

function env(key: string, fallback = '') {
  return process.env[key] ?? fallback;
}

function saveJson(outputDir: string, filename: string, data: unknown): void {
  const filePath = join(outputDir, filename);
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  saved → ${filePath}`);
}

async function main() {
  const loginId = env('INBODY_LOGIN_ID');
  const loginPw = env('INBODY_LOGIN_PW');

  if (!loginId || !loginPw) {
    console.error('Error: INBODY_LOGIN_ID and INBODY_LOGIN_PW must be set.');
    process.exit(1);
  }

  const outputDir = env('INBODY_OUTPUT_DIR', join(import.meta.dirname, 'output'));
  mkdirSync(outputDir, { recursive: true });

  const client = new InBodyApi({
    baseUrl: env('INBODY_BASE_URL') || InBodyBaseUrl.Korea,
  });

  // ── Login ──────────────────────────────────────────────────────────────────
  console.log('\n── login ──');
  const loginResp = await client.login({ loginId, loginPw });
  console.log('status:', loginResp.status, '| ok:', loginResp.ok);
  saveJson(outputDir, 'login.json', loginResp.data);

  if (!loginResp.ok) {
    console.error('Login failed:', loginResp.data);
    process.exit(1);
  }

  // Resolve UID from the typed login response, fall back to env var.
  const uid = env('INBODY_UID') || loginResp.data?.Data?.UID || '';
  if (!uid) {
    console.error('Could not determine UID. Set INBODY_UID env var and retry.');
    process.exit(1);
  }
  console.log('uid:', uid);

  const language = env('INBODY_LANGUAGE', 'en_us');
  const numberPerData = env('INBODY_PAGE_SIZE', '20');
  const currentIndex = env('INBODY_PAGE_INDEX', '0');

  // ── getInBodyDataTotalCount ────────────────────────────────────────────────
  console.log('\n── getInBodyDataTotalCount ──');
  const countResp = await client.getInBodyDataTotalCount({ uid });
  console.log('status:', countResp.status, '| ok:', countResp.ok);
  console.log('total records:', countResp.data?.Data?.InBodyDataCount ?? 'n/a');
  saveJson(outputDir, 'getInBodyDataTotalCount.json', countResp.data);

  // ── getInBodyData ──────────────────────────────────────────────────────────
  console.log('\n── getInBodyData ──');
  const dataResp = await client.getInBodyData({ uid, language, numberPerData, currentIndex });
  console.log('status:', dataResp.status, '| ok:', dataResp.ok);
  const records = dataResp.data?.Data;
  if (Array.isArray(records)) {
    console.log(`records returned: ${records.length}`);
    for (const r of records) {
      console.log(`  ${r.DATETIMES}  WT=${r.BCA?.WT}  PBF=${r.MFA?.PBF}  BMI=${r.MFA?.BMI}`);
    }
  }
  saveJson(outputDir, 'getInBodyData.json', dataResp.data);

  // ── getInBodyBodyType (requires UID_DATETIMES) ─────────────────────────────
  const uidDatetimes = env('INBODY_UID_DATETIMES');
  if (uidDatetimes) {
    console.log('\n── getInBodyBodyType ──');
    const bodyTypeResp = await client.getInBodyBodyType({ uidDatetimes, language });
    console.log('status:', bodyTypeResp.status, '| ok:', bodyTypeResp.ok);
    saveJson(outputDir, 'getInBodyBodyType.json', bodyTypeResp.data);
  } else {
    console.log('\n── getInBodyBodyType — skipped (set INBODY_UID_DATETIMES to enable) ──');
  }

  console.log('\nDone. All responses saved to', outputDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
