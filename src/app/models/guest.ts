import { City } from "./cities";
import { Country } from "./countries";
import { GuestBaseEntity } from "./guest-base";
import { GuestStayDetail } from "./guest_stay_detail";
import { IdentificationDetail } from "./identification-detail";
import { PaymentDetail } from "./payment-detail";
import { States } from "./states";

export interface Guest extends GuestBaseEntity {

  FirstName: string;
  LastName: string;
  Gender: string;
  Address: string;
  EmailId?: string;
  MobileNo: string;
  Is_Active: boolean;
  CityId: string;
  City?: City;
  StateId: string;
  State?: States;
  CountryId: string;
  Country?: Country;
  PinCode: string;
  FormatCreatedDate?: string;
  CreatedBy?: string;
  QRString?: string;
  IdentificationDetail?: IdentificationDetail[] | null;
  PaymentDetail?: PaymentDetail | null;
  GuestsStayDetail?: GuestStayDetail[];
  Invoice?: GeneratedInvoice[];
}

export interface GeneratedInvoice {
  Id?: string;
  GuestsId?: string;
  InvoiceNumber?: string;
  Status?: string;
}
export interface DashboardGuestDetails {
  Id?: string;
  FullName?: string;
  Email?: string;
  Avatar?: string;
  CheckInDate?: string;
  CheckInTime?: string;
  CheckOutDate?: string;
  CheckOutTime?: string;
}
export interface ExistingGuestDetails {
  GuestId: string;
  InvoiceNo: string;
  GuestAddresses?: GuestAddress;
  RoomDetails?: RoomDetails[];
}
export interface GuestAddress {
  GuestId: string;
  Id?: string;
  Address?: string;
  PhoneNo?: string;
  CityId?: string;
  CityName?: string;
  CompantAddress?: string;
}
export interface RoomDetails {
  RoomId: string;
  RoomNo?: string;
  Rent?: number;

}