import React from "react";
import {
    Box,
    Button,
    Heading,
    LocalAlert,
    Textarea,
    VStack,
} from "@navikt/ds-react";
import {
    PersonopplysningssjekkResultat,
    sjekkPersonopplysninger,
} from "../../../api/lydia-api/personopplysningssjekk";

export const MAKS_ANTALL_TEGN_I_MÅL = 250;

export default function NySamarbeidsplan() {
    const [mål, setMål] = React.useState("");
    const [resultat, setResultat] =
        React.useState<PersonopplysningssjekkResultat | null>(null);
    const [sjekker, setSjekker] = React.useState(false);

    const oppdaterMål = (nyttMål: string) => {
        setMål(nyttMål);
        setResultat(null);
    };

    const lagreMål = () => {
        setSjekker(true);
        sjekkPersonopplysninger(mål)
            .then(setResultat)
            .catch(() => setResultat(null))
            .finally(() => setSjekker(false));
    };

    return (
        <Box paddingBlock="space-24">
            <Box
                background="default"
                borderRadius="12"
                borderColor="neutral-subtle"
                borderWidth="1"
                padding="space-24"
            >
                <VStack gap="space-16">
                    <Heading level="3" size="medium">
                        Mål for samarbeidet
                    </Heading>
                    <Box
                        padding="space-16"
                        borderRadius="12"
                        background="accent-soft"
                    >
                        <Textarea
                            label="Mål"
                            description="Husk ingen personopplysninger"
                            placeholder="Skriv inn et mål."
                            maxLength={MAKS_ANTALL_TEGN_I_MÅL}
                            value={mål}
                            onChange={(e) => oppdaterMål(e.target.value)}
                        />
                    </Box>
                    <div>
                        <Button
                            onClick={lagreMål}
                            loading={sjekker}
                            disabled={
                                mål.trim().length === 0 ||
                                mål.length > MAKS_ANTALL_TEGN_I_MÅL
                            }
                        >
                            Lagre mål
                        </Button>
                    </div>
                    {resultat && <Sjekkresultat resultat={resultat} />}
                </VStack>
            </Box>
        </Box>
    );
}

function Sjekkresultat({
    resultat,
}: {
    resultat: PersonopplysningssjekkResultat;
}) {
    const funn = beskrivFunn(resultat);

    if (funn === null) {
        return (
            <LocalAlert status="success" role="status">
                <LocalAlert.Header>
                    <LocalAlert.Title as="h4">
                        Fant ingen personopplysninger
                    </LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    Sjekken kan ta feil. Du er ansvarlig for teksten.
                </LocalAlert.Content>
            </LocalAlert>
        );
    }

    return (
        <LocalAlert status="warning">
            <LocalAlert.Header>
                <LocalAlert.Title as="h4">
                    Teksten kan inneholde personopplysninger
                </LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
                {funn} Fjern eller skriv om opplysningene før du lagrer.
            </LocalAlert.Content>
        </LocalAlert>
    );
}

function beskrivFunn({
    kanInneholdePersonopplysninger,
    inneholderTall,
    inneholderEpost,
    kiFlagget,
}: PersonopplysningssjekkResultat): string | null {
    if (!kanInneholdePersonopplysninger) return null;

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
