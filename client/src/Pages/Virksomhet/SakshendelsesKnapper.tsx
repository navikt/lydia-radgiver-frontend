import {GyldigNesteHendelse, IASakshendelseType, IASakshendelseTypeEnum} from "../../domenetyper";
import {
    erHendelsenDestruktiv,
    IASakshendelseKnapp,
    penskrivIASakshendelsestype,
    sorterHendelserPåKnappeType
} from "./IASakshendelseKnapp";
import {CSSProperties, useState} from "react";
import {BekreftelseDialog} from "../../components/Dialog/BekreftelseDialog";

const horisontalKnappeStyling: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "0.5rem"
};

const hendelsesTyperSomMåBekreftes: IASakshendelseType[] = [
    IASakshendelseTypeEnum.enum.TILBAKE,
    IASakshendelseTypeEnum.enum.FULLFØR_BISTAND
]

export const SakshendelsesKnapper = ({
                                         hendelser,
                                         onNyHendelseHandler
                                     }: { hendelser: GyldigNesteHendelse[], onNyHendelseHandler: (hendelse: GyldigNesteHendelse) => void }) => {
    const [hendelseSomMåBekreftes, setHendelseSomMåBekreftes] = useState<GyldigNesteHendelse | null>(null)

    const destruktiveHendelser = hendelser
        .filter(hendelse => erHendelsenDestruktiv(hendelse.saksHendelsestype))
    const ikkeDestruktiveHendelser = hendelser
        .filter(hendelse => !erHendelsenDestruktiv(hendelse.saksHendelsestype))

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
                                        onClick={() => {
                                            hendelsesTyperSomMåBekreftes.includes(hendelse.saksHendelsestype)
                                                ? setHendelseSomMåBekreftes(hendelse)
                                                : onNyHendelseHandler(hendelse)
                                        }}
                                    />
                                );
                            })
                        }
                    </div>
                })
            }
            <BekreftelseDialog
                onConfirm={() => {
                    setHendelseSomMåBekreftes(null)
                    hendelseSomMåBekreftes && onNyHendelseHandler(hendelseSomMåBekreftes)
                }}
                onCancel={() => {
                    setHendelseSomMåBekreftes(null)
                }}
                åpen={hendelseSomMåBekreftes != null}
                description={`Du har valgt hendelsen ${hendelseSomMåBekreftes
                    ? `"${penskrivIASakshendelsestype(hendelseSomMåBekreftes.saksHendelsestype)}"`
                    : ""}`}
            />
        </div>
    )
}
