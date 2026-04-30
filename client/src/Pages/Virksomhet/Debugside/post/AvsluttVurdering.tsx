import { useState } from "react";
import {
    NyFlytBegrunnelse,
    nyFlytBegrunnelseEnum,
    NyFlytÅrsakType,
    nyFlytÅrsakTypeEnum,
} from "@/domenetyper/domenetyper";
import { avsluttVurderingNyFlyt } from "@features/sak/api/nyFlyt";
import { EndpointSection, PostProps } from "./EndpointSection";

const BEGRUNNELSER_FOR_TYPE: Record<NyFlytÅrsakType, NyFlytBegrunnelse[]> = {
    [nyFlytÅrsakTypeEnum.enum.VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT]: [
        nyFlytBegrunnelseEnum.enum.VIRKSOMHETEN_ØNSKER_Å_BLI_KONTAKTET_SENERE,
        nyFlytBegrunnelseEnum.enum.NAV_HAR_IKKE_KAPASITET_NÅ,
    ],
    [nyFlytÅrsakTypeEnum.enum
        .VIRKSOMHETEN_ER_FERDIG_VURDERT_MED_INTERN_VURDERING]: [
        nyFlytBegrunnelseEnum.enum.VIRKSOMHETEN_HAR_IKKE_SVART_PÅ_HENVENDELSER,
        nyFlytBegrunnelseEnum.enum.VIRKSOMHETEN_HAR_FOR_LAVT_POTENSIALE,
        nyFlytBegrunnelseEnum.enum
            .VIRKSOMHETEN_MANGLER_REPRESANTANTER_ELLER_ETABLERT_PARTSGRUPPE,
    ],
    [nyFlytÅrsakTypeEnum.enum.VIRKSOMHETEN_ER_FERDIG_VURDERT_OG_TAKKET_NEI]: [
        nyFlytBegrunnelseEnum.enum
            .VIRKSOMHETEN_ER_IKKE_MOTIVERT_ELLER_HAR_IKKE_KAPASITET,
        nyFlytBegrunnelseEnum.enum
            .VIRKSOMHETEN_SAMARBEIDER_MED_ANDRE_ELLER_GJØR_EGNE_TILTAK,
        nyFlytBegrunnelseEnum.enum
            .VIRKSOMHETEN_ØNSKER_KUN_INFORMASJON_OG_VEILEDNING,
        nyFlytBegrunnelseEnum.enum
            .KOMMUNEN_ELLER_OVERORDNET_LEDELSE_ØNSKER_IKKE_Å_STARTE_ET_SAMARBEID,
        nyFlytBegrunnelseEnum.enum.VIRKSOMHETEN_FERDIG_VURDERT_TAKKET_NEI_ANNET,
    ],
};

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

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split("T")[0];

    const handleTypeChange = (newType: NyFlytÅrsakType) => {
        setType(newType);
        setBegrunnelser([BEGRUNNELSER_FOR_TYPE[newType][0]]);
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
                {BEGRUNNELSER_FOR_TYPE[type].map((b) => (
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
