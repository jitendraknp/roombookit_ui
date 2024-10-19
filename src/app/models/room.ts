import { Hotel } from "./hotel";

export interface Room {
  Id?: string;
  RoomNo: string;
  Type: string;
  HotelId: string;
  Hotel?: Hotel;
  FloorNo: number;
  IsActive?: boolean;
  Capacity: number;
  RentPerNight: number;
  IsDiscountApplicable: boolean;
  DiscountValue?: number;
  AvailablityStatus?: AvailablityStatus;
  Available?: number;
  Booked?: number;
}
export interface AvailableRoom {
  Id?: string;
  RoomNo: string;
  Type: string;
  FloorNo?: string;
}
export interface AvailablityStatus {
  FromDate?: string;
  ToDate?: string;
  IsAvailable: boolean;
}

