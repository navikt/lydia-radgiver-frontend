import {
    useHentSakNyFlyt,
    useHentTilstandForVirksomhetNyFlyt,
} from "../../api/lydia-api/nyFlyt";
import {
    useHentSamarbeid,
    useHentSpørreundersøkelser,
} from "../../api/lydia-api/spørreundersøkelse";
import { useHentPlan } from "../../api/lydia-api/plan";
import { VStack } from "@navikt/ds-react";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";

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
    const IASak = useHentSakNyFlyt(orgnummer);
    const virksomhetTilstand = useHentTilstandForVirksomhetNyFlyt(orgnummer);
    const samarbeid = useHentSamarbeid(orgnummer, IASak.data?.saksnummer);

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
                <h2>IASak</h2>
                {IASak.loading && <p>Laster sak...</p>}
                {IASak.error && <p>Feil ved henting av sak</p>}
                {IASak.data && (
                    <pre
                        style={{ backgroundColor: "#f0f0f0", padding: "10px" }}
                    >
                        {JSON.stringify(IASak.data, null, 2)}
                    </pre>
                )}
            </div>

            {IASak.data?.saksnummer && (
                <div>
                    <h2>Samarbeid</h2>
                    {samarbeid.loading && <p>Laster samarbeid...</p>}
                    {samarbeid.error && <p>Feil ved henting av samarbeid</p>}
                    {samarbeid.data && samarbeid.data.length > 0
                        ? samarbeid.data.map((s) => (
                              <SamarbeidDetaljer
                                  key={s.id}
                                  orgnummer={orgnummer}
                                  saksnummer={IASak.data!.saksnummer}
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
    const { mutate: mutateSak } = useHentSakNyFlyt(orgnummer);
    const { mutate: mutateTilstand } =
        useHentTilstandForVirksomhetNyFlyt(orgnummer);

    return () => {
        mutateSak();
        mutateTilstand();
    };
}
