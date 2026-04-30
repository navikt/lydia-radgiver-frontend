import { useState } from "react";
import { leggBrukerTilTeam } from "@features/bruker/api/team";
import { useHentSisteSakNyFlyt } from "@features/sak/api/nyFlyt";
import { EndpointSection, PostProps } from "./EndpointSection";

export function FølgVirksomhet({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSisteSakNyFlyt(orgnummer);
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        if (!iaSak?.saksnummer) {
            setError("Saksnummer ikke tilgjengelig");
            return;
        }
        try {
            const result = await leggBrukerTilTeam(iaSak.saksnummer);
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: leggBrukerTilTeam (Følg virksomheten)"
            response={response}
            error={error}
        >
            <button onClick={handleSubmit} disabled={!iaSak?.saksnummer}>
                Følg virksomheten
            </button>
        </EndpointSection>
    );
}
