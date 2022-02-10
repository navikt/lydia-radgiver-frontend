export type Filterverdier = {
    fylker: Fylke[];
    kommuner: Kommune[];
}

export type Fylke = {
    navn: string;
    nummer: string;
}


export type Kommune = {
    navn: string;
    nummer: string;
}