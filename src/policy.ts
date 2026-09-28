export const REFUND_WINDOW_DAYS = 15;

function toUtcMidnight(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function parseDateOnly(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export type RefundEvaluation = {
  daysSinceOrder: number;
  refundable: boolean;
  reason: string;
};

/**
 * Pure, deterministic policy check: an order is refundable only if fewer
 * than REFUND_WINDOW_DAYS days have elapsed since it was placed. Kept
 * separate from any LLM reasoning so the refund decision is never subject
 * to model hallucination on date arithmetic.
 */
export function evaluateRefund(orderedDate: string, now: Date = new Date()): RefundEvaluation {
  const orderedAtUtc = parseDateOnly(orderedDate);
  const todayUtc = toUtcMidnight(now);
  const daysSinceOrder = Math.round((todayUtc - orderedAtUtc) / (1000 * 60 * 60 * 24));
  const refundable = daysSinceOrder < REFUND_WINDOW_DAYS;

  const reason = refundable
    ? `Order was placed ${daysSinceOrder} day(s) ago, which is within the ${REFUND_WINDOW_DAYS}-day refund window.`
    : `Order was placed ${daysSinceOrder} day(s) ago, which exceeds the ${REFUND_WINDOW_DAYS}-day refund window.`;

  return { daysSinceOrder, refundable, reason };
}
