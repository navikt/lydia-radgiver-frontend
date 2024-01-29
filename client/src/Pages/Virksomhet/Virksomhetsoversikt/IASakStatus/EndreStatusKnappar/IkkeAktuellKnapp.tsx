import { useState } from "react";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { BegrunnelseModal } from "../BegrunnelseModal";
import { GyldigNesteHendelse, IASak, ValgtÅrsakDto } from "../../../../../domenetyper/domenetyper";
import {
    nyHendelsePåSak,
    useHentAktivSakForVirksomhet,
    useHentLeveranser,
    useHentSamarbeidshistorikk
} from "../../../../../api/lydia-api";
import { loggStatusendringPåSak } from "../../../../../util/amplitude-klient";
import { FullførLeveranserFørstModal } from "../FullførLeveranserFørstModal";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
}

export const IkkeAktuellKnapp = ({ hendelse, sak }: Props) => {
    const { data: leveranserPåSak } = useHentLeveranser(sak.orgnr, sak.saksnummer);
    const harLeveranserSomErUnderArbeid = leveranserPåSak?.flatMap((iaTjeneste) => iaTjeneste.leveranser)
        .some((leveranse) => leveranse.status === "UNDER_ARBEID")
    const [visFullførLeveranserFørstModal, setVisFullførLeveranserFørstModal] = useState(false);

    const [laster, setLaster] = useState(false);
    const [visBegrunnelsesModal, setVisBegrunnelsesModal] = useState(false)

    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(sak.orgnr)
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(sak.orgnr)

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.()
        mutateSamarbeidshistorikk?.()
    }

    const lagreBegrunnelsePåSak = (valgtÅrsak: ValgtÅrsakDto) => {
        setLaster(true);
        nyHendelsePåSak(sak, hendelse, valgtÅrsak)
            .then(mutateIASakerOgSamarbeidshistorikk)
            .finally(() => {
                setVisBegrunnelsesModal(false);
                setLaster(false);
            })
        loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status)
    }

    if (harLeveranserSomErUnderArbeid) {
        return (
            <>
                <IASakshendelseKnapp
                    hendelsesType={hendelse.saksHendelsestype}
                    onClick={() => setVisFullførLeveranserFørstModal(true)}
                    sak={sak}
                />
                <FullførLeveranserFørstModal visModal={visFullførLeveranserFørstModal} lukkModal={() => setVisFullførLeveranserFørstModal(false)} />
            </>)
    }

    return (
        <>
            <IASakshendelseKnapp
                laster={laster}
                hendelsesType={hendelse.saksHendelsestype}
                onClick={() => setVisBegrunnelsesModal(true)}
                sak={sak}
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
