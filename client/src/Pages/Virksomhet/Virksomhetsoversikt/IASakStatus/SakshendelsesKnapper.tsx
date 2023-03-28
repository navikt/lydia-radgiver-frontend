import { CSSProperties, useState } from "react";
import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IAProsessStatusType,
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum
} from "../../../../domenetyper/domenetyper";
import { erHendelsenDestruktiv, IASakshendelseKnapp, sorterHendelserPåKnappeType } from "./IASakshendelseKnapp";
import {
    BekreftValgModal,
    Props as BekreftValgModalProps
} from "../../../../components/Modal/BekreftValgModal";
import { penskrivIAStatus } from "../../../../components/Badge/StatusBadge";
import { loggModalTilbakeTilForrigeStatusLukket } from "../../../../util/amplitude-klient";

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

interface BekreftHendelseModalProps {
    sak: IASak
    hendelse: GyldigNesteHendelse | null
}

interface ModalTekst {
    tittel: string;
    beskrivelse: string;
}

const DEFAULT_TITTEL_FOR_MODAL = "Er du sikker på at du vil gjøre dette?";

const modalTekstForHendelse = ({hendelse, sakstatus}: {
    hendelse: GyldigNesteHendelse | null,
    sakstatus: IAProsessStatusType
}): ModalTekst => {
    if (!hendelse) return {
        tittel: DEFAULT_TITTEL_FOR_MODAL,
        beskrivelse: ""
    }

    switch (hendelse.saksHendelsestype) {
        case "FULLFØR_BISTAND":
            return {
                tittel: 'Er du sikker på at du vil fullføre saken?',
                beskrivelse: 'Dette vil lukke saken og skal gjøres når avtalt IA-oppfølging er fullført.'
            }
        case "TILBAKE": {
            if (sakstatus === IAProsessStatusEnum.enum.FULLFØRT) {
                return {
                    tittel: 'Er du sikker på at du vil gjenåpne saken?',
                    beskrivelse: `Dette setter saken tilbake til "${penskrivIAStatus(IAProsessStatusEnum.enum.VI_BISTÅR)}"`,
                }
            }
            if (sakstatus === IAProsessStatusEnum.enum.IKKE_AKTUELL) {
                return {
                    tittel: 'Er du sikker på at du vil gjenåpne saken?',
                    beskrivelse: 'Dette setter saken tilbake til forrige status.'
                }
            }
            return {
                tittel: 'Er du sikker på at du vil gå tilbake?',
                beskrivelse: 'Dette setter saken tilbake til forrige status.',
            }
        }
        default:
            return {
                tittel: DEFAULT_TITTEL_FOR_MODAL,
                beskrivelse: ""
            }
    }
}

const BekreftHendelseModal = ({
                                  sak: {status: sakstatus},
                                  åpen,
                                  onConfirm,
                                  onCancel,
                                  hendelse,
                              }: BekreftValgModalProps & BekreftHendelseModalProps) => {
    const modalTekst = modalTekstForHendelse({hendelse, sakstatus});

    return (
        <BekreftValgModal
            åpen={åpen}
            onConfirm={() => {
                onConfirm();
                loggModalTilbakeTilForrigeStatusLukket(
                    modalTekst.tittel,
                    modalTekst.beskrivelse,
                    "ja",
                    sakstatus
                );
            }}
            onCancel={() => {
                onCancel();
                loggModalTilbakeTilForrigeStatusLukket(
                    modalTekst.tittel,
                    modalTekst.beskrivelse,
                    "avbryt",
                    sakstatus
                );
            }}
            title={modalTekst.tittel}
            description={modalTekst.beskrivelse}
        />
    );
}

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
            <BekreftHendelseModal
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
