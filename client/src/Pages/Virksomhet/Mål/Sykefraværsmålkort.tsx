import { Button, ErrorMessage, Heading, HStack } from "@navikt/ds-react";
import {
    redigerKnappId,
    Sykefraværsmål,
    Sykefraværsmåltype,
    Sykefraværsmålutkast,
    Valideringsfeil,
} from "./målskjema";
import { Målkortknapper, Målkortramme } from "./Målkort";
import { SykefraværsmålFelter } from "./SykefraværsmålFelter";
import {
    Målverdier,
    SykefraværsmåltypeOverskrift,
} from "./Sykefraværsmålvisning";

export function Sykefraværsmålkort({
    idPrefiks,
    mål,
    onRediger,
    onSlett,
    redigering,
}: {
    idPrefiks: string;
    mål: Sykefraværsmål;
    onRediger: () => void;
    onSlett: () => void;
    redigering?: {
        utkast: Sykefraværsmålutkast;
        opptatte: Sykefraværsmåltype[];
        feil: Valideringsfeil;
        ulagretFeil?: string;
        oppdater: (endring: Partial<Sykefraværsmålutkast>) => void;
        onLagre: () => void;
        onAvbryt: () => void;
    };
}) {
    const overskriftId = `${idPrefiks}-overskrift`;
    const type = redigering ? redigering.utkast.type : mål.type;
    return (
        <Målkortramme>
            {type ? (
                <SykefraværsmåltypeOverskrift type={type} id={overskriftId} />
            ) : (
                <Heading level="4" size="small" id={overskriftId}>
                    Sykefraværsmål
                </Heading>
            )}
            {redigering ? (
                <>
                    <SykefraværsmålFelter
                        utkast={redigering.utkast}
                        oppdater={redigering.oppdater}
                        feil={redigering.feil}
                        idPrefiks={idPrefiks}
                        opptatte={redigering.opptatte}
                        kompakt
                        visType={false}
                    />
                    <HStack gap="space-8" wrap>
                        <Button
                            type="button"
                            size="small"
                            aria-describedby={overskriftId}
                            onClick={redigering.onLagre}
                        >
                            Lagre
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="small"
                            aria-describedby={overskriftId}
                            onClick={redigering.onAvbryt}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                    {redigering.ulagretFeil && (
                        <ErrorMessage>{redigering.ulagretFeil}</ErrorMessage>
                    )}
                </>
            ) : (
                <>
                    <Målverdier mål={mål} />
                    <Målkortknapper
                        redigerId={redigerKnappId(idPrefiks)}
                        beskrevetAv={overskriftId}
                        onRediger={onRediger}
                        onSlett={onSlett}
                    />
                </>
            )}
        </Målkortramme>
    );
}
