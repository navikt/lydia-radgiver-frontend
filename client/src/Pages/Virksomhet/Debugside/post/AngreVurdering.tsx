import { useState } from "react";
import { angreVurderingNyFlyt } from "@features/sak/api/nyFlyt";
import { EndpointSection, PostProps } from "./EndpointSection";

export function AngreVurdering({ orgnummer, onSuccess }: PostProps) {
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await angreVurderingNyFlyt(orgnummer);
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: angreVurderingNyFlyt"
            response={response}
            error={error}
        >
            <button onClick={handleSubmit}>Angre vurdering</button>
        </EndpointSection>
    );
}
