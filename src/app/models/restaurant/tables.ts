export interface R_Table {
    Id?: string;
    TableNumber: string;
    Capacity: Number;
    Status: string | 'Available';
    Is_Active: boolean | true;
}