import type { Transaction, Category } from "shared";
import type { Period } from "./chartTypes";
import { isoDate } from "@/utils/date";

export { isoDate };
export const round2 = (n: number) => Math.round(n * 100) / 100;

const monthKey = (date: string) => date.slice(0, 7);

export const todayIso = () => isoDate(new Date());

export const getRange = (
  period: Period,
  customFrom: string,
  customTo: string,
): { from: string; to: string } => {
  if (period === "custom") return { from: customFrom, to: customTo };
  const today = new Date();
  const to = isoDate(today);
  let from: Date;
  switch (period) {
    case "month":
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "3months":
      from = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      break;
    case "6months":
      from = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      break;
    case "year":
      from = new Date(today.getFullYear(), 0, 1);
      break;
  }
  return { from: isoDate(from), to };
};

export const fmtMoney = (val: number) => {
  const abs = Math.abs(val);
  if (abs >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${(val / 1000).toFixed(1)}k`;
  return String(val);
};

export const buildBalanceLine = (txs: Transaction[]) => {
  const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date));
  let bal = 0;
  return sorted.map((t, i) => {
    bal += t.type === "income" ? t.amount : -t.amount;
    return { x: i, balance: round2(bal), date: t.date };
  });
};

export const buildBalanceBar = (txs: Transaction[]) => {
  const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date));
  const map = new Map<string, number>();
  let bal = 0;
  for (const t of sorted) {
    bal += t.type === "income" ? t.amount : -t.amount;
    map.set(monthKey(t.date), bal);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v], i) => ({ x: i, balance: round2(v), month }));
};

export const buildCategoryPie = (
  txs: Transaction[],
  catById: Map<string, Category>,
  fallback: string,
) => {
  const totals = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== "expense") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([id, value]) => {
      const cat = catById.get(id);
      return {
        label: cat?.name ?? "Other",
        value: round2(value),
        color: cat?.colour ?? fallback,
      };
    })
    .sort((a, b) => b.value - a.value);
};

export const buildCategoryBar = (
  txs: Transaction[],
  catById: Map<string, Category>,
  fallback: string,
) => {
  const totals = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== "expense") continue;
    totals.set(t.category, round2((totals.get(t.category) ?? 0) + t.amount));
  }
  return [...totals.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([id, value]) => {
      const cat = catById.get(id);
      return {
        label: cat?.name ?? "Other",
        value,
        color: cat?.colour ?? fallback,
      };
    });
};

export const buildCashflow = (txs: Transaction[]) => {
  const map = new Map<string, { income: number; expenses: number }>();
  for (const t of txs) {
    const key = monthKey(t.date);
    if (!map.has(key)) map.set(key, { income: 0, expenses: 0 });
    const entry = map.get(key)!;
    if (t.type === "income") entry.income += t.amount;
    else entry.expenses += t.amount;
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, d], i) => ({
      x: i,
      income: round2(d.income),
      expenses: round2(d.expenses),
    }));
};
