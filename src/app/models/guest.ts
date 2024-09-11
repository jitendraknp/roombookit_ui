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
    EmailId: string;
    MobileNo: string;
    Is_Active: boolean;
    CityId: string;
    City?: City;
    StateId: string;
    State?: States;
    CoutntryId: string;
    Coutntry?: Country;
    PinCode: string;
    IdentificationDetail?: IdentificationDetail[] | null;
    PaymentDetail?: PaymentDetail[] | null;
}