export interface IATjeneste {
    id: number,
    navn: string,
}

export interface IATjenesteModul {
    id: number,
    iaTjeneste: number,
    navn: string,
}


export interface NyIASakLeveranseDTO {
    saksnummer: string;
    modulId: number;
    frist: Date;
}
