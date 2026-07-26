// LocalStorage Usage Limit Management for Gohannavi Additive Checker

const STORAGE_KEY = "gohannavi_usage";
const DAILY_LIMIT = 10;

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
 * 今日の残り回数を取得 (10 - count)
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
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("gohannavi_usage_updated"));
    }
    return true;
  } catch (e) {
    console.error("Failed to save gohannavi_usage to LocalStorage", e);
    return false;
  }
}

/**
 * 利用回数をリセット（テスト用）
 */
export function resetUsage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("gohannavi_usage_updated"));
    }
  } catch (e) {
    console.error("Failed to reset gohannavi_usage", e);
  }
}
