import { Team } from "./team";

export interface Player {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    active: boolean;
    team: Team;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}
