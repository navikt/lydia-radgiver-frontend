import { BodyShort, Button } from "@navikt/ds-react";
import {
    IAProsessStatusEnum,
    IAProsessStatusType,
    IASak,
} from "../../domenetyper";
import styled from "styled-components";
import { hentBadgeFraStatus } from "../Prioritering/StatusBadge";
import { HorizontalFlexboxDiv } from "../Prioritering/HorizontalFlexboxDiv";
import {iaSakHentHendelserPath, nyHendelsePåSak, opprettSak} from "../../api/lydia-api";
import { useState } from "react";
import {oversettNavnPåSakshendelsestype} from "./IASakshendelserOversikt";
import {mutate} from "swr";

export interface IASakOversiktProps {
    orgnummer: string;
    iaSak?: IASak;
}

interface IngenAktiveSakerProps {
    orgnummer: string;
    oppdaterSak: (iaSak: IASak) => void;
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
                onClick={() =>
                    opprettSak(orgnummer).then((sak) => oppdaterSak(sak))
                }
            >
                Vurderes
            </Button>
        </StyledIABakgrunn>
    );
}

export const IASakOversikt = ({ orgnummer, iaSak }: IASakOversiktProps) => {
    const [sak, setSak] = useState<IASak | undefined>(iaSak);

    const oppdaterSak = (sak: IASak) => {
        setSak(sak);
        mutate(`${iaSakHentHendelserPath}/${sak.saksnummer}`)
    };

    if (!sak)
        return (
            <IngenAktiveSaker orgnummer={orgnummer} oppdaterSak={oppdaterSak} />
        );

    return (
        <StyledIABakgrunn status={sak.status}>
            <BodyShort>
                <b>Saksnummer:</b> {sak.saksnummer}
            </BodyShort>
            <br />
            <BodyShort>Status: {hentBadgeFraStatus(sak.status).text}</BodyShort>
            {sak.eidAv && <BodyShort>Eier: {sak.eidAv}</BodyShort>}
            <br />
            <HorizontalFlexboxDiv>
                {sak.gyldigeNesteHendelser.map((hendelsestype) => {
                    return (
                        <Button
                            key={hendelsestype}
                            onClick={() => {
                                nyHendelsePåSak(sak, hendelsestype).then((sak) => {
                                        oppdaterSak(sak);
                                    }
                                );
                            }}
                        >
                            {oversettNavnPåSakshendelsestype(hendelsestype)}
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
