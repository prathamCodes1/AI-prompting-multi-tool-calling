import type { Customer, Order } from "./types.js";

export const orders: Order[] = [
  {
    id: 1,
    name: "Order 1",
    customerId: 101,
    status: "shipped",
    orderedDate: "2026-09-01",
  },
  {
    id: 2,
    name: "Order 2",
    customerId: 102,
    status: "shipped",
    orderedDate: "2026-07-01",
  },
];

export const customers: Customer[] = [
  {
    id: 101,
    email: "pratham1pancholi@gmail.com",
    name: "Pratham Pancholi",
  },
  {
    id: 102,
    email: "john.doe@example.com",
    name: "John Doe",
  },
];
