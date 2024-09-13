import { GuestSiblingDetails } from "./sibling-details";

export interface NewGuestDetails {
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
  RoomNoId: string;
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
  ExcGST: number;
  AmountPaid: number;
  BalanceAmount: number;
  TransactionNo?: string;
  IdType?: string;
  IdNumber?: string;
  ImageUrl?: string;
  IsFrontSide: boolean;
  GuestSiblingDetail?: GuestSiblingDetails[];
}
