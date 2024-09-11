import { Menu } from "./menu";
import { Roles } from "./role";

export interface MenuUserMapping {
    Id: string;
    MenuId: string;
    Menu: Menu[] | null;
    RoleId: string;
    Roles: Roles[] | null;
}