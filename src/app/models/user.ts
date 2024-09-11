import { City } from "./cities";
import { Country } from "./countries";
import { Hotel } from "./hotel";
import { Roles } from "./role";
import { States } from "./states";

export interface User {
    Id?: string;
    FirstName?: string;
    LastName?: string;
    Address?: string;
    Cities?: City;
    CityId?: string;
    States?: States;
    StateId?: string;
    Countries?: Country;
    CountryId: string;
    PinCode?: string;
    Email?: string;
    MobileNo?: string;
    UserName?: string;
    Password?: string;
    Gender?: string;
    Roles?: string;
    RoleId?: string;
    EmpCode?: string;
    Hotes?: Hotel;
    ApplicationRole?: Roles;
}