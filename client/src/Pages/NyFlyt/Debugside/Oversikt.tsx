import { VStack } from "@navikt/ds-react";
import {
    useHentSpesifikkSakNyFlyt,
    useHentSisteSakNyFlyt,
    useHentTilstandForVirksomhetNyFlyt,
} from "../../../api/lydia-api/nyFlyt";
import {
    useHentSamarbeid,
    useHentSpørreundersøkelser,
} from "../../../api/lydia-api/spørreundersøkelse";
import { useHentPlan } from "../../../api/lydia-api/plan";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

interface OversiktProps {
    orgnummer: string;
    mutate?: () => void;
}

function SamarbeidDetaljer({
    orgnummer,
    saksnummer,
    samarbeid,
}: {
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
}) {
    const plan = useHentPlan(orgnummer, saksnummer, samarbeid.id);
    const behovsvurderinger = useHentSpørreundersøkelser(
        orgnummer,
        saksnummer,
        samarbeid.id,
        "BEHOVSVURDERING",
    );
    const evalueringer = useHentSpørreundersøkelser(
        orgnummer,
        saksnummer,
        samarbeid.id,
        "EVALUERING",
    );

    return (
        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            <h4>Samarbeid: {samarbeid.navn ?? `ID ${samarbeid.id}`}</h4>
            <pre style={{ backgroundColor: "#e8e8e8", padding: "8px" }}>
                {JSON.stringify(samarbeid, null, 2)}
            </pre>
            {behovsvurderinger.data && behovsvurderinger.data.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                    <h5>Behovsvurderinger ({behovsvurderinger.data.length})</h5>
                    <pre style={{ backgroundColor: "#d8e8d8", padding: "8px" }}>
                        {JSON.stringify(behovsvurderinger.data, null, 2)}
                    </pre>
                </div>
            )}
            {evalueringer.data && evalueringer.data.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                    <h5>Evalueringer ({evalueringer.data.length})</h5>
                    <pre style={{ backgroundColor: "#d8d8e8", padding: "8px" }}>
                        {JSON.stringify(evalueringer.data, null, 2)}
                    </pre>
                </div>
            )}

            {plan.data && (
                <div style={{ marginTop: "10px" }}>
                    <h5>Samarbeidsplan</h5>
                    <pre style={{ backgroundColor: "#e0e0e0", padding: "8px" }}>
                        {JSON.stringify(plan.data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default function Oversikt({ orgnummer }: OversiktProps) {
    const sisteIASak = useHentSisteSakNyFlyt(orgnummer);
    const virksomhetTilstand = useHentTilstandForVirksomhetNyFlyt(orgnummer);
    const samarbeid = useHentSamarbeid(orgnummer, sisteIASak.data?.saksnummer);

    const spesifikkIASak = useHentSpesifikkSakNyFlyt(
        orgnummer,
        sisteIASak.data?.saksnummer,
    );

    return (
        <VStack gap="4">
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

    return () => {
        mutateSak();
        mutateTilstand();
    };
}
