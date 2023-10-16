import { useState } from "react";
import { GyldigNesteHendelse, IASak } from "../../../../../domenetyper/domenetyper";
import { HendelseMåBekreftesKnapp } from "./HendelseMåBekreftesKnapp";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { useHentLeveranser } from "../../../../../api/lydia-api";
import { FullførLeveranserFørstModal } from "../FullførLeveranserFørstModal";
import { LeggTilLeveranserFørstModal } from "../LeggTilLeveranserFørstModal";
import { erIDev } from "../../../../../components/Dekoratør/Dekoratør";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
}

export const FullførKnapp = ({ hendelse, sak }: Props) => {
    const { data: leveranserPåSak } = useHentLeveranser(sak.orgnr, sak.saksnummer);
    const ikkeHarLeveranser = !leveranserPåSak?.length;
    const harLeveranserSomErUnderArbeid = leveranserPåSak?.flatMap((iaTjeneste) => iaTjeneste.leveranser)
        .some((leveranse) => leveranse.status === "UNDER_ARBEID")
    const [visModal, setVisModal] = useState(false);

    if (erIDev && ikkeHarLeveranser) {
        return (
            <>
                <IASakshendelseKnapp
                    hendelsesType={hendelse.saksHendelsestype}
                    onClick={() => setVisModal(true)}
                />
                <LeggTilLeveranserFørstModal visModal={visModal} lukkModal={() => setVisModal(false)} />
            </>
        )
    }
    if (harLeveranserSomErUnderArbeid) {
        return (
            <>
                <IASakshendelseKnapp
                    hendelsesType={hendelse.saksHendelsestype}
                    onClick={() => setVisModal(true)}
                />
                <FullførLeveranserFørstModal visModal={visModal} lukkModal={() => setVisModal(false)} />
            </>)
    }

    return (
        <HendelseMåBekreftesKnapp hendelse={hendelse} sak={sak} />
    )
}
