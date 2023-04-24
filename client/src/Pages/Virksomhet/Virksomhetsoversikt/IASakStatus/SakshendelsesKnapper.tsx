import { CSSProperties, useState } from "react";
import { GyldigNesteHendelse, IASak, IASakshendelseTypeEnum, ValgtÅrsakDto } from "../../../../domenetyper/domenetyper";
import { erHendelsenDestruktiv, IASakshendelseKnapp, sorterHendelserPåKnappeType } from "./IASakshendelseKnapp";
import { BekreftHendelseModal } from "./BekreftHendelseModal";
import { BegrunnelseModal } from "./BegrunnelseModal";
import { nyHendelsePåSak, useHentAktivSakForVirksomhet, useHentSamarbeidshistorikk } from "../../../../api/lydia-api";

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
    const [hendelseSomMåBekreftes, setHendelseSomMåBekreftes] = useState<GyldigNesteHendelse | null>(null)
    const [hendelseSomMåBegrunnes, setHendelseSomMåBegrunnes] = useState<GyldigNesteHendelse | null>(null);

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
        const erEnHendelseSomMåBekreftes = hendelse.saksHendelsestype === IASakshendelseTypeEnum.enum.TILBAKE
            || hendelse.saksHendelsestype === IASakshendelseTypeEnum.enum.FULLFØR_BISTAND
        const erEnHendelseSomMåBegrunnes = hendelse.gyldigeÅrsaker.length > 0;

        if (erEnHendelseSomMåBekreftes) {
            setHendelseSomMåBekreftes(hendelse) // åpne modal
        } else if (erEnHendelseSomMåBegrunnes) {
            setHendelseSomMåBegrunnes(hendelse) // åpne modal
        } else {
            nyHendelsePåSak(sak, hendelse).then(mutateIASakerOgSamarbeidshistorikk)
        }
    }

    const bekreftNyHendelsePåSak = () => {
        hendelseSomMåBekreftes && nyHendelsePåSak(sak, hendelseSomMåBekreftes)
            .then(mutateIASakerOgSamarbeidshistorikk)
            .finally(() => setHendelseSomMåBekreftes(null))
    }

    const lagreBegrunnelsePåSak = (valgtÅrsak: ValgtÅrsakDto) => {
        if (!hendelseSomMåBegrunnes) {
            return new Error(`Kan ikke lagre begrunnelse på denne hendelsen. Hendelse: ${hendelseSomMåBegrunnes}`)
        }
        nyHendelsePåSak(sak, hendelseSomMåBegrunnes, valgtÅrsak)
            .then(mutateIASakerOgSamarbeidshistorikk)
            .finally(() => setHendelseSomMåBegrunnes(null))
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
                                return (
                                    <IASakshendelseKnapp
                                        key={hendelse.saksHendelsestype}
                                        hendelsesType={hendelse.saksHendelsestype}
                                        onClick={() => trykkPåSakhendelsesknapp(hendelse)}
                                    />
                                );
                            })
                        }
                    </div>
                })
            }
            {hendelseSomMåBekreftes && (
                <BekreftHendelseModal
                    saksstatus={sak.status}
                    åpen={true}
                    onConfirm={bekreftNyHendelsePåSak}
                    onCancel={() => {setHendelseSomMåBekreftes(null)}}
                    hendelse={hendelseSomMåBekreftes}
                />
            )}
            {hendelseSomMåBegrunnes && (
                <BegrunnelseModal
                    hendelse={hendelseSomMåBegrunnes}
                    åpen={true}
                    lagre={lagreBegrunnelsePåSak}
                    onClose={() => setHendelseSomMåBegrunnes(null)}
                />
            )}
        </div>
    )
}
