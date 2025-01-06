interface Model {
  transaction_id: string;
  credit_id: string;
  monthlyAmount: number;
  totalAmount: number;
  nextBillingDate: Date;
  lastBillingDate?: Date;
  isActive: boolean;
}

export { Model };
