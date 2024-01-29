import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import React from "react";
import { GyldigNesteHendelse, IASak } from "../../../../../domenetyper/domenetyper";
import { nyHendelsePåSak, useHentAktivSakForVirksomhet, useHentSamarbeidshistorikk } from "../../../../../api/lydia-api";
import { loggStatusendringPåSak } from "../../../../../util/amplitude-klient";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
}

export const RettTilNesteStatusKnapp = ({ hendelse, sak }: Props) => {
    const [laster, setLaster] = React.useState(false);
    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(sak.orgnr)
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(sak.orgnr)

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.()
        mutateSamarbeidshistorikk?.()
    }

    const trykkPåSakhendelsesknapp = (hendelse: GyldigNesteHendelse) => {
        setLaster(true);
        nyHendelsePåSak(sak, hendelse).then(mutateIASakerOgSamarbeidshistorikk).finally(() => setLaster(false));
        loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status)
    }

    return (
        <IASakshendelseKnapp
            laster={laster}
            key={hendelse.saksHendelsestype}
            hendelsesType={hendelse.saksHendelsestype}
            onClick={() => trykkPåSakhendelsesknapp(hendelse)}
            sak={sak}
            />
    )
}