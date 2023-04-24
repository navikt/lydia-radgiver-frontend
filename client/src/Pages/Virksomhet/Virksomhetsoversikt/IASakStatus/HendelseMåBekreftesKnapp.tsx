import { GyldigNesteHendelse, IASak } from "../../../../domenetyper/domenetyper";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { BekreftHendelseModal } from "./BekreftHendelseModal";
import { useState } from "react";
import { nyHendelsePåSak, useHentAktivSakForVirksomhet, useHentSamarbeidshistorikk } from "../../../../api/lydia-api";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
}

export const HendelseMåBekreftesKnapp = ({hendelse, sak}: Props) => {
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
            .finally(() => setVisBekreftelsesModal(false))
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
