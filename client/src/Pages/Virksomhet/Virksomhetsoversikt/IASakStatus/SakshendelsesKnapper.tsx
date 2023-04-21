import { CSSProperties, useState } from "react";
import {
    GyldigNesteHendelse,
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum
} from "../../../../domenetyper/domenetyper";
import { erHendelsenDestruktiv, IASakshendelseKnapp, sorterHendelserPåKnappeType } from "./IASakshendelseKnapp";
import { BekreftHendelseModal } from "./BekreftHendelseModal";

const horisontalKnappeStyling: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "0.5rem"
};

interface SakshendelsesKnapperProps {
    sak: IASak;
    hendelser: GyldigNesteHendelse[];
    onNyHendelseHandler: (hendelse: GyldigNesteHendelse) => void;
}

interface SakshendelsesKnapperProps {
    hendelser: GyldigNesteHendelse[];
    onNyHendelseHandler: (hendelse: GyldigNesteHendelse) => void;
}

export const SakshendelsesKnapper = ({sak, hendelser, onNyHendelseHandler}: SakshendelsesKnapperProps) => {
    const [hendelseSomMåBekreftes, setHendelseSomMåBekreftes] = useState<GyldigNesteHendelse | null>(null)

    const destruktiveHendelser = hendelser
        .filter(hendelse => erHendelsenDestruktiv(hendelse.saksHendelsestype))
    const ikkeDestruktiveHendelser = hendelser
        .filter(hendelse => !erHendelsenDestruktiv(hendelse.saksHendelsestype))

    const trykkPåSakhendelsesknapp = (hendelse: GyldigNesteHendelse) => {
        const erEnHendelseSomMåBekreftes = hendelse.saksHendelsestype === IASakshendelseTypeEnum.enum.TILBAKE
            || hendelse.saksHendelsestype === IASakshendelseTypeEnum.enum.FULLFØR_BISTAND

        if (erEnHendelseSomMåBekreftes) {
            setHendelseSomMåBekreftes(hendelse)
        } else {
            // endre hendelse og hent begrunnelse om den skal ha det
            onNyHendelseHandler(hendelse)
        }
    }

    return (
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            {
                [destruktiveHendelser, ikkeDestruktiveHendelser].map((hendelser) => {
                    return <div style={horisontalKnappeStyling}
                                key={hendelser.map(hendelse => hendelse.saksHendelsestype).join("-")}>
                        {hendelser
                            .sort(sorterHendelserPåKnappeType)
                            .map((hendelse) => {
                                return (
                                    <IASakshendelseKnapp
                                        key={hendelse.saksHendelsestype}
                                        hendelsesType={hendelse.saksHendelsestype}
                                        onClick={() => trykkPåSakhendelsesknapp(hendelse)}
                                    />
                                );
                            })
                        }
                    </div>
                })
            }
            <BekreftHendelseModal
                saksstatus={sak.status}
                åpen={hendelseSomMåBekreftes !== null}
                onConfirm={() => {
                    hendelseSomMåBekreftes && onNyHendelseHandler(hendelseSomMåBekreftes)
                    setHendelseSomMåBekreftes(null)
                }}
                onCancel={() => {
                    setHendelseSomMåBekreftes(null)
                }}
                hendelse={hendelseSomMåBekreftes}
            />
        </div>
    )
}
