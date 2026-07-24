// LocalStorage Usage Limit Management for Gohannavi Additive Checker

const STORAGE_KEY = "gohannavi_usage";
const DAILY_LIMIT = 3;

export interface UsageRecord {
  date: string; // YYYY-MM-DD
  count: number;
}

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStoredRecord(): UsageRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UsageRecord;
  } catch (e) {
    console.error("Failed to read gohannavi_usage from LocalStorage", e);
    return null;
  }
}

/**
 * 今日の利用可能判定
 * - 保存された日付と今日が異なる場合は true (リセット扱い)
 * - count が 3 未満の場合は true, 3 以上は false
 */
export function canUseToday(): boolean {
  if (typeof window === "undefined") return true;

  const record = getStoredRecord();
  const today = getTodayString();

  if (!record || record.date !== today) {
    return true;
  }

  return record.count < DAILY_LIMIT;
}

/**
 * 今日の残り回数を取得 (3 - count)
 * - データがない・日付が違う場合は 3 を返す
 */
export function getUsageCount(): number {
  if (typeof window === "undefined") return DAILY_LIMIT;

  const record = getStoredRecord();
  const today = getTodayString();

  if (!record || record.date !== today) {
    return DAILY_LIMIT;
  }

  return Math.max(0, DAILY_LIMIT - record.count);
}

/**
 * 利用回数を +1 加算
 * - canUseToday() が false の場合は false を返して終了
 * - count を +1 して保存し、true を返す
 */
export function incrementUsage(): boolean {
  if (typeof window === "undefined") return false;

  if (!canUseToday()) {
    return false;
  }

  const today = getTodayString();
  const record = getStoredRecord();

  let currentCount = 0;
  if (record && record.date === today) {
    currentCount = record.count;
  }

  const newRecord: UsageRecord = {
    date: today,
    count: currentCount + 1,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecord));
    return true;
  } catch (e) {
    console.error("Failed to save gohannavi_usage to LocalStorage", e);
    return false;
  }
}
