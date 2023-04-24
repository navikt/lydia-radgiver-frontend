import { CSSProperties } from "react";
import { GyldigNesteHendelse, IASak, IASakshendelseTypeEnum } from "../../../../domenetyper/domenetyper";
import { erHendelsenDestruktiv, IASakshendelseKnapp, sorterHendelserPåKnappeType } from "./IASakshendelseKnapp";
import { nyHendelsePåSak, useHentAktivSakForVirksomhet, useHentSamarbeidshistorikk } from "../../../../api/lydia-api";
import { IkkeAktuellKnapp } from "./IkkeAktuellKnapp";
import { HendelseMåBekreftesKnapp } from "./HendelseMåBekreftesKnapp";

const horisontalKnappeStyling: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "0.5rem"
};

interface SakshendelsesKnapperProps {
    sak: IASak;
    hendelser: GyldigNesteHendelse[];
}

export const SakshendelsesKnapper = ({sak, hendelser}: SakshendelsesKnapperProps) => {
    const destruktiveHendelser = hendelser
        .filter(hendelse => erHendelsenDestruktiv(hendelse.saksHendelsestype))
    const ikkeDestruktiveHendelser = hendelser
        .filter(hendelse => !erHendelsenDestruktiv(hendelse.saksHendelsestype))

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
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            {
                [destruktiveHendelser, ikkeDestruktiveHendelser].map((hendelser) => {
                    return <div style={horisontalKnappeStyling}
                                key={hendelser.map(hendelse => hendelse.saksHendelsestype).join("-")}>
                        {hendelser
                            .sort(sorterHendelserPåKnappeType)
                            .map((hendelse) => {
                                switch (hendelse.saksHendelsestype) {
                                    case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
                                    case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
                                    case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
                                    case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
                                    case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
                                    case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
                                    case IASakshendelseTypeEnum.enum.SLETT_SAK:
                                        return (
                                            <IASakshendelseKnapp
                                                key={hendelse.saksHendelsestype}
                                                hendelsesType={hendelse.saksHendelsestype}
                                                onClick={() => trykkPåSakhendelsesknapp(hendelse)}
                                            />
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
                                    case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
                                        return (
                                            <IkkeAktuellKnapp
                                                sak={sak}
                                                hendelse={hendelse}
                                                key={hendelse.saksHendelsestype} />
                                        )
                                }
                            })
                        }
                    </div>
                })
            }
        </div>
    )
}
