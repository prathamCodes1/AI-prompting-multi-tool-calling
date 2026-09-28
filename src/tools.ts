import { tool } from "ai";
import { z } from "zod";
import { customers, orders } from "./data.js";
import { evaluateRefund } from "./policy.js";

export type LookupCustomerResult = { found: false } | { found: true; customerId: number; name: string };

export type RefundDecisionResult =
  | { hasOrders: false }
  | {
      hasOrders: true;
      orderName: string;
      daysSinceOrder: number;
      refundable: boolean;
      reason: string;
    };

export const lookupCustomerByEmail = tool({
  description:
    "Look up a customer by their email address. Always call this first, using the exact email the customer provided.",
  inputSchema: z.object({
    email: z.string().describe("The customer's email address, exactly as given by the user."),
  }),
  execute: async ({ email }): Promise<LookupCustomerResult> => {
    const normalized = email.trim().toLowerCase();
    const customer = customers.find((c) => c.email.toLowerCase() === normalized);

    if (!customer) {
      return { found: false };
    }

    return {
      found: true,
      customerId: customer.id,
      name: customer.name,
    };
  },
});

export const getRefundDecisionForCustomer = tool({
  description:
    "Given a customerId (from lookupCustomerByEmail), finds that customer's most recent order and returns a precomputed refund decision. Never guess customerId; only use the value returned by lookupCustomerByEmail. Do not recompute the decision yourself — relay refundable and reason exactly as returned.",
  inputSchema: z.object({
    customerId: z.number().describe("The customerId returned by lookupCustomerByEmail."),
  }),
  execute: async ({ customerId }): Promise<RefundDecisionResult> => {
    const customerOrders = orders.filter((o) => o.customerId === customerId);

    if (customerOrders.length === 0) {
      return { hasOrders: false };
    }

    const mostRecentOrder = customerOrders.reduce((latest, current) =>
      current.orderedDate > latest.orderedDate ? current : latest,
    );

    const { daysSinceOrder, refundable, reason } = evaluateRefund(mostRecentOrder.orderedDate);

    return {
      hasOrders: true,
      orderName: mostRecentOrder.name,
      daysSinceOrder,
      refundable,
      reason,
    };
  },
});

export const refundTools = {
  lookupCustomerByEmail,
  getRefundDecisionForCustomer,
};
