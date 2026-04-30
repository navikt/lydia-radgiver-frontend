import { useState } from "react";
import { bliEierNyFlyt } from "@features/sak/api/nyFlyt";
import { EndpointSection, PostProps } from "./EndpointSection";

export function BliEier({ orgnummer, onSuccess }: PostProps) {
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await bliEierNyFlyt(orgnummer);
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: bliEierNyFlyt"
            response={response}
            error={error}
        >
            <button onClick={handleSubmit}>Bli eier</button>
        </EndpointSection>
    );
}
