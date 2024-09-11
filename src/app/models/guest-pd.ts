import { GuestSiblingDetails } from "./sibling-details";

export interface GuestPersonalDetail {
  Id?: string;
  FirstName?: string;
  LastName?: string;
  Gender?: string;
  Email?: string;
  MobileNo?: string;
  IsPrimaryGuest?: boolean;
  Address?: string;
  CityId?: string;
  StateId?: string;
  CountryId?: string;
  Pincode?: string;
  GuestSiblingDetails?: GuestSiblingDetails[];
}
