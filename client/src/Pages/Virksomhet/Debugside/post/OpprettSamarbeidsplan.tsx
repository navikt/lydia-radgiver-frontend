import { useState } from "react";
import { isoDato } from "@/util/dato";
import { useHentSamarbeid } from "@features/kartlegging/api/spørreundersøkelse";
import { useHentPlanMal } from "@features/plan/api/plan";
import {
    opprettSamarbeidsplanNyFlyt,
    useHentSisteSakNyFlyt,
} from "@features/sak/api/nyFlyt";
import { EndpointSection, PostProps } from "./EndpointSection";

export function OpprettSamarbeidsplan({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSisteSakNyFlyt(orgnummer);
    const { data: samarbeidListe } = useHentSamarbeid(
        orgnummer,
        iaSak?.saksnummer,
    );
    const [samarbeidId, setSamarbeidId] = useState("");
    const { data: planMal, loading: lasterPlanMal } = useHentPlanMal();
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        if (!iaSak) {
            setError("IA-Sak er ikke lastet ennå");
            return;
        }

        if (!planMal) {
            setError("Planmal er ikke lastet ennå");
            return;
        }

        const iDag = new Date();
        const enMånedFrem = new Date(iDag);
        enMånedFrem.setMonth(enMånedFrem.getMonth() + 1);

        const nyPlan = {
            ...planMal,
            tema: planMal.tema.map((tema, temaIndex) =>
                temaIndex === 0
                    ? {
                          ...tema,
                          inkludert: true,
                          innhold: tema.innhold.map((innhold, innholdIndex) =>
                              innholdIndex === 0
                                  ? {
                                        ...innhold,
                                        inkludert: true,
                                        startDato: isoDato(
                                            iDag,
                                        ) as unknown as Date,
                                        sluttDato: isoDato(
                                            enMånedFrem,
                                        ) as unknown as Date,
                                    }
                                  : innhold,
                          ),
                      }
                    : tema,
            ),
        };

        try {
            const result = await opprettSamarbeidsplanNyFlyt(
                orgnummer,
                iaSak.saksnummer,
                Number(samarbeidId),
                nyPlan,
            );
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: opprettSamarbeidsplanNyFlyt"
            response={response}
            error={error}
        >
            <div>
                <span>samarbeidId: </span>
                <select
                    value={samarbeidId}
                    onChange={(e) => setSamarbeidId(e.target.value)}
                >
                    <option value="">Velg samarbeid</option>
                    {samarbeidListe?.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.id} - {s.navn || "(uten navn)"} ({s.status})
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleSubmit}
                disabled={!samarbeidId || lasterPlanMal || !planMal}
            >
                Opprett samarbeidsplan
            </button>
            {!planMal && !lasterPlanMal && (
                <div style={{ color: "red" }}>Kunne ikke hente planmal</div>
            )}
        </EndpointSection>
    );
}
