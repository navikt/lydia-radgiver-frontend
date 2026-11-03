import React from "react";
import {
    BodyShort,
    Box,
    Button,
    Heading,
    HStack,
    VStack,
} from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import { Feiloppsummering } from "./Feiloppsummering";
import {
    ledigeTyper,
    lagIdPrefiks,
    SYKEFRAVÆRSMÅLTYPE_NAVN,
    opptatteTyper,
    Sykefraværsmålutkast,
    tilFeillenker,
    tomtUtkast,
    validerSykefraværsmål,
} from "./målskjema";
import { SykefraværsmålFelter } from "./SykefraværsmålFelter";

export function NyttSykefraværsmålSkjema({
    alleUtkast,
    redigerer,
    onLagre,
    onSlett,
    onAvbrytRedigering,
    førsteFeltRef,
    fokuserVedVisning = false,
}: {
    alleUtkast: Sykefraværsmålutkast[];
    redigerer?: Sykefraværsmålutkast;
    onLagre: (utkast: Sykefraværsmålutkast) => void;
    onSlett?: (id: string) => void;
    onAvbrytRedigering?: () => void;
    førsteFeltRef?: React.RefObject<HTMLSelectElement | null>;
    fokuserVedVisning?: boolean;
}) {
    const idPrefiks = lagIdPrefiks(React.useId());
    const overskriftId = `${idPrefiks}-overskrift`;
    const [utkast, setUtkast] = React.useState<Sykefraværsmålutkast>(
        () => redigerer ?? tomtUtkast(),
    );
    const [visFeil, setVisFeil] = React.useState(false);
    const [fokusteller, setFokusteller] = React.useState(0);

    React.useEffect(() => {
        if (fokuserVedVisning) førsteFeltRef?.current?.focus();
    }, [fokuserVedVisning, førsteFeltRef]);

    const opptatte = opptatteTyper(alleUtkast, utkast.id);
    const validering = validerSykefraværsmål(utkast, opptatte);
    const feil = visFeil && !validering.ok ? validering.feil : {};

    if (!redigerer && ledigeTyper(opptatte).length === 0) {
        return (
            <BodyShort role="status">
                Alle tilgjengelige måltyper er lagt til.
            </BodyShort>
        );
    }

    const oppdater = (endring: Partial<Sykefraværsmålutkast>) =>
        setUtkast((forrige) => ({ ...forrige, ...endring }));

    const send = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validering.ok) {
            onLagre(utkast);
        } else {
            setVisFeil(true);
            setFokusteller((n) => n + 1);
        }
    };

    const overskrift = redigerer
        ? `Endre ${redigerer.type ? SYKEFRAVÆRSMÅLTYPE_NAVN[redigerer.type].toLowerCase() : "sykefraværsmål"}`
        : "Legg til sykefraværsmål";

    return (
        <Box
            as="section"
            aria-labelledby={overskriftId}
            background="neutral-soft"
            borderRadius="12"
            padding={{ xs: "space-16", md: "space-24" }}
        >
            <form onSubmit={send} noValidate>
                <VStack gap="space-16">
                    <Heading level="3" size="small" id={overskriftId}>
                        {overskrift}
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
                        førsteFeltRef={førsteFeltRef}
                    />
                    <HStack gap="space-8" wrap>
                        <Button type="submit" aria-describedby={overskriftId}>
                            {redigerer ? "Lagre endringer" : "Legg til mål"}
                        </Button>
                        {redigerer && onSlett && (
                            <Button
                                type="button"
                                variant="secondary"
                                data-color="danger"
                                icon={<TrashIcon aria-hidden />}
                                onClick={() => onSlett(redigerer.id)}
                            >
                                Slett sykefraværsmål
                            </Button>
                        )}
                        {redigerer && onAvbrytRedigering && (
                            <Button
                                type="button"
                                variant="tertiary"
                                onClick={onAvbrytRedigering}
                            >
                                Avbryt endring
                            </Button>
                        )}
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
}
