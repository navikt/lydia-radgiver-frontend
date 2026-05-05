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
    useHentSisteSakNyFlyt,
} from "@/api/lydia-api/nyFlyt";
import { useHentPlanMal } from "@/api/lydia-api/plan";
import { useHentSamarbeid } from "@/api/lydia-api/spørreundersøkelse";
import { leggBrukerTilTeam } from "@/api/lydia-api/team";
import {
    NyFlytBegrunnelse,
    nyFlytBegrunnelseEnum,
    NyFlytÅrsakType,
    nyFlytÅrsakTypeEnum,
} from "@/domenetyper/domenetyper";
import { SamarbeidRequest } from "@/domenetyper/iaSakProsess";
import { SpørreundersøkelseType } from "@/domenetyper/spørreundersøkelseMedInnhold";
import { isoDato } from "@/util/dato";

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
    const [type, setType] = useState<NyFlytÅrsakType>(
        nyFlytÅrsakTypeEnum.enum.VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT,
    );
    const [begrunnelser, setBegrunnelser] = useState<NyFlytBegrunnelse[]>([
        nyFlytBegrunnelseEnum.enum.VIRKSOMHETEN_ØNSKER_Å_BLI_KONTAKTET_SENERE,
    ]);
    const [dato, setDato] = useState(() => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 90);
        return futureDate.toISOString().split("T")[0];
    });
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const begrunnelserForType: Record<NyFlytÅrsakType, NyFlytBegrunnelse[]> = {
        [nyFlytÅrsakTypeEnum.enum.VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT]:
            [
                nyFlytBegrunnelseEnum.enum
                    .VIRKSOMHETEN_ØNSKER_Å_BLI_KONTAKTET_SENERE,
                nyFlytBegrunnelseEnum.enum.NAV_HAR_IKKE_KAPASITET_NÅ,
            ],
        [nyFlytÅrsakTypeEnum.enum
            .VIRKSOMHETEN_ER_FERDIG_VURDERT_MED_INTERN_VURDERING]: [
            nyFlytBegrunnelseEnum.enum
                .VIRKSOMHETEN_HAR_IKKE_SVART_PÅ_HENVENDELSER,
            nyFlytBegrunnelseEnum.enum.VIRKSOMHETEN_HAR_FOR_LAVT_POTENSIALE,
            nyFlytBegrunnelseEnum.enum
                .VIRKSOMHETEN_MANGLER_REPRESANTANTER_ELLER_ETABLERT_PARTSGRUPPE,
        ],
        [nyFlytÅrsakTypeEnum.enum.VIRKSOMHETEN_ER_FERDIG_VURDERT_OG_TAKKET_NEI]:
            [
                nyFlytBegrunnelseEnum.enum
                    .VIRKSOMHETEN_ER_IKKE_MOTIVERT_ELLER_HAR_IKKE_KAPASITET,
                nyFlytBegrunnelseEnum.enum
                    .VIRKSOMHETEN_SAMARBEIDER_MED_ANDRE_ELLER_GJØR_EGNE_TILTAK,
                nyFlytBegrunnelseEnum.enum
                    .VIRKSOMHETEN_ØNSKER_KUN_INFORMASJON_OG_VEILEDNING,
                nyFlytBegrunnelseEnum.enum
                    .KOMMUNEN_ELLER_OVERORDNET_LEDELSE_ØNSKER_IKKE_Å_STARTE_ET_SAMARBEID,
                nyFlytBegrunnelseEnum.enum
                    .VIRKSOMHETEN_FERDIG_VURDERT_TAKKET_NEI_ANNET,
            ],
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split("T")[0];

    const handleTypeChange = (newType: NyFlytÅrsakType) => {
        setType(newType);
        setBegrunnelser([begrunnelserForType[newType][0]]);
    };

    const handleBegrunnelseToggle = (begrunnelse: NyFlytBegrunnelse) => {
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
                    onChange={(e) =>
                        handleTypeChange(e.target.value as NyFlytÅrsakType)
                    }
                >
                    <option value="VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT">
                        VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT
                    </option>
                    <option value="VIRKSOMHETEN_ER_FERDIG_VURDERT_MED_INTERN_VURDERING">
                        VIRKSOMHETEN_ER_FERDIG_VURDERT_MED_INTERN_VURDERING
                    </option>
                    <option value="VIRKSOMHETEN_ER_FERDIG_VURDERT_OG_TAKKET_NEI">
                        VIRKSOMHETEN_ER_FERDIG_VURDERT_OG_TAKKET_NEI
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

export function OpprettKartlegging({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSisteSakNyFlyt(orgnummer);
    const { data: samarbeidListe } = useHentSamarbeid(
        orgnummer,
        iaSak?.saksnummer,
    );
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
                type,
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
                <span>type: </span>
                <select
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value as SpørreundersøkelseType)
                    }
                >
                    <option value="BEHOVSVURDERING">BEHOVSVURDERING</option>
                    <option value="EVALUERING">EVALUERING</option>
                    <option value="Behovsvurdering">Behovsvurdering</option>
                    <option value="Evaluering">Evaluering</option>
                    <option value="UGYLDIG_TYPE">UGYLDIG_TYPE</option>
                </select>
            </div>
            <button onClick={handleSubmit}>Opprett kartlegging</button>
        </EndpointSection>
    );
}

export function StartKartlegging({ orgnummer, onSuccess }: PostProps) {
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
            <button onClick={handleSubmit}>Start kartlegging</button>
        </EndpointSection>
    );
}

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

export function OpprettSamarbeidsplan({ orgnummer, onSuccess }: PostProps) {
    const { data: iaSak } = useHentSisteSakNyFlyt(orgnummer);
    const { data: samarbeidListe } = useHentSamarbeid(
        orgnummer,
        iaSak?.saksnummer,
    );
    const [samarbeidId, setSamarbeidId] = useState("");
    const { data: planMal, loading: lasterPlanMal } = useHentPlanMal();
    const [response, setResponse] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        if (!iaSak) {
            setError("IA-Sak er ikke lastet ennå");
            return;
        }

        if (!planMal) {
            setError("Planmal er ikke lastet ennå");
            return;
        }

        const iDag = new Date();
        const enMånedFrem = new Date(iDag);
        enMånedFrem.setMonth(enMånedFrem.getMonth() + 1);

        const nyPlan = {
            ...planMal,
            tema: planMal.tema.map((tema, temaIndex) =>
                temaIndex === 0
                    ? {
                          ...tema,
                          inkludert: true,
                          innhold: tema.innhold.map((innhold, innholdIndex) =>
                              innholdIndex === 0
                                  ? {
                                        ...innhold,
                                        inkludert: true,
                                        startDato: isoDato(
                                            iDag,
                                        ) as unknown as Date,
                                        sluttDato: isoDato(
                                            enMånedFrem,
                                        ) as unknown as Date,
                                    }
                                  : innhold,
                          ),
                      }
                    : tema,
            ),
        };

        try {
            const result = await opprettSamarbeidsplanNyFlyt(
                orgnummer,
                iaSak.saksnummer,
                Number(samarbeidId),
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
            <button
                onClick={handleSubmit}
                disabled={!samarbeidId || lasterPlanMal || !planMal}
            >
                Opprett samarbeidsplan
            </button>
            {!planMal && !lasterPlanMal && (
                <div style={{ color: "red" }}>Kunne ikke hente planmal</div>
            )}
        </EndpointSection>
    );
}

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
