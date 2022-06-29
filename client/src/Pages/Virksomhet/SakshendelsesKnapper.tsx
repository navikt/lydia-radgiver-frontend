import {GyldigNesteHendelse} from "../../domenetyper";
import {erHendelsenDestruktiv, IASakshendelseKnapp, sorterHendelserPåKnappeType} from "./IASakshendelseKnapp";
import {CSSProperties} from "react";

const horisontalKnappeStyling: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "0.5rem"
};

export const SakshendelsesKnapper = ({
                                         hendelser,
                                         onNyHendelseHandler
                                     }: { hendelser: GyldigNesteHendelse[], onNyHendelseHandler: (hendelse: GyldigNesteHendelse) => void }) => {
    const destruktiveHendelser = hendelser
        .filter(hendelse => erHendelsenDestruktiv(hendelse.saksHendelsestype))
    const ikkeDestruktiveHendelser = hendelser
        .filter(hendelse => !erHendelsenDestruktiv(hendelse.saksHendelsestype))

    return (
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <div style={horisontalKnappeStyling}>
                {destruktiveHendelser
                    .sort(sorterHendelserPåKnappeType)
                    .map((hendelse) => {
                        return (
                            <IASakshendelseKnapp
                                key={hendelse.saksHendelsestype}
                                hendelsesType={hendelse.saksHendelsestype}
                                onClick={() => onNyHendelseHandler(hendelse)}
                            />
                        );
                    })
                }
            </div>
            <div style={horisontalKnappeStyling}>
                {ikkeDestruktiveHendelser
                    .sort(sorterHendelserPåKnappeType)
                    .map((hendelse) => {
                        return (
                            <IASakshendelseKnapp
                                key={hendelse.saksHendelsestype}
                                hendelsesType={hendelse.saksHendelsestype}
                                onClick={() => onNyHendelseHandler(hendelse)}
                            />
                        );
                    })
                }
            </div>
        </div>
    )
}
