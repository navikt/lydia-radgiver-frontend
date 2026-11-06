import { LocalAlert } from "@navikt/ds-react";
import { PersonopplysningssjekkResultat } from "../../../api/lydia-api/personopplysningssjekk";

export function Personopplysningsadvarsel({
    resultat,
}: {
    resultat: PersonopplysningssjekkResultat;
}) {
    return (
        <LocalAlert status="warning">
            <LocalAlert.Header>
                <LocalAlert.Title as="h3">
                    Teksten kan inneholde personopplysninger
                </LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
                {beskrivFunn(resultat)} Fjern eller skriv om opplysningene,
                eller lagre likevel hvis du er sikker på at teksten er i orden.
            </LocalAlert.Content>
        </LocalAlert>
    );
}

export function beskrivFunn({
    inneholderTall,
    inneholderEpost,
    kiFlagget,
}: PersonopplysningssjekkResultat): string {
    const beskrivelser: string[] = [];
    if (kiFlagget) {
        beskrivelser.push(
            "Teksten kan gjøre en person gjenkjennelig eller inneholde sensitive opplysninger.",
        );
    }
    const regexFunn = beskrivRegexFunn(inneholderTall, inneholderEpost);
    if (regexFunn) {
        beskrivelser.push(
            `Teksten inneholder ${regexFunn} som kan være personopplysninger.`,
        );
    }

    // Backend eier regelen: flagger den av en grunn vi ikke kjenner, viser vi likevel advarsel
    return beskrivelser.length > 0
        ? beskrivelser.join(" ")
        : "Sjekken fant mulige personopplysninger i teksten.";
}

function beskrivRegexFunn(
    inneholderTall: boolean,
    inneholderEpost: boolean,
): string | null {
    if (inneholderTall && inneholderEpost) return "tall og e-post";
    if (inneholderTall) return "tall";
    if (inneholderEpost) return "e-post";
    return null;
}
