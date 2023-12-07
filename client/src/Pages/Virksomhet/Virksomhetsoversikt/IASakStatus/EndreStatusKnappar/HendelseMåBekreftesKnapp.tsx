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

export const HendelseMåBekreftesKnapp = ({hendelse, sak, setVisKonfetti}: Props) => {
    const [visBekreftelsesModal, setVisBekreftelsesModal] = useState(false)

    const {mutate: mutateSamarbeidshistorikk} = useHentSamarbeidshistorikk(sak.orgnr)
    const {mutate: mutateHentSaker} = useHentAktivSakForVirksomhet(sak.orgnr)

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.()
        mutateSamarbeidshistorikk?.()
    }

    const bekreftNyHendelsePåSak = () => {
        nyHendelsePåSak(sak, hendelse)
            .then(mutateIASakerOgSamarbeidshistorikk)
            .finally(() => {
                setVisKonfetti?.(true);
                setVisBekreftelsesModal(false);
            });
        loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status);
    }

    return (
        <>
            <IASakshendelseKnapp hendelsesType={hendelse.saksHendelsestype} onClick={() => setVisBekreftelsesModal(true)} />
            <BekreftHendelseModal
                saksstatus={sak.status}
                åpen={visBekreftelsesModal}
                onConfirm={bekreftNyHendelsePåSak}
                onCancel={() => {setVisBekreftelsesModal(false)}}
                hendelse={hendelse}
            />
        </>
    );
}
