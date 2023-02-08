import { useState } from "react";
import styled from "styled-components";
import { BodyShort } from "@navikt/ds-react";
import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IASak,
    IASakshendelseTypeEnum, ValgtÅrsakDto
} from "../../../../domenetyper/domenetyper";
import { StatusBadge } from "../../../../components/Badge/StatusBadge";
import { nyHendelsePåSak, opprettSak, useHentBrukerinformasjon } from "../../../../api/lydia-api";
import { BegrunnelseModal } from "./BegrunnelseModal";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { SakshendelsesKnapper } from "./SakshendelsesKnapper";
import { NavIdentMedLenke } from "../../../../components/NavIdentMedLenke";
import { NavFarger } from "../../../../styling/farger";
import { BorderRadius } from "../../../../styling/borderRadius";
import { RolleEnum } from "../../../../domenetyper/brukerinformasjon";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${24 / 16}rem;

  height: fit-content;
  width: ${300 / 16}rem;
  min-width: ${300 / 16}em;
  padding: ${24 / 16}rem;

  border-radius: ${BorderRadius.medium};
  background-color: ${NavFarger.canvasBackground};
`;

const Saksinfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  row-gap: ${12 / 16}rem;
  column-gap: 3rem;
`;

const InfoTittel = styled(BodyShort)`
  font-weight: bold;
  min-width: ${44 / 16}rem;
`;

const InfoData = styled(BodyShort)`
  overflow-wrap: anywhere;
`;

const VurderesKnappContainer = styled.div`
  display: flex;
  justify-content: end;
`;

interface IngenAktiveSakerProps {
    orgnummer: string;
    oppdaterSak: () => void;
}

const IngenAktiveSaker = ({ orgnummer, oppdaterSak }: IngenAktiveSakerProps) => {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    return (
        <Container>
            <Saksinfo>
                <InfoTittel>Status</InfoTittel>
                <StatusBadge status={IAProsessStatusEnum.enum.IKKE_AKTIV} />
            </Saksinfo>
            {brukerInformasjon?.rolle === RolleEnum.enum.Superbruker ?
                <VurderesKnappContainer>
                    <IASakshendelseKnapp
                        hendelsesType={IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES}
                        onClick={() =>
                            opprettSak(orgnummer).then(() => oppdaterSak())
                        }
                    />
                </VurderesKnappContainer>
                : null
            }
        </Container>
    );
}

export interface IASakOversiktProps {
    orgnummer: string;
    iaSak?: IASak;
    muterState?: () => void;
}

export const IASakOversikt = ({ orgnummer, iaSak: sak, muterState }: IASakOversiktProps) => {
    const [valgtHendelseMedÅrsak, setValgtHendelseMedÅrsak] =
        useState<GyldigNesteHendelse>();

    if (!sak || sak.lukket)
        return (
            <IngenAktiveSaker
                orgnummer={orgnummer}
                oppdaterSak={() => {
                    muterState?.();
                }}
            />
        );

    const onNyHendelseHandler = (hendelse: GyldigNesteHendelse) => {
        hendelseKreverBegrunnelse(hendelse)
            ? setValgtHendelseMedÅrsak(hendelse)
            : nyHendelsePåSak(sak, hendelse).then(() =>
                muterState?.()
            )
    }

    const skalRendreModal = !!valgtHendelseMedÅrsak;
    const hendelseKreverBegrunnelse = (hendelse: GyldigNesteHendelse) =>
        hendelse.gyldigeÅrsaker.length > 0;

    const lagreBegrunnelse = (valgtÅrsak: ValgtÅrsakDto) => {
        if (!valgtHendelseMedÅrsak) {
            return new Error(`Kan ikke lagre begrunnelse på denne hendelsen. Hendelse: ${valgtHendelseMedÅrsak}`)
        }
        nyHendelsePåSak(sak, valgtHendelseMedÅrsak, valgtÅrsak)
            .then(() => muterState?.())
            .finally(() =>
                setValgtHendelseMedÅrsak(undefined)
            )
    }

    return (
        <Container>
            <Saksinfo>
                <InfoTittel>Status</InfoTittel>
                <StatusBadge status={sak.status} />
                {sak.eidAv &&
                    <>
                        <InfoTittel>Eier</InfoTittel>
                        <InfoData><NavIdentMedLenke navIdent={sak.eidAv} /></InfoData>
                    </>
                }
                <InfoTittel>Saksnr</InfoTittel>
                <InfoData>{sak.saksnummer}</InfoData>
            </Saksinfo>
            <SakshendelsesKnapper
                sak={sak}
                hendelser={sak.gyldigeNesteHendelser}
                onNyHendelseHandler={onNyHendelseHandler}
            />
            {valgtHendelseMedÅrsak && (
                <BegrunnelseModal
                    hendelse={valgtHendelseMedÅrsak}
                    åpen={skalRendreModal}
                    lagre={lagreBegrunnelse}
                    onClose={() => setValgtHendelseMedÅrsak(undefined)}
                />
            )}
        </Container>
    );
};
