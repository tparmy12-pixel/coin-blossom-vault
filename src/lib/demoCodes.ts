const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateCode = (len = 10): string => {
  let s = "";
  for (let i = 0; i < len; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return s;
};

export const generateTxnId = (): string =>
  "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

interface CodeRecord { code: string; source: string; at: string; }
const KEY_CODES = "prankpay_codes";

export const saveCode = (code: string, source: string) => {
  const list: CodeRecord[] = JSON.parse(localStorage.getItem(KEY_CODES) || "[]");
  list.unshift({ code, source, at: new Date().toISOString() });
  localStorage.setItem(KEY_CODES, JSON.stringify(list.slice(0, 100)));
};

export const getCodes = (): CodeRecord[] =>
  JSON.parse(localStorage.getItem(KEY_CODES) || "[]");

// Withdrawals
export interface Withdrawal {
  id: string; amount: number; upi: string; status: "pending" | "approved" | "rejected"; at: string;
}
const KEY_W = "prankpay_withdrawals";
export const getWithdrawals = (): Withdrawal[] => JSON.parse(localStorage.getItem(KEY_W) || "[]");
export const saveWithdrawals = (l: Withdrawal[]) => localStorage.setItem(KEY_W, JSON.stringify(l));
export const addWithdrawal = (amount: number, upi: string): Withdrawal => {
  const w: Withdrawal = { id: generateTxnId(), amount, upi, status: "pending", at: new Date().toISOString() };
  const l = getWithdrawals(); l.unshift(w); saveWithdrawals(l); return w;
};

// Support
export interface SupportMsg { id: string; from: "user" | "admin"; text: string; at: string; }
const KEY_S = "prankpay_support";
export const getSupport = (): SupportMsg[] => JSON.parse(localStorage.getItem(KEY_S) || "[]");
export const saveSupport = (l: SupportMsg[]) => localStorage.setItem(KEY_S, JSON.stringify(l));
export const addSupport = (from: "user" | "admin", text: string): SupportMsg => {
  const m: SupportMsg = { id: generateTxnId(), from, text, at: new Date().toISOString() };
  const l = getSupport(); l.push(m); saveSupport(l); return m;
};