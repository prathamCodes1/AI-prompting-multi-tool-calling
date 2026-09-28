export type Customer = {
  id: number;
  email: string;
  name: string;
};

export type Order = {
  id: number;
  name: string;
  customerId: number;
  status: string;
  orderedDate: string; // YYYY-MM-DD
};
