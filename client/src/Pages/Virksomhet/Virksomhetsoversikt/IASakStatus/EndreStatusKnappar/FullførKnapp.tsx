import { useState } from "react";
import { GyldigNesteHendelse, IASak } from "../../../../../domenetyper/domenetyper";
import { HendelseMåBekreftesKnapp } from "./HendelseMåBekreftesKnapp";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { useHentLeveranser } from "../../../../../api/lydia-api";
import { FullførLeveranserFørstModal } from "../FullførLeveranserFørstModal";
import { LeggTilLeveranserFørstModal } from "../LeggTilLeveranserFørstModal";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
    setVisKonfetti?: (visKonfetti: boolean) => void;
}

export const FullførKnapp = ({ hendelse, sak, setVisKonfetti }: Props) => {
    const { data: leveranserPåSak } = useHentLeveranser(sak.orgnr, sak.saksnummer);
    const ingenLeveranser = !leveranserPåSak?.length;
    const harLeveranserSomErUnderArbeid = leveranserPåSak?.flatMap((iaTjeneste) => iaTjeneste.leveranser)
        .some((leveranse) => leveranse.status === "UNDER_ARBEID")
    const [visModal, setVisModal] = useState(false);

    if (ingenLeveranser) {
        return (
            <>
                <IASakshendelseKnapp
                    hendelsesType={hendelse.saksHendelsestype}
                    onClick={() => setVisModal(true)}
                    sak={sak}
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
                    sak={sak}
                />
                <FullførLeveranserFørstModal visModal={visModal} lukkModal={() => setVisModal(false)} />
            </>)
    }

    return (
        <HendelseMåBekreftesKnapp hendelse={hendelse} sak={sak} setVisKonfetti={setVisKonfetti} />
    )
}
