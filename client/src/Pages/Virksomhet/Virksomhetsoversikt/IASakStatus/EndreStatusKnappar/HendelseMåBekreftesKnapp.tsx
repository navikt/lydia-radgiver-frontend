import { GyldigNesteHendelse, IASak } from "../../../../../domenetyper/domenetyper";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { BekreftHendelseModal } from "../BekreftHendelseModal";
import { useState } from "react";
import { nyHendelsePåSak, useHentAktivSakForVirksomhet, useHentSamarbeidshistorikk } from "../../../../../api/lydia-api";
import { loggStatusendringPåSak } from "../../../../../util/amplitude-klient";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
    setVisKonfetti?: (visKonfetti: boolean) => void;
}

export const HendelseMåBekreftesKnapp = ({ hendelse, sak, setVisKonfetti }: Props) => {
    const [laster, setLaster] = useState(false);
    const [visBekreftelsesModal, setVisBekreftelsesModal] = useState(false)

    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(sak.orgnr)
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(sak.orgnr)

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.()
        mutateSamarbeidshistorikk?.()
    }

    const bekreftNyHendelsePåSak = () => {
        setLaster(true);
        nyHendelsePåSak(sak, hendelse)
            .then(mutateIASakerOgSamarbeidshistorikk)
            .then(() => {
                setVisKonfetti?.(true);
            })
            .finally(() => {
                setVisBekreftelsesModal(false);
                setLaster(false);
            });
        loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status);
    }

    return (
        <>
            <IASakshendelseKnapp laster={laster} hendelsesType={hendelse.saksHendelsestype} onClick={() => setVisBekreftelsesModal(true)} sak={sak} />
            <BekreftHendelseModal
                laster={laster}
                saksstatus={sak.status}
                åpen={visBekreftelsesModal}
                onConfirm={bekreftNyHendelsePåSak}
                onCancel={() => { setVisBekreftelsesModal(false) }}
                hendelse={hendelse}
            />
        </>
    );
}
