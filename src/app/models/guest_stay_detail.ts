export interface GuestStayDetail {
  Id?: string;
  GuestId: string;
  CheckInDate: string;
  CheckOutDate: string;
  RoomTypeId?: number;
  RoomNoId: string;
  NoOfGuests: number;
  NoOfAdults: number;
  NoOfChildren: number;
  RatePerNight: number;
  TotalAmount: number;
  Discount: number;
  NoOfDays: number;
}
