import {Alert, BodyShort, Button} from "@navikt/ds-react";
import {IAProsessStatusEnum, IASak} from "../../domenetyper";
import styled from "styled-components";
import {hentBadgeFraStatus} from "../Prioritering/StatusBadge";
import {HorizontalFlexboxDiv} from "../Prioritering/HorizontalFlexboxDiv";
import {nyHendelsePåSak, opprettSak} from "../../api/lydia-api";
import {useState} from "react";

export interface IASakOversiktProps {
    orgnummer: string,
    iaSak?: IASak,
    className?: string,
}

interface IngenAktiveSakerProps {
    className?: string,
    orgnummer: string,
    oppdaterSak: (iaSak: IASak) => void
    oppdaterFeilmelding: (feilmelding: string) => void
}


function IngenAktiveSaker({className, orgnummer, oppdaterSak, oppdaterFeilmelding}: IngenAktiveSakerProps) {

    return (
        <div className={className}>
            <BodyShort>
                Status: {hentBadgeFraStatus(IAProsessStatusEnum.enum.IKKE_AKTIV).text}
            </BodyShort>
            <br/>
            <Button onClick={() =>
                opprettSak(orgnummer)
                    .then(sak => oppdaterSak(sak))
                    .catch(() => oppdaterFeilmelding("Fikk ikke til å opprette IA-sak"))
            }>Vurderes</Button>
        </div>
    )
}

const IASakOversikt = ({orgnummer, iaSak, className}: IASakOversiktProps) => {
    const [sak, setSak] = useState<IASak | undefined>(iaSak)
    const [feilmelding, setFeilmelding] = useState<string>();

    const oppdaterSak = (sak: IASak) => setSak(sak)
    const oppdaterFeilmelding = (feilmelding: string) => setFeilmelding(feilmelding)

    if (!sak)
        return (<IngenAktiveSaker className={className} orgnummer={orgnummer} oppdaterSak={oppdaterSak}
                                  oppdaterFeilmelding={oppdaterFeilmelding}/>)


    return (
        <div className={className}>
            <p><b>Saksnummer:</b> {sak.saksnummer}</p>
            <p>Status: {hentBadgeFraStatus(sak.status).text}</p>
            {sak.eidAv && <p>Eier: {sak.eidAv}</p>}
            <HorizontalFlexboxDiv>
                {sak.gyldigeNesteHendelser.map(hendelse => {
                    return <Button key={hendelse} onClick={() => {
                        nyHendelsePåSak(sak, hendelse)
                            .then(sak => oppdaterSak(sak))
                            .catch(() => oppdaterFeilmelding("Fikk ikke til å oppdatere IA-saken"))
                    }
                    }>{hendelse}</Button>
                })}
                {feilmelding && <Alert variant={"error"}>{feilmelding}</Alert>}
            </HorizontalFlexboxDiv>
        </div>
    )
}

export const StyledIaSakOversikt = styled(IASakOversikt)`
    padding: 1rem;
    width: 100%;
    border-radius: 0px 0px 10px 10px;
    background-color: ${props => hentBadgeFraStatus(props.iaSak?.status || IAProsessStatusEnum.enum.IKKE_AKTIV).backgroundColor};
`
