import { useHentSpørreundersøkelser } from "@features/kartlegging/api/spørreundersøkelse";
import { useHentPlan } from "@features/plan/api/plan";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";

export function SamarbeidDetaljer({
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
