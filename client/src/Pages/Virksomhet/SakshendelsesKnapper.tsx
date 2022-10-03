import { GyldigNesteHendelse, IASakshendelseType, IASakshendelseTypeEnum } from "../../domenetyper";
import {
    erHendelsenDestruktiv,
    IASakshendelseKnapp,
    penskrivIASakshendelsestype,
    sorterHendelserPåKnappeType
} from "./IASakshendelseKnapp";
import { CSSProperties, useState } from "react";
import { BekreftelseDialog } from "../../components/Dialog/BekreftelseDialog";

const horisontalKnappeStyling: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "0.5rem"
};

const hendelsesTyperSomMåBekreftes: IASakshendelseType[] = [
    IASakshendelseTypeEnum.enum.TILBAKE,
    IASakshendelseTypeEnum.enum.FULLFØR_BISTAND,
    IASakshendelseTypeEnum.enum.SLETT_SAK
]

interface BekreftHendelseDialogProps {
    hendelse: GyldigNesteHendelse | null
    onConfirm: () => void
    onCancel: () => void
}

const beskrivelseForHendelse = (hendelse: GyldigNesteHendelse | null) => {
    if (!hendelse) return ""
    const penskrevetHendelse = penskrivIASakshendelsestype(hendelse.saksHendelsestype)
    switch (hendelse.saksHendelsestype) {
        case "OPPRETT_SAK_FOR_VIRKSOMHET":
            break;
        case "VIRKSOMHET_VURDERES":
            break;
        case "TA_EIERSKAP_I_SAK":
            break;
        case "VIRKSOMHET_SKAL_KONTAKTES":
            break;
        case "VIRKSOMHET_ER_IKKE_AKTUELL":
            break;
        case "VIRKSOMHET_KARTLEGGES":
            break;
        case "VIRKSOMHET_SKAL_BISTÅS":
            break;
        case "FULLFØR_BISTAND":
            break;
        case "TILBAKE":
            break;
        case "SLETT_SAK":
            break
        default:
            return ""

    }
}

const BekreftHendelseDialog = ({ hendelse, ...rest }: BekreftHendelseDialogProps) => (
    <BekreftelseDialog
        {...rest}
        åpen={true}
        description={beskrivelseForHendelse(hendelse)}
    />
)

interface SakshendelsesKnapperProps {
    hendelser: GyldigNesteHendelse[];
    onNyHendelseHandler: (hendelse: GyldigNesteHendelse) => void;
}

export const SakshendelsesKnapper = ({hendelser, onNyHendelseHandler}: SakshendelsesKnapperProps) => {
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
            <BekreftHendelseDialog
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