export type Filterverdier = {
    fylker: FylkerMedKommuner[];
}

export type Fylke = {
    navn: string;
    nummer: string;
}


export type Kommune = {
    navn: string;
    nummer: string;
}

export type FylkerMedKommuner = {
    fylke : Fylke;
    kommuner: Kommune[];   
}