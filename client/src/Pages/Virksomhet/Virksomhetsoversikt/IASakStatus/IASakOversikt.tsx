import styled from "styled-components";
import { BodyShort } from "@navikt/ds-react";
import { IngenAktiveSaker } from "./IngenAktiveSaker";
import { IASak } from "../../../../domenetyper/domenetyper";
import { StatusBadge } from "../../../../components/Badge/StatusBadge";
import { SakshendelsesKnapper } from "./EndreStatusKnappar/SakshendelsesKnapper";
import { NavIdentMedLenke } from "../../../../components/NavIdentMedLenke";
import { NavFarger } from "../../../../styling/farger";
import { BorderRadius } from "../../../../styling/borderRadius";

export const IASakOversiktContainer = styled.div`
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

export const Saksinfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  row-gap: ${12 / 16}rem;
  column-gap: 3rem;
`;

export const InfoTittel = styled(BodyShort)`
  font-weight: bold;
  min-width: ${44 / 16}rem;
`;

const InfoData = styled(BodyShort)`
  overflow-wrap: anywhere;
`;

export interface IASakOversiktProps {
    orgnummer: string;
    iaSak?: IASak;
}

export const IASakOversikt = ({ orgnummer, iaSak: sak }: IASakOversiktProps) => {
    if (!sak || sak.lukket) {
        return (
            <IngenAktiveSaker
                orgnummer={orgnummer}
            />
        );
    }

    return (
        <IASakOversiktContainer>
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
            />
        </IASakOversiktContainer>
    );
};
