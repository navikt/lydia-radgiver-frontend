import styled from "styled-components";
import { BodyShort } from "@navikt/ds-react";
import { IngenAktiveSaker } from "./IngenAktiveSaker";
import {IASak, IASakshendelseTypeEnum} from "../../../../domenetyper/domenetyper";
import { StatusBadge } from "../../../../components/Badge/StatusBadge";
import { SakshendelsesKnapper } from "./EndreStatusKnappar/SakshendelsesKnapper";
import { NavIdentMedLenke } from "../../../../components/NavIdentMedLenke";
import { NavFarger } from "../../../../styling/farger";
import { BorderRadius } from "../../../../styling/borderRadius";
import { IngenAktivitetInfo } from "./IngenAktivitetInfo/IngenAktivitetInfo";
import { Konfetti } from "../../../../components/Konfetti/Konfetti";
import { useState } from "react";
import { mobileAndUp } from "../../../../styling/breakpoints";

export const IASakOversiktContainer = styled.div`
  flex: 1 ${300 / 16}rem;
  
  display: flex;
  flex-direction: column;
  gap: ${24 / 16}rem;

  height: fit-content;
  padding: ${24 / 16}rem;

  border-radius: ${BorderRadius.medium};
  background-color: ${NavFarger.backgroundSubtle};
`;

export const Saksinfo = styled.dl`
  display: flex;
  flex-direction: column;

  ${mobileAndUp} {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    row-gap: ${12 / 16}rem;
    column-gap: 1.5rem;
  }
`;

export const Saksinfotittel = styled(BodyShort).attrs({ as: "dt" })`
  font-weight: bold;
  min-width: ${44 / 16}rem;
`;

const InfoData = styled(BodyShort).attrs({ as: "dd" })`
  overflow-wrap: anywhere;
  margin-bottom: 0.5rem;

  ${mobileAndUp} {
    margin-bottom: 0;
  }
`;

export interface IASakOversiktProps {
    orgnummer: string;
    iaSak?: IASak;
}

export const IASakOversikt = ({ orgnummer, iaSak: sak }: IASakOversiktProps) => {
    const [visKonfetti, setVisKonfetti] = useState(false);
    if (!sak || sak.lukket) {
        return (
            <IngenAktiveSaker
                orgnummer={orgnummer}
            />
        );
    }

    const hendelserSomRepresentererKnapperISaksboksen= sak.gyldigeNesteHendelser
        .filter( hendelse =>
            hendelse.saksHendelsestype !== IASakshendelseTypeEnum.Enum.ENDRE_PROSESS
        );
    return (
        <IASakOversiktContainer>
            <Saksinfo>
                <Saksinfotittel>Status</Saksinfotittel>
                <InfoData>
                    <StatusBadge ariaLive="polite" ariaLabel="Status" status={sak.status} />
                </InfoData>
                {sak.eidAv &&
                    <>
                        <Saksinfotittel>Eier</Saksinfotittel>
                        <InfoData><NavIdentMedLenke navIdent={sak.eidAv} /></InfoData>
                    </>
                }
                <Saksinfotittel>Saksnr</Saksinfotittel>
                <InfoData>{sak.saksnummer}</InfoData>
            </Saksinfo>
            <SakshendelsesKnapper
                sak={sak}
                hendelser={hendelserSomRepresentererKnapperISaksboksen}
                setVisKonfetti={setVisKonfetti}
            />
            <IngenAktivitetInfo sak={sak} />
            {visKonfetti ? <Konfetti onComplete={() => setVisKonfetti(false)} /> : null}
        </IASakOversiktContainer>
    );
};
