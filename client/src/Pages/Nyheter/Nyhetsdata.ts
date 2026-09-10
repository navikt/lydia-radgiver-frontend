import { erIDev } from "../../components/Dekoratør/Dekoratør";

export type NyheterInnhold = {
    tittel: string;
    ingress: string;
    shortIngress?: string; //Hvis denne finnes er det den som vises i menyen, ellers vises ingress
    id: number;
    dato: Date;
    skjulEtter?: Date; //Nyheten vises ikke etter denne datoen
    bareIDev?: boolean; //Hvis denne er true vises nyheten kun i dev, ellers vises den i prod også
};

export const UFILTRERT_NYHETSLISTE: NyheterInnhold[] = [
    {
        id: 1,
        tittel: "Ny funksjonalitet!",
        ingress:
            "Vi har lansert en ny funksjon som gjør det enklere å administrere virksomheter.",
        dato: new Date("2026-06-01"),
        bareIDev: true,
    },
    {
        id: 2,
        tittel: "En eller annen funksjonalitet til",
        ingress:
            "Kanskje denne funksjonaliteten har litt ekstra greier i seg.\nSå den trenger noen flere linjer tekst for å se hvordan det ser ut.",
        dato: new Date("2026-06-04"),
        bareIDev: true,
    },
    {
        id: 3,
        tittel: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        shortIngress:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        ingress:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        dato: new Date("2026-08-10"),
        bareIDev: true,
    },
];

export const FILTRERT_SORTERT_NYHETSLISTE = UFILTRERT_NYHETSLISTE.filter(
    (nyhet) => erIDev || !nyhet.bareIDev,
).sort((a, b) => b.dato.getTime() - a.dato.getTime());
