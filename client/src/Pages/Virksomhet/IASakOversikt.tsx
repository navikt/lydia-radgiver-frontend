import { Alert, BodyShort, Button } from "@navikt/ds-react";
import {
    IAProsessStatusEnum,
    IAProsessStatusType,
    IASak,
} from "../../domenetyper";
import styled from "styled-components";
import { hentBadgeFraStatus } from "../Prioritering/StatusBadge";
import { HorizontalFlexboxDiv } from "../Prioritering/HorizontalFlexboxDiv";
import { nyHendelsePåSak, opprettSak } from "../../api/lydia-api";
import { useState } from "react";
import { useSWRConfig } from "swr";

export interface IASakOversiktProps {
    orgnummer: string;
    iaSak?: IASak;
}

interface IngenAktiveSakerProps {
    orgnummer: string;
    oppdaterSak: (iaSak: IASak) => void;
    oppdaterFeilmelding: (feilmelding: string) => void;
}

function IngenAktiveSaker({
    orgnummer,
    oppdaterSak,
    oppdaterFeilmelding,
}: IngenAktiveSakerProps) {
    return (
        <StyledIABakgrunn status={IAProsessStatusEnum.enum.IKKE_AKTIV}>
            <BodyShort>
                Status:{" "}
                {hentBadgeFraStatus(IAProsessStatusEnum.enum.IKKE_AKTIV).text}
            </BodyShort>
            <br />
            <Button
                onClick={() =>
                    opprettSak(orgnummer)
                        .then((sak) => oppdaterSak(sak))
                        .catch(() =>
                            oppdaterFeilmelding(
                                "Fikk ikke til å opprette IA-sak"
                            )
                        )
                }
            >
                Vurderes
            </Button>
        </StyledIABakgrunn>
    );
}

export const IASakOversikt = ({ orgnummer, iaSak }: IASakOversiktProps) => {
    const [sak, setSak] = useState<IASak | undefined>(iaSak);
    const [feilmelding, setFeilmelding] = useState<string>();

    const oppdaterSak = (sak: IASak) => setSak(sak);
    const oppdaterFeilmelding = (feilmelding: string) =>
        setFeilmelding(feilmelding);

    if (!sak)
        return (
            <IngenAktiveSaker
                orgnummer={orgnummer}
                oppdaterSak={oppdaterSak}
                oppdaterFeilmelding={oppdaterFeilmelding}
            />
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
                {sak.gyldigeNesteHendelser.map((hendelse) => {
                    return (
                        <Button
                            key={hendelse}
                            onClick={() => {
                                nyHendelsePåSak(sak, hendelse)
                                    .then((sak) => {
                                        const { cache } = useSWRConfig();
                                        console.log(cache.keys());
                                        return oppdaterSak(sak);
                                    })
                                    .catch(() =>
                                        oppdaterFeilmelding(
                                            "Fikk ikke til å oppdatere IA-saken"
                                        )
                                    );
                            }}
                        >
                            {hendelse}
                        </Button>
                    );
                })}
                {feilmelding && <Alert variant={"error"}>{feilmelding}</Alert>}
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
