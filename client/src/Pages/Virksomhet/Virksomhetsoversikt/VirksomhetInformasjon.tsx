import styled from "styled-components";
import {BodyShort, HelpText} from "@navikt/ds-react";
import { NavFarger } from "../../../styling/farger";
import { BorderRadius } from "../../../styling/borderRadius";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { useHentSalesforceUrl } from "../../../api/lydia-api";
import { EksternLenke } from "../../../components/EksternLenke";

const Container = styled.div`
  flex: 14 20rem;
  height: fit-content;

  padding: 1.5rem;
  border: 1px solid ${NavFarger.borderMuted};
  border-radius: ${BorderRadius.medium};
  
  container-type: inline-size; // Gjer det mogleg å style andre element basert på breidda til denne komponenten
`;

const Info = styled.dl`
  display: flex;
  flex-direction: column;
  
  // Om virksomhetsinfo-boksen er over 400px-i-rem brei
  @container (min-width: ${400 / 16}rem) {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    row-gap: 0.5rem;
    column-gap: 1.5rem;
  }
`;

const InfoTittel = styled(BodyShort).attrs({ as: "dt" })`
  font-weight: bold;
`;

const InfoData = styled(BodyShort).attrs({ as: "dd" })`
  overflow-wrap: anywhere;
  
  // Gjer at det blir avstand mellom ulike info-element når virksomhetsinfo-boksen er liten
  margin-bottom: 0.5rem;

  @container (min-width: 400px) {
    margin-bottom: 0;
  }
`;

const TittelMedHelpTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const SalesforceLenke = styled(EksternLenke)`
  padding-top: calc(0.5rem + 1em);
`;

interface Props {
    virksomhet: Virksomhet;
    className?: string;
}

export const VirksomhetInformasjon = ({ virksomhet, className }: Props) => {
    const adresse = virksomhet.adresse.join(', ');
    const capitalizedLabel = (label: string) => {
        const lowerCasedLabel: string = label.toLowerCase()
        return lowerCasedLabel[0].toUpperCase() + lowerCasedLabel.slice(1)
    }

    const {
        data: salesforceInfo,
    } = useHentSalesforceUrl(virksomhet.orgnr)

    return (
        <Container>
            <Info className={className}>
                <InfoTittel>Orgnummer</InfoTittel>
                <InfoData>{virksomhet.orgnr}</InfoData>
                <InfoTittel>Adresse</InfoTittel>
                <InfoData>{adresse}, {virksomhet.postnummer} {virksomhet.poststed}</InfoData>
                {virksomhet.bransje &&
                    <>
                        <InfoTittel>Bransje</InfoTittel>
                        <InfoData>{capitalizedLabel(virksomhet.bransje)}</InfoData>
                    </>
                }
                <InfoTittel>Næring</InfoTittel>
                <InfoData>
                    {`${virksomhet.næring.navn} (${virksomhet.næring.kode})`}
                </InfoData>
                <InfoTittel>Næringsundergruppe{virksomhet.næringsundergruppe2 && "r"}</InfoTittel>
                <InfoData>
                    {virksomhet.næringsundergruppe1.navn} ({virksomhet.næringsundergruppe1.kode})
                    {virksomhet.næringsundergruppe2 && `, ${virksomhet.næringsundergruppe2.navn} (${virksomhet.næringsundergruppe2.kode})`}
                    {virksomhet.næringsundergruppe3 && `, ${virksomhet.næringsundergruppe3.navn} (${virksomhet.næringsundergruppe3.kode})`}
                </InfoData>
                {virksomhet.sektor &&
                    (<>
                        <InfoTittel>Sektor</InfoTittel>
                        <InfoData>{virksomhet.sektor}</InfoData>
                    </>)
                }
                {salesforceInfo && salesforceInfo.partnerStatus &&
                    <>
                        <TittelMedHelpTextContainer>
                            <InfoTittel>
                                Partner avtale
                            </InfoTittel>
                            <HelpText>
                                <EksternLenke href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-markedsarbeid/SitePages/Strategisk-Rammeverk-for-Markedsarbeid.aspx">
                                    Les mer om partner avtaler på navet
                                </EksternLenke>
                            </HelpText>
                        </TittelMedHelpTextContainer>
                        <InfoData>{salesforceInfo.partnerStatus}</InfoData>
                    </>
                }
            </Info>
            {salesforceInfo &&
                <>
                    <SalesforceLenke href={salesforceInfo?.url}>
                        Se virksomheten i Salesforce
                    </SalesforceLenke>
                </>
            }
        </Container>

    );
};

