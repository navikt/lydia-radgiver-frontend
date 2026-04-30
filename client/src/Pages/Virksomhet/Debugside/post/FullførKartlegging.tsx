import { useState } from "react";
import { useHentSamarbeid } from "@features/kartlegging/api/spørreundersøkelse";
import {
    fullførKartleggingNyFlyt,
    useHentSisteSakNyFlyt,
} from "@features/sak/api/nyFlyt";
import { EndpointSection, PostProps } from "./EndpointSection";

export function FullførKartlegging({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSisteSakNyFlyt(orgnummer);
    const { data: samarbeidListe } = useHentSamarbeid(
        orgnummer,
        iaSak?.saksnummer,
    );
    const [samarbeidId, setSamarbeidId] = useState("");
    const [spørreundersøkelseId, setSpørreundersøkelseId] = useState("");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await fullførKartleggingNyFlyt(
                orgnummer,
                samarbeidId,
                spørreundersøkelseId,
            );
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: fullførKartleggingNyFlyt"
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
                <span>spørreundersøkelseId: </span>
                <input
                    value={spørreundersøkelseId}
                    onChange={(e) => setSpørreundersøkelseId(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit}>Fullfør kartlegging</button>
        </EndpointSection>
    );
}
