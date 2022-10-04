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
import {CSSProperties, useState} from "react";
import {BekreftelseDialog, Props as BekreftelseDialogProps} from "../../components/Dialog/BekreftelseDialog";
import {penskrivIAStatus} from "../Prioritering/StatusBadge";

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
            return `Du er i ferd med å fullføre den tidsbegrensede avtalen med denne virksomheten. Er dette riktig?`
        case "TILBAKE": {
            if (sakstatus === IAProsessStatusEnum.enum.FULLFØRT) return `Hvis du velger "${penskrevetHendelse}" vil saken gjenåpnes og få status "${penskrivIAStatus(IAProsessStatusEnum.enum.VI_BISTÅR)}".`
            return `Du har valgt hendelsen "${penskrevetHendelse}"`;
        }
        default:
            return ""

    }
}

const BekreftHendelseDialog = ({sak: {status: sakstatus}, hendelse, ...rest}: BekreftelseDialogProps & BekreftHendelseDialogProps) => (
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