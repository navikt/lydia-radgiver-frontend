import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import React from "react";
import { GyldigNesteHendelse, IASak } from "../../../../domenetyper/domenetyper";
import { nyHendelsePåSak, useHentAktivSakForVirksomhet, useHentSamarbeidshistorikk } from "../../../../api/lydia-api";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
}

export const RettTilNesteStatusKnapp = ({hendelse, sak}: Props) => {
    const {mutate: mutateSamarbeidshistorikk} = useHentSamarbeidshistorikk(sak.orgnr)
    const {mutate: mutateHentSaker} = useHentAktivSakForVirksomhet(sak.orgnr)

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.()
        mutateSamarbeidshistorikk?.()
    }

    const trykkPåSakhendelsesknapp = (hendelse: GyldigNesteHendelse) => {
        nyHendelsePåSak(sak, hendelse).then(mutateIASakerOgSamarbeidshistorikk)
    }

    return (
        <IASakshendelseKnapp
            key={hendelse.saksHendelsestype}
            hendelsesType={hendelse.saksHendelsestype}
            onClick={() => trykkPåSakhendelsesknapp(hendelse)}
        />
    )
}