export interface PaymentDetail {
  Id?: string;
  GuestId?: string;
  PaymentMode: string;
  TransactionNo: string;
  GSTPercentage: number;
  AmountToPay: number;
  TotalDays?: number;
  AmountPaid: number;
  BalanceAmount: number;
  IncGST: number;
  ExcGST: number;
  Discount: number;
}
