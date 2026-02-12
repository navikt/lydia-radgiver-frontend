import { useState } from "react";
import {
    slettKartleggingNyFlyt,
    slettSamarbeidsplanNyFlyt,
    slettSamarbeidNyFlyt,
} from "../../../api/lydia-api/nyFlyt";

interface DeleteProps {
    orgnummer: string;
    onSuccess: () => void;
}

interface EndpointSectionProps {
    title: string;
    children: React.ReactNode;
    response: object | null;
    error: string | null;
}

function EndpointSection({
    title,
    children,
    response,
    error,
}: EndpointSectionProps) {
    return (
        <div style={{ backgroundColor: "#fff", padding: "10px" }}>
            <h3>{title}</h3>
            {children}
            {error && <div style={{ color: "red" }}>Error: {error}</div>}
            {response && (
                <pre
                    style={{
                        fontFamily: "monospace",
                        fontSize: "12px",
                        maxHeight: "150px",
                        overflowY: "auto",
                        backgroundColor: "#f0f0f0",
                        padding: "5px",
                    }}
                >
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </div>
    );
}

export function SlettKartlegging({ orgnummer, onSuccess }: DeleteProps) {
    const [samarbeidId, setSamarbeidId] = useState("");
    const [spørreundersøkelseId, setSpørreundersøkelseId] = useState("");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await slettKartleggingNyFlyt(
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
            title="DELETE: slettKartleggingNyFlyt"
            response={response}
            error={error}
        >
            <div>
                <span>samarbeidId: </span>
                <input
                    value={samarbeidId}
                    onChange={(e) => setSamarbeidId(e.target.value)}
                />
            </div>
            <div>
                <span>spørreundersøkelseId: </span>
                <input
                    value={spørreundersøkelseId}
                    onChange={(e) => setSpørreundersøkelseId(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit}>Slett kartlegging</button>
        </EndpointSection>
    );
}

export function SlettSamarbeidsplan({ orgnummer, onSuccess }: DeleteProps) {
    const [samarbeidId, setSamarbeidId] = useState("");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await slettSamarbeidsplanNyFlyt(
                orgnummer,
                samarbeidId,
            );
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="DELETE: slettSamarbeidsplanNyFlyt"
            response={response}
            error={error}
        >
            <div>
                <span>samarbeidId: </span>
                <input
                    value={samarbeidId}
                    onChange={(e) => setSamarbeidId(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit}>Slett samarbeidsplan</button>
        </EndpointSection>
    );
}

export function SlettSamarbeid({ orgnummer, onSuccess }: DeleteProps) {
    const [samarbeidId, setSamarbeidId] = useState("");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await slettSamarbeidNyFlyt(orgnummer, samarbeidId);
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="DELETE: slettSamarbeidNyFlyt"
            response={response}
            error={error}
        >
            <div>
                <span>samarbeidId: </span>
                <input
                    value={samarbeidId}
                    onChange={(e) => setSamarbeidId(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit}>Slett samarbeid</button>
        </EndpointSection>
    );
}
