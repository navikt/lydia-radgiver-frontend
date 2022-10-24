import { useState } from "react";
import styled from "styled-components";
import { Detail } from "@navikt/ds-react";
import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IAProsessStatusType,
    IASak,
    IASakshendelseTypeEnum,
    RolleEnum
} from "../../domenetyper";
import { hentBakgrunnsFargeForIAStatus, penskrivIAStatus } from "../../components/Badge/StatusBadge";
import { nyHendelsePåSak, opprettSak, useHentBrukerinformasjon } from "../../api/lydia-api";
import { BegrunnelseModal } from "./BegrunnelseModal";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { SakshendelsesKnapper } from "./SakshendelsesKnapper";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";

interface IASakBakgrunnProps {
    status: IAProsessStatusType;
}

const Container = styled.div<IASakBakgrunnProps>`
  display: flex;
  flex-direction: column;
  gap: ${24 / 16}rem;

  height: fit-content;
  width: ${300 / 16}rem;
  min-width: ${300 / 16}rem;
  padding: ${24 / 16}rem;

  border-radius: 0 0 10px 10px;
  background-color: ${(props) => hentBakgrunnsFargeForIAStatus(props.status)};
  border: ${(props) => props.status === "FULLFØRT" ? "solid 1px #8F8F8F" : "none"};
`;

const Saksinfo = styled.div`
  display: grid;
  grid-template: auto auto auto / auto 1fr;
  row-gap: ${12 / 16}rem;
  column-gap: ${70 / 16}rem;
`;

const InfoTittel = styled(Detail)`
  font-weight: bold;
  min-width: ${44/16}rem;
`;

const InfoData = styled(Detail)`
  overflow-wrap: anywhere;
`;

interface IngenAktiveSakerProps {
    orgnummer: string;
    oppdaterSak: () => void;
}

function IngenAktiveSaker({orgnummer, oppdaterSak}: IngenAktiveSakerProps) {
    const {data: brukerInformasjon} = useHentBrukerinformasjon();
    return (
        <Container status={IAProsessStatusEnum.enum.IKKE_AKTIV}>
            <Saksinfo>
                <InfoTittel>Status</InfoTittel>
                <InfoData>{penskrivIAStatus(IAProsessStatusEnum.enum.IKKE_AKTIV)}</InfoData>
            </Saksinfo>
            {brukerInformasjon?.rolle === RolleEnum.enum.Superbruker ?
                <IASakshendelseKnapp
                    hendelsesType={IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES}
                    onClick={() =>
                        opprettSak(orgnummer).then(() => oppdaterSak())
                    }
                /> : null
            }
        </Container>
    );
}

export interface IASakOversiktProps {
    orgnummer: string;
    iaSak?: IASak;
    muterState?: () => void;
}

export const IASakOversikt = ({orgnummer, iaSak: sak, muterState}: IASakOversiktProps) => {
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

    const skalRendreModal = !!valgtHendelseMedÅrsak;
    const hendelseKreverBegrunnelse = (hendelse: GyldigNesteHendelse) =>
        hendelse.gyldigeÅrsaker.length > 0;
    return (
        <Container status={sak.status}>
            <Saksinfo>
                <InfoTittel>Status</InfoTittel>
                <InfoData>{penskrivIAStatus(sak.status)}</InfoData>
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
                onNyHendelseHandler={(hendelse) => hendelseKreverBegrunnelse(hendelse)
                    ? setValgtHendelseMedÅrsak(hendelse)
                    : nyHendelsePåSak(sak, hendelse).then(() =>
                        muterState?.()
                    )}
            />
            {valgtHendelseMedÅrsak && (
                <BegrunnelseModal
                    hendelse={valgtHendelseMedÅrsak}
                    åpen={skalRendreModal}
                    lagre={(valgtÅrsak) =>
                        nyHendelsePåSak(
                            sak,
                            valgtHendelseMedÅrsak,
                            valgtÅrsak
                        )
                            .then(() => muterState?.())
                            .finally(() =>
                                setValgtHendelseMedÅrsak(undefined)
                            )
                    }
                    onClose={() => setValgtHendelseMedÅrsak(undefined)}
                />
            )}
        </Container>
    );
};
