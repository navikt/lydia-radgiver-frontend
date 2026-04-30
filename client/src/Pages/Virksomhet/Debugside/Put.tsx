import { useState } from "react";
import { VirksomhetTilstandAutomatiskOppdateringDto } from "@/domenetyper/domenetyper";
import { useHentSamarbeid } from "@features/kartlegging/api/spørreundersøkelse";
import {
    endrePlanlagtDatoNyFlyt,
    endreSamarbeidsNavnNyFlyt,
    useHentSisteSakNyFlyt,
    useHentTilstandForVirksomhetNyFlyt,
} from "@features/sak/api/nyFlyt";

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

export function EndreSamarbeidsNavn({ orgnummer, onSuccess }: PutProps) {
    const { data: iaSak } = useHentSisteSakNyFlyt(orgnummer);
    const { data: samarbeidListe } = useHentSamarbeid(
        orgnummer,
        iaSak?.saksnummer,
    );
    const [samarbeidId, setSamarbeidId] = useState("");
    const [nyttNavn, setNyttNavn] = useState("");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const valgtSamarbeid = samarbeidListe?.find(
        (s) => String(s.id) === samarbeidId,
    );

    const handleSubmit = async () => {
        setError(null);
        if (!valgtSamarbeid) {
            setError("Velg et samarbeid");
            return;
        }
        try {
            const result = await endreSamarbeidsNavnNyFlyt(
                orgnummer,
                Number(samarbeidId),
                {
                    id: valgtSamarbeid.id,
                    saksnummer: valgtSamarbeid.saksnummer,
                    navn: nyttNavn,
                    status: valgtSamarbeid.status,
                },
            );
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="PUT: endreSamarbeidsNavnNyFlyt"
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
                <span>nytt navn: </span>
                <input
                    value={nyttNavn}
                    onChange={(e) => setNyttNavn(e.target.value)}
                    placeholder={valgtSamarbeid?.navn || "(uten navn)"}
                />
            </div>
            <button onClick={handleSubmit}>Endre samarbeidsnavn</button>
        </EndpointSection>
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
                        <input value={nesteTilstand.startTilstand} disabled />
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
