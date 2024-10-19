import { GeneratedInvoice } from "./guest";

export interface GuestStayDetail {
  Id?: string;
  GuestsId: string;
  CheckInDate?: string;
  CheckOutDate: string;
  RoomTypeId?: number;
  RoomNoId: string[];
  NoOfGuests: number;
  NoOfAdults: number;
  NoOfChildren: number;
  RatePerNight: number;
  TotalAmount: number;
  Discount: number;
  NoOfDays: number;
  Invoice?: GeneratedInvoice;
  InvoiceNo?: string;
}
