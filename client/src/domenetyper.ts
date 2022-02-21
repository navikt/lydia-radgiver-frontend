export type Filterverdier = {
    fylker: FylkerMedKommuner[];
    næringsgrupper: Næringsgruppe[];
}

export interface Søkeverdier {
    kommuner?: Kommune[];
    fylker?: Fylke[];
    næringsgrupper?: Næringsgruppe[];
}

export type Næringsgruppe = {
    navn: string;
    kode: string;
}

export type SykefraversstatistikkVirksomhet = {
    orgnr: string;
    virksomhetsnavn: string;
    sektor: string;
    neringsgruppe: string;
    arstall: number;
    kvartal: number;
    sykefraversprosent: number;
    antallPersoner: number;
    muligeDagsverk: number;
    tapteDagsverk: number;
}

export type Virksomhet = {
    organisasjonsnummer: string;
    navn: string;
    beliggenhetsadresse: Beliggenhetsadresse;
}

export type Beliggenhetsadresse = {
    land: string; 
    landkode: string; 
    postnummer: string; 
    poststed: string; 
    kommune: string; 
    kommunenummer: string;
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