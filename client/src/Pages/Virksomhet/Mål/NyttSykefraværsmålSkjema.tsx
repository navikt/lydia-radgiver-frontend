import React from "react";
import {
    BodyShort,
    Box,
    Button,
    ErrorMessage,
    Heading,
    VStack,
} from "@navikt/ds-react";
import { Feiloppsummering } from "./Feiloppsummering";
import {
    ledigeTyper,
    Sykefraværsmål,
    Sykefraværsmåltype,
    Sykefraværsmålutkast,
    tilFeillenker,
    validerSykefraværsmål,
} from "./målskjema";
import { SykefraværsmålFelter } from "./SykefraværsmålFelter";

export function NyttSykefraværsmålSkjema({
    opptatte,
    utkast,
    oppdater,
    idPrefiks,
    ulagretFeil,
    onLagre,
}: {
    opptatte: Sykefraværsmåltype[];
    utkast: Sykefraværsmålutkast;
    oppdater: (endring: Partial<Sykefraværsmålutkast>) => void;
    idPrefiks: string;
    ulagretFeil?: string;
    onLagre: (mål: Sykefraværsmål) => void;
}) {
    const overskriftId = `${idPrefiks}-overskrift`;
    const [visFeil, setVisFeil] = React.useState(false);
    const [fokusteller, setFokusteller] = React.useState(0);

    const validering = validerSykefraværsmål(utkast, opptatte);
    const feil = visFeil && !validering.ok ? validering.feil : {};

    if (ledigeTyper(opptatte).length === 0) {
        return (
            <BodyShort role="status">
                Alle tilgjengelige måltyper er lagt til.
            </BodyShort>
        );
    }

    const send = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validering.ok) {
            onLagre(validering.mål);
        } else {
            setVisFeil(true);
            setFokusteller((n) => n + 1);
        }
    };

    return (
        <Box
            background="neutral-soft"
            borderRadius="12"
            padding={{ xs: "space-16", md: "space-24" }}
        >
            <form onSubmit={send} noValidate>
                <VStack gap="space-16">
                    <Heading level="2" size="small" id={overskriftId}>
                        <BodyShort as="span" visuallyHidden>
                            Legg til nytt
                        </BodyShort>
                        Mål for sykefraværet
                    </Heading>
                    <Feiloppsummering
                        feil={tilFeillenker(feil, idPrefiks)}
                        fokusteller={fokusteller}
                        headingTag="h3"
                    />
                    <SykefraværsmålFelter
                        utkast={utkast}
                        oppdater={oppdater}
                        feil={feil}
                        idPrefiks={idPrefiks}
                        opptatte={opptatte}
                    />
                    <div>
                        <Button type="submit" aria-describedby={overskriftId}>
                            Lagre
                        </Button>
                    </div>
                    {ulagretFeil && <ErrorMessage>{ulagretFeil}</ErrorMessage>}
                </VStack>
            </form>
        </Box>
    );
}
