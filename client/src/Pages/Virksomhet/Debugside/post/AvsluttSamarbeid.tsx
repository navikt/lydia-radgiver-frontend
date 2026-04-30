import { useState } from "react";
import { useHentSamarbeid } from "@features/kartlegging/api/spørreundersøkelse";
import {
    avsluttSamarbeidNyFlyt,
    useHentSisteSakNyFlyt,
} from "@features/sak/api/nyFlyt";
import { SamarbeidRequest } from "@features/sak/types/iaSakProsess";
import { EndpointSection, PostProps } from "./EndpointSection";

export function AvsluttSamarbeid({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSisteSakNyFlyt(orgnummer);
    const { data: samarbeidListe } = useHentSamarbeid(
        orgnummer,
        iaSak?.saksnummer,
    );
    const [samarbeidId, setSamarbeidId] = useState("");
    const [status, setStatus] = useState<"FULLFØRT" | "AVBRUTT">("FULLFØRT");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const selectedSamarbeid = samarbeidListe?.find(
        (s) => s.id === parseInt(samarbeidId),
    );

    const handleSubmit = async () => {
        setError(null);
        if (!selectedSamarbeid) {
            setError("Samarbeid ikke funnet");
            return;
        }
        try {
            const samarbeid: SamarbeidRequest = {
                id: selectedSamarbeid.id,
                navn: selectedSamarbeid.navn,
                status: status,
                startDato: null,
                sluttDato: null,
                endretTidspunkt: null,
            };
            const result = await avsluttSamarbeidNyFlyt(
                orgnummer,
                Number(samarbeidId),
                samarbeid,
            );
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: avsluttSamarbeidNyFlyt"
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
            <div>
                <span>status: </span>
                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value as "FULLFØRT" | "AVBRUTT")
                    }
                >
                    <option value="FULLFØRT">FULLFØRT</option>
                    <option value="AVBRUTT">AVBRUTT</option>
                </select>
            </div>
            <button onClick={handleSubmit} disabled={!selectedSamarbeid}>
                Avslutt samarbeid
            </button>
        </EndpointSection>
    );
}
