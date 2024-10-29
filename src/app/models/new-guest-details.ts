import { GuestStayDetail } from "./guest_stay_detail";
import { GuestSiblingDetails } from "./sibling-details";

export interface NewGuestDetails {
  Id?: string;
  GuestId?: string;
  FirstName: string;
  LastName: string;
  MobileNo: string;
  EmailId: string;
  Gender: string;
  Address: string;
  PinCode?: string;
  HotelId: string;
  CityId: string;
  StateId: string;
  CountryId: string;
  CheckInDate: string;
  CheckOutDate: string;
  RoomNoId?: string[];
  RoomId?: [];
  NoOfGuests: number;
  NoOfAdults: number;
  NoOfChildren: number;
  RatePerNight: number;
  Discount: number;
  NoOfDays: number;
  AmountToPay: number;
  GSTPercentage: number;
  IncGST: number;
  PaymentMode: string;
  Company?: string;
  GSTIN?: string;
  CompanyAddress?: string;
  Comments?: string;
  Print_CD?: boolean;
  Print_Comments?: boolean;
  ExcGST: number;
  AmountPaid: number;
  BalanceAmount: number;
  TransactionNo?: string;
  IdType?: string;
  IdNumber?: string;
  ImageUrl?: string;
  IsFrontSide: boolean;
  GuestSiblingDetail?: GuestSiblingDetails[];
  GuestStayDetail?: GuestStayDetail[];
  GuestStayDetailId?: string;
  PaymentDetailsId?: string;
  InvoiceNo?: string;
  ManualInvoice?: boolean;
}

export interface GuestDetails {
  Id?: string;
  Company?: string;
  CompanyAddress?: string;
  GsTin?: string;
  PinCode?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Gender?: string;
  MobileNo?: string;
  Address?: string;
  CityId?: string;
  InvoiceNo?: string;
  IsManualInv?: boolean;
  Print_CD?: boolean;
  Comment?: string;
  PrintComment?: boolean;
}
export interface BookingDetails {
  Id?: string;
  GuestId?: string;
  CheckInDate?: string;
  CheckOutDate?: string;
  Rooms?: SelectedRooms[];
  RatePerNight?: number;
  TotalDays?: number;
  TotalAmount?: number;
  Discount?: number;
  NoOfDays?: number;
  NoOfAdults?: number;
  NoOfChild?: number;
  NoOfGuests?: number;
  AmountIncludingGst?: number;
  AmountPaid?: number;
  Balance?: number;
  PaymentMode?: string;
  TransactionNo?: string;
  CGST?: number;
  SGST?: number;
  UTGST?: number;
  IGST?: number;
  InvoiceNo?: string;
  GuestStayDetailId?: string;
  PaymentDetailsId?: string;
}

export interface SelectedRooms {
  Id?: string,
  RoomId?: string;
}
export interface SelectedRoomsDetail {
  Id?: string,
  RoomNo?: string;
  Floor?: number;
  TotalDays?: number;
  TotalAmount?: number;
  Rent?: number;
}

export interface AdvanceBooking {
  Id?: string,
  GuestsId?: string,
  FirstName?: string,
  LastName?: string,
  PhoneNo?: string,
  Email?: string,
  Address?: string,
  CheckInDate?: string,
  CheckOutDate?: string,
  BookingDate?: string,
  BookingAmount?: number,
  Status?: string,
  NoOfGuests?: number,
  RoomCategoryId?: RoomCategory[];
}
export interface RoomCategory {
  Id?: number;
  NoOfRooms?: number,
  Status?: string;
}