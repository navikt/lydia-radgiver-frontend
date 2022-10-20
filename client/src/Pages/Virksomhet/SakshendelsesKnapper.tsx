import { CSSProperties, useState } from "react";
import {
    GyldigNesteHendelse, IAProsessStatusEnum,
    IAProsessStatusType,
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum
} from "../../domenetyper";
import {
    erHendelsenDestruktiv,
    IASakshendelseKnapp,
    penskrivIASakshendelsestype,
    sorterHendelserPåKnappeType
} from "./IASakshendelseKnapp";
import { BekreftelseDialog, Props as BekreftelseDialogProps } from "../../components/Dialog/BekreftelseDialog";
import { penskrivIAStatus } from "../../components/Badge/StatusBadge";

const horisontalKnappeStyling: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "0.5rem"
};

const hendelsesTyperSomMåBekreftes: IASakshendelseType[] = [
    IASakshendelseTypeEnum.enum.TILBAKE,
    IASakshendelseTypeEnum.enum.FULLFØR_BISTAND,
]

interface BekreftHendelseDialogProps {
    sak: IASak
    hendelse: GyldigNesteHendelse | null
}

const beskrivelseForHendelse = ({hendelse, sakstatus}: {
    hendelse: GyldigNesteHendelse | null,
    sakstatus: IAProsessStatusType
}) => {
    if (!hendelse) return ""
    const penskrevetHendelse = penskrivIASakshendelsestype(hendelse.saksHendelsestype)
    switch (hendelse.saksHendelsestype) {
        case "FULLFØR_BISTAND":
            return `Du har valgt hendelsen "Fullfør" – velges når avtalt IA-oppfølging er fullført. Saken lukkes.`
        case "TILBAKE": {
            let text = `Du har valgt hendelsen "${penskrevetHendelse}"`
            if (sakstatus === IAProsessStatusEnum.enum.FULLFØRT) text += ` - velges når du vil gjenåpne saken og gå tilbake til status "${penskrivIAStatus(IAProsessStatusEnum.enum.VI_BISTÅR)}".`
            if (sakstatus === IAProsessStatusEnum.enum.IKKE_AKTUELL) text += ` - velges når du vil gjenåpne saken og gå tilbake til siste status.`
            return text;
        }
        default:
            return ""

    }
}

const BekreftHendelseDialog = ({
    sak: {status: sakstatus},
    hendelse,
    ...rest
}: BekreftelseDialogProps & BekreftHendelseDialogProps) => (
    <BekreftelseDialog
        {...rest}
        description={beskrivelseForHendelse({hendelse, sakstatus})}
    />
)

interface SakshendelsesKnapperProps {
    sak: IASak
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
                sak={sak}
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