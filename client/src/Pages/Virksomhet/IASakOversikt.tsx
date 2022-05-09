import { BodyShort, Button } from "@navikt/ds-react";
import {
    IAProsessStatusEnum,
    IAProsessStatusType,
    IASak,
} from "../../domenetyper";
import styled from "styled-components";
import { hentBadgeFraStatus } from "../Prioritering/StatusBadge";
import { HorizontalFlexboxDiv } from "../Prioritering/HorizontalFlexboxDiv";
import { nyHendelsePåSak, opprettSak } from "../../api/lydia-api";
import { oversettNavnPåSakshendelsestype } from "./IASakshendelserOversikt";

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
    if (!sak)
        return (
            <IngenAktiveSaker
                orgnummer={orgnummer}
                oppdaterSak={() => {
                    muterState?.();
                }}
            />
        );

    return (
        <StyledIABakgrunn status={sak.status}>
            <BodyShort>
                <b>Saksnummer:</b> {sak.saksnummer}
            </BodyShort>
            <br />
            <BodyShort>Status: {hentBadgeFraStatus(sak.status).text}</BodyShort>
            {sak.eidAv && <BodyShort>Kontaktperson: {sak.eidAv}</BodyShort>}
            <br />
            <HorizontalFlexboxDiv>
                {sak.gyldigeNesteHendelser.map((hendelse) => {
                    return (
                        <Button
                            key={hendelse.saksHendelsestype}
                            onClick={() => {
                                nyHendelsePåSak(sak, hendelse).then(() =>
                                    muterState?.()
                                );
                            }}
                            variant={oversettNavnPåSakshendelsestype(
                                hendelse.saksHendelsestype
                            ).buttonVariant}
                        >
                            {oversettNavnPåSakshendelsestype(
                                hendelse.saksHendelsestype
                            ).text}
                        </Button>
                    );
                })}
            </HorizontalFlexboxDiv>
        </StyledIABakgrunn>
    );
};

interface IASakBakgrunnProps {
    status: IAProsessStatusType;
}

const StyledIABakgrunn = styled.div<IASakBakgrunnProps>`
    padding: 1rem;
    border-radius: 0px 0px 10px 10px;
    background-color: ${(props) =>
        hentBadgeFraStatus(props.status).backgroundColor};
`;
