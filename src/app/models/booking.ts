export interface Booking {
    Id?: string | null;
    GuestsId?: string;
    GuestsStayDetailId?: string | null;
    RoomId?: string;
    NoOfDays?: number;
    Rent?: number;
    CheckInDate?: string;
    CheckOutDate?: string;
    PhoneNo?: string;
    TotalAmount?: number;
    AmountWithGst?: number;
    AmountDue?: number;
    Status?: string;
    InvoiceNo?: string;
    BookingAddress?: BookingAddress;
    Payments?: Payments[];
}
export interface BookingAddress {
    Address?: string;
    Address1?: string;
    PhoneNo?: string;
    CityId?: string | null;
    StateId?: string | null;
    CountryId?: string | null;
}
export interface Payments {
    PaymentId?: string | null;
    BookingId?: string | null;
    AmountPaid?: number;
    PaymentDate?: string;
    PaymentStatus?: string;
    PaymentMethod?: number;
    TransactionNo?: string;
    IsFinalPayment?: boolean;
}
export interface UpdatePhone {
    GuestsId?: string;
    PhoneNo?: string;
}

export interface UpdateAddress {
    GuestsId?: string;
    Address?: string;
    CityId?: string;
}