import { Country } from "./countries";

export interface States {
    Id?: string;
    Name: string | undefined;
    Code: string;
    Is_Active: boolean;
    CountryId?: string;
    Country?: Country
}