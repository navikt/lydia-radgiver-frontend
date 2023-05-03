import { BekreftValgModal, Props as BekreftValgModalProps } from "../../../../components/Modal/BekreftValgModal";
import { loggModalTilbakeTilForrigeStatusLukket } from "../../../../util/amplitude-klient";
import { GyldigNesteHendelse, IAProsessStatusEnum, IAProsessStatusType } from "../../../../domenetyper/domenetyper";
import { penskrivIAStatus } from "../../../../components/Badge/StatusBadge";

interface BekreftHendelseModalProps {
    saksstatus: IAProsessStatusType,
    hendelse: GyldigNesteHendelse | null
}

export const BekreftHendelseModal = ({
    saksstatus,
    hendelse,
    åpen,
    onConfirm,
    onCancel,
}: BekreftValgModalProps & BekreftHendelseModalProps) => {
    const modalTekst = modalTekstForHendelse({ hendelse, saksstatus });

    return (
        <BekreftValgModal
            åpen={åpen}
            onConfirm={() => {
                onConfirm();
                loggModalTilbakeTilForrigeStatusLukket(
                    modalTekst.tittel,
                    modalTekst.beskrivelse,
                    "ja",
                    saksstatus
                );
            }}
            onCancel={() => {
                onCancel();
                loggModalTilbakeTilForrigeStatusLukket(
                    modalTekst.tittel,
                    modalTekst.beskrivelse,
                    "avbryt",
                    saksstatus
                );
            }}
            title={modalTekst.tittel}
            description={modalTekst.beskrivelse}
        />
    );
}

const DEFAULT_TITTEL_FOR_MODAL = "Er du sikker på at du vil gjøre dette?";

interface ModalTekst {
    tittel: string;
    beskrivelse: string;
}

interface ModalTekstForHendelseProps {
    hendelse: GyldigNesteHendelse | null,
    saksstatus: IAProsessStatusType
}

const modalTekstForHendelse = ({ hendelse, saksstatus }: ModalTekstForHendelseProps): ModalTekst => {
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
            if (saksstatus === IAProsessStatusEnum.enum.FULLFØRT) {
                return {
                    tittel: 'Er du sikker på at du vil gjenåpne saken?',
                    beskrivelse: `Dette setter saken tilbake til "${penskrivIAStatus(IAProsessStatusEnum.enum.VI_BISTÅR)}"`,
                }
            }
            if (saksstatus === IAProsessStatusEnum.enum.IKKE_AKTUELL) {
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