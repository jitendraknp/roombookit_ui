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
    DiscountValue?: number
}