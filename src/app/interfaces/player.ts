import { Team } from "./team";

export interface Player {
    STATUS: string,
    ID_JUCATOR: number,
    ID_ECHIPA: number,
    NUME: string,
    PRENUME: string,
    DATA_NASTERE: string,
    UTILIZATOR_CREARE: number,
    DATA_MODIFICARE: Date,
    UTILIZATOR_MODIFICARE: number,
    ECHIPA: Team
}
