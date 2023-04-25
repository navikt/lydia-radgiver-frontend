import { useState } from "react";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { BegrunnelseModal } from "../BegrunnelseModal";
import { GyldigNesteHendelse, IASak, ValgtÅrsakDto } from "../../../../../domenetyper/domenetyper";
import { nyHendelsePåSak, useHentAktivSakForVirksomhet, useHentSamarbeidshistorikk } from "../../../../../api/lydia-api";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
}

export const IkkeAktuellKnapp = ({hendelse, sak}: Props) => {
    const [visBegrunnelsesModal, setVisBegrunnelsesModal] = useState(false)

    const {mutate: mutateSamarbeidshistorikk} = useHentSamarbeidshistorikk(sak.orgnr)
    const {mutate: mutateHentSaker} = useHentAktivSakForVirksomhet(sak.orgnr)

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.()
        mutateSamarbeidshistorikk?.()
    }

    const lagreBegrunnelsePåSak = (valgtÅrsak: ValgtÅrsakDto) => {
        nyHendelsePåSak(sak, hendelse, valgtÅrsak)
            .then(mutateIASakerOgSamarbeidshistorikk)
            .finally(() => setVisBegrunnelsesModal(false))
    }

    return (
        <>
            <IASakshendelseKnapp
                hendelsesType={hendelse.saksHendelsestype}
                onClick={() => setVisBegrunnelsesModal(true)}
            />
            <BegrunnelseModal
                hendelse={hendelse}
                åpen={visBegrunnelsesModal}
                lagre={lagreBegrunnelsePåSak}
                onClose={() => setVisBegrunnelsesModal(false)}
            />
        </>
    )
}
