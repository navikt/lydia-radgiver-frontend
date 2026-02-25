import { useState } from "react";
import {
    endrePlanlagtDatoNyFlyt,
    useHentTilstandForVirksomhetNyFlyt,
} from "../../../api/lydia-api/nyFlyt";
import { VirksomhetTilstandAutomatiskOppdateringDto } from "../../../domenetyper/domenetyper";

interface PutProps {
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

export function EndrePlanlagtDato({ orgnummer, onSuccess }: PutProps) {
    const { data: tilstand } = useHentTilstandForVirksomhetNyFlyt(orgnummer);
    const nesteTilstand = tilstand?.nesteTilstand;

    const [planlagtDato, setPlanlagtDato] = useState("");
    const [response, setResponse] =
        useState<VirksomhetTilstandAutomatiskOppdateringDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        if (!nesteTilstand) {
            setError("Ingen nesteTilstand funnet for virksomheten");
            return;
        }
        if (!planlagtDato) {
            setError("Planlagt dato er påkrevd");
            return;
        }
        try {
            const result = await endrePlanlagtDatoNyFlyt(orgnummer, {
                startTilstand: nesteTilstand.startTilstand,
                planlagtHendelse: nesteTilstand.planlagtHendelse,
                nyTilstand: nesteTilstand.nyTilstand,
                planlagtDato: new Date(planlagtDato),
            });
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="PUT: endrePlanlagtDatoNyFlyt"
            response={response}
            error={error}
        >
            {!nesteTilstand ? (
                <div style={{ color: "gray" }}>
                    Ingen nesteTilstand — virksomheten har ingen planlagt
                    automatisk oppdatering.
                </div>
            ) : (
                <>
                    <div>
                        <span>startTilstand: </span>
                        <input
                            value={nesteTilstand.startTilstand}
                            disabled
                        />
                    </div>
                    <div>
                        <span>planlagtHendelse: </span>
                        <input
                            value={nesteTilstand.planlagtHendelse}
                            disabled
                        />
                    </div>
                    <div>
                        <span>nyTilstand: </span>
                        <input value={nesteTilstand.nyTilstand} disabled />
                    </div>
                    <div>
                        <span>planlagtDato (YYYY-MM-DD): </span>
                        <input
                            type="date"
                            value={planlagtDato}
                            onChange={(e) => setPlanlagtDato(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSubmit}>Endre planlagt dato</button>
                </>
            )}
        </EndpointSection>
    );
}
