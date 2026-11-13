import React from "react";
import {
    BodyShort,
    Box,
    Button,
    Heading,
    HStack,
    Textarea,
    VStack,
} from "@navikt/ds-react";
import {
    lagreLikevelId,
    MAKS_ANTALL_TEGN_I_MÅL,
    Sjekk,
} from "./målskjema";
import {
    Personopplysningsadvarsel,
    Sjekkfeil,
} from "./Personopplysningsadvarsel";

export function NyttSamarbeidsmålSkjema({
    feltId,
    tekstfeltRef,
    tekst,
    feil,
    sjekk,
    onEndre,
    onLagre,
    onLagreLikevel,
}: {
    feltId: string;
    tekstfeltRef: React.Ref<HTMLTextAreaElement>;
    tekst: string;
    feil?: string;
    sjekk?: Sjekk;
    onEndre: (tekst: string) => void;
    onLagre: () => void;
    onLagreLikevel: () => void;
}) {
    const overskriftId = `${feltId}-overskrift`;
    const sjekker = sjekk?.status === "sjekker";
    return (
        <Box
            background="neutral-soft"
            borderRadius="12"
            padding={{ xs: "space-16", md: "space-24" }}
        >
            <VStack gap="space-16">
                <Heading level="2" size="small" id={overskriftId}>
                    <BodyShort as="span" visuallyHidden>
                        Legg til nytt
                    </BodyShort>
                    Mål for samarbeidet
                </Heading>
                <Textarea
                    ref={tekstfeltRef}
                    id={feltId}
                    label="Legg til mål"
                    description="Husk ingen personopplysninger."
                    maxLength={MAKS_ANTALL_TEGN_I_MÅL}
                    value={tekst}
                    error={feil}
                    readOnly={sjekker}
                    onChange={(e) => onEndre(e.target.value)}
                />
                {sjekk?.status === "funn" && (
                    <Personopplysningsadvarsel resultat={sjekk.resultat} />
                )}
                {sjekk?.status === "feilet" && <Sjekkfeil />}
                <HStack gap="space-8" wrap>
                    {sjekk?.status !== "funn" && (
                        <Button
                            type="button"
                            onClick={onLagre}
                            loading={sjekker}
                            aria-describedby={overskriftId}
                        >
                            Lagre
                        </Button>
                    )}
                    {(sjekk?.status === "funn" ||
                        sjekk?.status === "feilet") && (
                        <Button
                            id={lagreLikevelId(feltId)}
                            type="button"
                            variant={
                                sjekk.status === "funn"
                                    ? "primary"
                                    : "secondary"
                            }
                            onClick={onLagreLikevel}
                            aria-describedby={overskriftId}
                        >
                            Lagre likevel
                        </Button>
                    )}
                </HStack>
            </VStack>
        </Box>
    );
}
