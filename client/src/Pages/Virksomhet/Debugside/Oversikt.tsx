import { VStack } from "@navikt/ds-react";
import { useHentSamarbeid } from "@features/kartlegging/api/spørreundersøkelse";
import {
    useHentHistorikkNyFlyt,
    useHentSisteSakNyFlyt,
    useHentSpesifikkSakNyFlyt,
    useHentTilstandForVirksomhetNyFlyt,
    useHentVirksomhetNyFlyt,
} from "@features/sak/api/nyFlyt";
import { HistorikkVisning } from "./HistorikkVisning";
import { SamarbeidDetaljer } from "./SamarbeidDetaljer";

interface OversiktProps {
    orgnummer: string;
    mutate?: () => void;
}

export default function Oversikt({ orgnummer }: OversiktProps) {
    const virksomhet = useHentVirksomhetNyFlyt(orgnummer);
    const virksomhetTilstand = useHentTilstandForVirksomhetNyFlyt(orgnummer);
    const sisteIASak = useHentSisteSakNyFlyt(orgnummer);
    const spesifikkIASak = useHentSpesifikkSakNyFlyt(
        orgnummer,
        sisteIASak.data?.saksnummer,
    );
    const samarbeid = useHentSamarbeid(orgnummer, sisteIASak.data?.saksnummer);

    return (
        <VStack gap="4">
            <div>
                <h2>Virksomhet</h2>
                {virksomhet.loading && <p>Laster virksomhet...</p>}
                {virksomhet.error && <p>Feil ved henting av virksomhet</p>}
                {virksomhet.data && (
                    <pre
                        style={{ backgroundColor: "#f0f8dd", padding: "10px" }}
                    >
                        {JSON.stringify(virksomhet.data, null, 2)}
                    </pre>
                )}
            </div>

            <div>
                <h2>virksomhetTilstand</h2>
                {virksomhetTilstand.loading && <p>Laster tilstand...</p>}
                {virksomhetTilstand.error && (
                    <p>Feil ved henting av tilstand</p>
                )}
                {virksomhetTilstand.data && (
                    <pre
                        style={{ backgroundColor: "#f0f0f0", padding: "10px" }}
                    >
                        {JSON.stringify(virksomhetTilstand.data, null, 2)}
                    </pre>
                )}
            </div>

            <div>
                <h2>IASak (siste/nyeste sak)</h2>
                <p style={{ fontSize: "12px", color: "#666" }}>
                    Bruker <code>useHentSisteSakNyFlyt</code> → henter kun siste
                    IASak for virksomheten
                </p>
                {sisteIASak.loading && <p>Laster sak...</p>}
                {sisteIASak.error && <p>Feil ved henting av sak</p>}
                {sisteIASak.data && (
                    <pre
                        style={{ backgroundColor: "#f0f0f0", padding: "10px" }}
                    >
                        {JSON.stringify(sisteIASak.data, null, 2)}
                    </pre>
                )}
            </div>

            <div>
                <h2>IASak (basert på saksnummer)</h2>
                <p style={{ fontSize: "12px", color: "#666" }}>
                    Bruker <code>useHentSpesifikkSakNyFlyt</code> → kan hente
                    hvilken som helst sak via saksnummer (også gamle saker)
                </p>
                {spesifikkIASak.loading && <p>Laster sak...</p>}
                {spesifikkIASak.error && <p>Feil ved henting av sak</p>}
                {spesifikkIASak.data && (
                    <pre
                        style={{ backgroundColor: "#f8e8d8", padding: "10px" }}
                    >
                        {JSON.stringify(spesifikkIASak.data, null, 2)}
                    </pre>
                )}
            </div>

            {sisteIASak.data?.saksnummer && (
                <HistorikkVisning orgnummer={orgnummer} />
            )}

            {sisteIASak.data?.saksnummer && (
                <div>
                    <h2>Samarbeid</h2>
                    {samarbeid.loading && <p>Laster samarbeid...</p>}
                    {samarbeid.error && <p>Feil ved henting av samarbeid</p>}
                    {samarbeid.data && samarbeid.data.length > 0
                        ? samarbeid.data.map((s) => (
                              <SamarbeidDetaljer
                                  key={s.id}
                                  orgnummer={orgnummer}
                                  saksnummer={sisteIASak.data!.saksnummer}
                                  samarbeid={s}
                              />
                          ))
                        : samarbeid.data && <p>Ingen samarbeid funnet</p>}
                </div>
            )}
        </VStack>
    );
}

export function useOversiktMutate(orgnummer: string) {
    const { mutate: mutateSak } = useHentSisteSakNyFlyt(orgnummer);
    const { mutate: mutateTilstand } =
        useHentTilstandForVirksomhetNyFlyt(orgnummer);
    const { mutate: mutateVirksomhet } = useHentVirksomhetNyFlyt(orgnummer);
    const { mutate: mutateHistorikk } = useHentHistorikkNyFlyt(orgnummer);

    return () => {
        mutateSak();
        mutateTilstand();
        mutateVirksomhet();
        mutateHistorikk();
    };
}
