import { Virksomhet } from "../../../domenetyper/virksomhet";
import styled from "styled-components";
import { BodyShort, HelpText } from "@navikt/ds-react";
import { EksternLenke } from "../../../components/EksternLenke";
import PopoverContent from "@navikt/ds-react/esm/popover/PopoverContent";
import { useHentSalesforceUrl } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";

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

interface PopoverInnholdProps {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    className?: string;
}
export const VirksomhetsInfoPopoverInnhold = ({
    virksomhet,
    iaSak: sak,
    className,
}: PopoverInnholdProps) => {
    const adresse = virksomhet.adresse.join(", ");
    const capitalizedLabel = (label: string) => {
        const lowerCasedLabel: string = label.toLowerCase();
        return lowerCasedLabel[0].toUpperCase() + lowerCasedLabel.slice(1);
    };

    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    return (
        <PopoverContent>
            <>
                <Info className={className}>
                    {sak?.saksnummer && <InfoTittel>Saksnummer</InfoTittel>}
                    <InfoData>{sak?.saksnummer}</InfoData>
                    <InfoTittel>Orgnummer</InfoTittel>
                    <InfoData>{virksomhet.orgnr}</InfoData>
                    <InfoTittel>Adresse</InfoTittel>
                    <InfoData>
                        {adresse}, {virksomhet.postnummer} {virksomhet.poststed}
                    </InfoData>
                    {virksomhet.bransje && (
                        <>
                            <InfoTittel>Bransje</InfoTittel>
                            <InfoData>
                                {capitalizedLabel(virksomhet.bransje)}
                            </InfoData>
                        </>
                    )}
                    <InfoTittel>Næring</InfoTittel>
                    <InfoData>
                        {`${virksomhet.næring.navn} (${virksomhet.næring.kode})`}
                    </InfoData>
                    <InfoTittel>
                        Næringsundergruppe
                        {virksomhet.næringsundergruppe2 && "r"}
                    </InfoTittel>
                    <InfoData>
                        {virksomhet.næringsundergruppe1.navn} (
                        {virksomhet.næringsundergruppe1.kode})
                        {virksomhet.næringsundergruppe2 &&
                            `, ${virksomhet.næringsundergruppe2.navn} (${virksomhet.næringsundergruppe2.kode})`}
                        {virksomhet.næringsundergruppe3 &&
                            `, ${virksomhet.næringsundergruppe3.navn} (${virksomhet.næringsundergruppe3.kode})`}
                    </InfoData>
                    {virksomhet.sektor && (
                        <>
                            <InfoTittel>Sektor</InfoTittel>
                            <InfoData>{virksomhet.sektor}</InfoData>
                        </>
                    )}
                    {salesforceInfo && salesforceInfo.partnerStatus && (
                        <>
                            <TittelMedHelpTextContainer>
                                <InfoTittel>Partner avtale</InfoTittel>
                                <HelpText>
                                    <EksternLenke href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-markedsarbeid/SitePages/Strategisk-Rammeverk-for-Markedsarbeid.aspx">
                                        Les mer om partner avtaler på navet
                                    </EksternLenke>
                                </HelpText>
                            </TittelMedHelpTextContainer>
                            <InfoData>{salesforceInfo.partnerStatus}</InfoData>
                        </>
                    )}
                </Info>
            </>
        </PopoverContent>
    );
};
