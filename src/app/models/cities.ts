import { States } from "./states";

export interface City {
    Id: string;
    Name: string;
    Code: string;
    StateId: string;
    States?: States;
    Is_Active: boolean;
}