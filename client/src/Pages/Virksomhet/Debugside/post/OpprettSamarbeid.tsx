import { useState } from "react";
import {
    opprettSamarbeidNyFlyt,
    useHentSisteSakNyFlyt,
} from "@features/sak/api/nyFlyt";
import { EndpointSection, PostProps } from "./EndpointSection";

export function OpprettSamarbeid({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSisteSakNyFlyt(orgnummer);
    const [navn, setNavn] = useState("Nytt samarbeid");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        if (!iaSak?.saksnummer) {
            setError("Saksnummer ikke tilgjengelig");
            return;
        }
        try {
            const nyttSamarbeid = {
                id: 0,
                saksnummer: iaSak.saksnummer,
                navn,
                status: "AKTIV" as const,
            };
            const result = await opprettSamarbeidNyFlyt(
                orgnummer,
                nyttSamarbeid,
            );
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: opprettSamarbeidNyFlyt"
            response={response}
            error={error}
        >
            <div>
                <span>saksnummer: </span>
                <input value={iaSak?.saksnummer ?? "Laster..."} disabled />
            </div>
            <div>
                <span>navn: </span>
                <input value={navn} onChange={(e) => setNavn(e.target.value)} />
            </div>
            <button onClick={handleSubmit} disabled={!iaSak?.saksnummer}>
                Opprett samarbeid
            </button>
        </EndpointSection>
    );
}
