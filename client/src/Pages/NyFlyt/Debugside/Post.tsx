import { useState } from "react";
import {
    vurderSakNyFlyt,
    bliEierNyFlyt,
    angreVurderingNyFlyt,
    avsluttVurderingNyFlyt,
    opprettSamarbeidNyFlyt,
    opprettKartleggingNyFlyt,
    startKartleggingNyFlyt,
    fullførKartleggingNyFlyt,
    opprettSamarbeidsplanNyFlyt,
    avsluttSamarbeidNyFlyt,
    useHentSakNyFlyt,
} from "../../../api/lydia-api/nyFlyt";
import { leggBrukerTilTeam } from "../../../api/lydia-api/team";
import { SpørreundersøkelseType } from "../../../domenetyper/spørreundersøkelseMedInnhold";
import { SamarbeidRequest } from "../../../domenetyper/iaSakProsess";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";

interface PostProps {
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

export function VurderSak({ orgnummer, onSuccess }: PostProps) {
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await vurderSakNyFlyt(orgnummer);
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: vurderSakNyFlyt"
            response={response}
            error={error}
        >
            <button onClick={handleSubmit}>Vurder sak</button>
        </EndpointSection>
    );
}

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

export function FølgVirksomhet({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSakNyFlyt(orgnummer);
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

export function AvsluttVurdering({ orgnummer, onSuccess }: PostProps) {
    const [type, setType] = useState("VIRKSOMHETEN_SKAL_VURDERES_SENERE");
    const [begrunnelser, setBegrunnelser] = useState<string[]>([
        "VIRKSOMHETEN_ØNSKER_SAMARBEID_SENERE",
    ]);
    const [dato, setDato] = useState(() => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 90);
        return futureDate.toISOString().split("T")[0];
    });
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const begrunnelserForType: Record<string, string[]> = {
        VIRKSOMHETEN_SKAL_VURDERES_SENERE: [
            "VIRKSOMHETEN_ØNSKER_SAMARBEID_SENERE",
        ],
        VIRKSOMHETEN_ER_FERDIG_VURDERT: [
            "VIRKSOMHETEN_HAR_TAKKET_NEI",
            "IKKE_DOKUMENTERT_DIALOG_MELLOM_PARTENE",
        ],
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split("T")[0];

    const handleTypeChange = (newType: string) => {
        setType(newType);
        setBegrunnelser([begrunnelserForType[newType][0]]);
    };

    const handleBegrunnelseToggle = (begrunnelse: string) => {
        setBegrunnelser((prev) =>
            prev.includes(begrunnelse)
                ? prev.filter((b) => b !== begrunnelse)
                : [...prev, begrunnelse],
        );
    };

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await avsluttVurderingNyFlyt(orgnummer, {
                type,
                begrunnelser,
                dato,
            });
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: avsluttVurderingNyFlyt"
            response={response}
            error={error}
        >
            <div>
                <span>type: </span>
                <select
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                >
                    <option value="VIRKSOMHETEN_SKAL_VURDERES_SENERE">
                        VIRKSOMHETEN_SKAL_VURDERES_SENERE
                    </option>
                    <option value="VIRKSOMHETEN_ER_FERDIG_VURDERT">
                        VIRKSOMHETEN_ER_FERDIG_VURDERT
                    </option>
                </select>
            </div>
            <div>
                <span>begrunnelser: </span>
                {begrunnelserForType[type].map((b) => (
                    <label key={b} style={{ display: "block" }}>
                        <input
                            type="checkbox"
                            checked={begrunnelser.includes(b)}
                            onChange={() => handleBegrunnelseToggle(b)}
                        />
                        {b}
                    </label>
                ))}
            </div>
            <div>
                <span>dato: </span>
                <input
                    type="date"
                    value={dato}
                    min={minDateStr}
                    onChange={(e) => setDato(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit}>Avslutt vurdering</button>
        </EndpointSection>
    );
}

export function OpprettSamarbeid({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSakNyFlyt(orgnummer);
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

export function OpprettKartlegging({ orgnummer, onSuccess }: PostProps) {
    const [samarbeidId, setSamarbeidId] = useState("");
    const [type, setType] = useState<SpørreundersøkelseType>("BEHOVSVURDERING");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await opprettKartleggingNyFlyt(
                orgnummer,
                samarbeidId,
                (type.charAt(0).toUpperCase() +
                    type.slice(1).toLowerCase()) as SpørreundersøkelseType, // Konverterer fra f.eks. "BEHOVSVURDERING" til "Behovsvurdering" for å matche backend
            );
            setResponse(result);
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <EndpointSection
            title="POST: opprettKartleggingNyFlyt"
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
                <span>type: </span>
                <select
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value as SpørreundersøkelseType)
                    }
                >
                    <option value="BEHOVSVURDERING">BEHOVSVURDERING</option>
                    <option value="EVALUERING">EVALUERING</option>
                </select>
            </div>
            <button onClick={handleSubmit}>Opprett kartlegging</button>
        </EndpointSection>
    );
}

export function StartKartlegging({ orgnummer, onSuccess }: PostProps) {
    const [samarbeidId, setSamarbeidId] = useState("");
    const [spørreundersøkelseId, setSpørreundersøkelseId] = useState("");
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const result = await startKartleggingNyFlyt(
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
            title="POST: startKartleggingNyFlyt"
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
            <button onClick={handleSubmit}>Start kartlegging</button>
        </EndpointSection>
    );
}

export function FullførKartlegging({ orgnummer, onSuccess }: PostProps) {
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
            <button onClick={handleSubmit}>Fullfør kartlegging</button>
        </EndpointSection>
    );
}

export function OpprettSamarbeidsplan({ orgnummer, onSuccess }: PostProps) {
    const [samarbeidId, setSamarbeidId] = useState("");
    const [planJson, setPlanJson] = useState('{"tema": []}');
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const nyPlan = JSON.parse(planJson);
            const result = await opprettSamarbeidsplanNyFlyt(
                orgnummer,
                samarbeidId,
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
                <input
                    value={samarbeidId}
                    onChange={(e) => setSamarbeidId(e.target.value)}
                />
            </div>
            <div>
                <span>PlanMal (JSON):</span>
                <br />
                <textarea
                    value={planJson}
                    onChange={(e) => setPlanJson(e.target.value)}
                    style={{
                        width: "400px",
                        height: "60px",
                        fontFamily: "monospace",
                    }}
                />
            </div>
            <button onClick={handleSubmit}>Opprett samarbeidsplan</button>
        </EndpointSection>
    );
}

export function AvsluttSamarbeid({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSakNyFlyt(orgnummer);
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
                samarbeidId,
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
