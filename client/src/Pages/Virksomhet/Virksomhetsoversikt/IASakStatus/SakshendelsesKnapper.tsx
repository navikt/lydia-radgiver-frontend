import React, { ReactElement } from "react";
import { GyldigNesteHendelse, IASak, IASakshendelseTypeEnum } from "../../../../domenetyper/domenetyper";
import { erHendelsenDestruktiv, sorterHendelserPåKnappeType } from "./IASakshendelseKnapp";
import { IkkeAktuellKnapp } from "./IkkeAktuellKnapp";
import { HendelseMåBekreftesKnapp } from "./HendelseMåBekreftesKnapp";
import { RettTilNesteStatusKnapp } from "./RettTilNesteStatusKnapp";
import styled from "styled-components";

const rendreKnappForHendelse = (hendelse: GyldigNesteHendelse, sak: IASak): ReactElement => {
    switch (hendelse.saksHendelsestype) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return (
                <IkkeAktuellKnapp
                    sak={sak}
                    hendelse={hendelse}
                    key={hendelse.saksHendelsestype} />
            )
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
        case IASakshendelseTypeEnum.enum.TILBAKE:
            return (
                <HendelseMåBekreftesKnapp
                    sak={sak}
                    hendelse={hendelse}
                    key={hendelse.saksHendelsestype}
                />
            )
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return (
                <RettTilNesteStatusKnapp
                    sak={sak}
                    hendelse={hendelse}
                    key={hendelse.saksHendelsestype}
                />
            )
    }
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

const KnappeKolonner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
`;

interface SakshendelsesKnapperProps {
    sak: IASak;
    hendelser: GyldigNesteHendelse[];
}

export const SakshendelsesKnapper = ({sak, hendelser}: SakshendelsesKnapperProps) => {
    const destruktiveHendelser = hendelser
        .filter(hendelse => erHendelsenDestruktiv(hendelse.saksHendelsestype))
    const ikkeDestruktiveHendelser = hendelser
        .filter(hendelse => !erHendelsenDestruktiv(hendelse.saksHendelsestype))

    return (
        <Container>
            {[destruktiveHendelser, ikkeDestruktiveHendelser].map((hendelser) => {
                return (
                    <KnappeKolonner
                        key={hendelser.map(hendelse => hendelse.saksHendelsestype).join("-")}>
                        {hendelser.sort(sorterHendelserPåKnappeType)
                            .map((hendelse) =>
                                rendreKnappForHendelse(hendelse, sak)
                            )
                        }
                    </ KnappeKolonner>
                )
            })}
        </ Container>
    )
}
