import { useState } from "react";
import styled from "styled-components";
import { BodyShort } from "@navikt/ds-react";
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

export interface IASakOversiktProps {
    orgnummer: string;
    iaSak?: IASak;
    muterState?: () => void;
}

interface IngenAktiveSakerProps {
    orgnummer: string;
    oppdaterSak: () => void;
}

function IngenAktiveSaker({orgnummer, oppdaterSak}: IngenAktiveSakerProps) {
    const {data: brukerInformasjon} = useHentBrukerinformasjon();
    return (
        <StyledIABakgrunn status={IAProsessStatusEnum.enum.IKKE_AKTIV}>
            <BodyShort>
                Status:{" "}
                {penskrivIAStatus(IAProsessStatusEnum.enum.IKKE_AKTIV)}
            </BodyShort>
            <br />
            {brukerInformasjon?.rolle === RolleEnum.enum.Superbruker ?
                <IASakshendelseKnapp
                    hendelsesType={IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES}
                    onClick={() =>
                        opprettSak(orgnummer).then(() => oppdaterSak())
                    }
                /> : null
            }
        </StyledIABakgrunn>
    );
}

export const IASakOversikt = ({
    orgnummer,
    iaSak: sak,
    muterState,
}: IASakOversiktProps) => {
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
        <StyledIABakgrunn status={sak.status}>
            <BodyShort>
                <b>Saksnummer:</b> {sak.saksnummer}
            </BodyShort>
            <br />
            <BodyShort>Status: {penskrivIAStatus(sak.status)}</BodyShort>
            {sak.eidAv && <BodyShort>Rådgiver: <NavIdentMedLenke navIdent={sak.eidAv} /></BodyShort>}
            <br />
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
        </StyledIABakgrunn>
    );
};

interface IASakBakgrunnProps {
    status: IAProsessStatusType;
}

const StyledIABakgrunn = styled.div<IASakBakgrunnProps>`
  padding: 1rem;
  flex: 1;
  border-radius: 0 0 10px 10px;
  background-color: ${(props) => hentBakgrunnsFargeForIAStatus(props.status)};
`;
