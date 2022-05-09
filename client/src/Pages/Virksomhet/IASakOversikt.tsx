import { BodyShort, Button } from "@navikt/ds-react";
import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IAProsessStatusType,
    IASak,
} from "../../domenetyper";
import styled from "styled-components";
import { hentBadgeFraStatus } from "../Prioritering/StatusBadge";
import { HorizontalFlexboxDiv } from "../Prioritering/HorizontalFlexboxDiv";
import { nyHendelsePåSak, opprettSak } from "../../api/lydia-api";
import { useState } from "react";
import { BegrunnelseModal } from "./BegrunnelseModal";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";

export interface IASakOversiktProps {
    orgnummer: string;
    iaSak?: IASak;
    muterState?: () => void;
}

interface IngenAktiveSakerProps {
    orgnummer: string;
    oppdaterSak: () => void;
}

function IngenAktiveSaker({ orgnummer, oppdaterSak }: IngenAktiveSakerProps) {
    return (
        <StyledIABakgrunn status={IAProsessStatusEnum.enum.IKKE_AKTIV}>
            <BodyShort>
                Status:{" "}
                {hentBadgeFraStatus(IAProsessStatusEnum.enum.IKKE_AKTIV).text}
            </BodyShort>
            <br />
            <Button
                onClick={() => opprettSak(orgnummer).then(() => oppdaterSak())}
            >
                Vurderes
            </Button>
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

    if (!sak)
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
            <BodyShort>Status: {hentBadgeFraStatus(sak.status).text}</BodyShort>
            {sak.eidAv && <BodyShort>Rådgiver: {sak.eidAv}</BodyShort>}
            <br />
            <HorizontalFlexboxDiv>
                {sak.gyldigeNesteHendelser.map((hendelse) => {
                    return (
                        <IASakshendelseKnapp
                            key={hendelse.saksHendelsestype}
                            hendelse={hendelse}
                            onClick={() =>
                                hendelseKreverBegrunnelse(hendelse)
                                    ? setValgtHendelseMedÅrsak(hendelse)
                                    : nyHendelsePåSak(sak, hendelse).then(() =>
                                          muterState?.()
                                      )
                            }
                        />
                    );
                })}
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
            </HorizontalFlexboxDiv>
        </StyledIABakgrunn>
    );
};

interface IASakBakgrunnProps {
    status: IAProsessStatusType;
}

const StyledIABakgrunn = styled.div<IASakBakgrunnProps>`
    padding: 1rem;
    flex: 1;
    border-radius: 0px 0px 10px 10px;
    background-color: ${(props) =>
        hentBadgeFraStatus(props.status).backgroundColor};
`;
