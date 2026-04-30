import { useState } from "react";
import { useHentSamarbeid } from "@features/kartlegging/api/spørreundersøkelse";
import { SpørreundersøkelseType } from "@features/kartlegging/types/spørreundersøkelseMedInnhold";
import {
    opprettKartleggingNyFlyt,
    useHentSisteSakNyFlyt,
} from "@features/sak/api/nyFlyt";
import { EndpointSection, PostProps } from "./EndpointSection";

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
