import { Virksomhet } from "../../../domenetyper/virksomhet";
import styled from "styled-components";
import { BodyShort, HelpText } from "@navikt/ds-react";
import { EksternLenke } from "../../../components/EksternLenke";
import PopoverContent from "@navikt/ds-react/esm/popover/PopoverContent";
import { useHentSalesforceUrl } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";

const Info = styled.dl`
    display: grid;
    grid-template-columns: 1fr min-content;
    row-gap: 0.5rem;
    column-gap: 1.5rem;
`;

const InfoTittel = styled(BodyShort).attrs({ as: "dt" })`
    font-weight: bold;
    grid-column-start: 0;
    grid-column-end: 1;
`;

const InfoData = styled(BodyShort).attrs({ as: "dd" })`
    grid-column-start: 1;
    max-width: 26rem;
`;

const TittelMedHelpTextContainer = styled(BodyShort).attrs({ as: "dt" })`
    font-weight: bold;
    grid-column-start: 0;
    grid-column-end: 1;
    display: flex;
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



    return (
        <PopoverContent>
            <Info className={className}>
                <Infolinje tittel="Saksnummer" data={sak?.saksnummer} />
                <Infolinje tittel="Orgnummer" data={virksomhet.orgnr} />
                <Infolinje tittel="Adresse" data={`${adresse}, ${virksomhet.postnummer} ${virksomhet.poststed}`} />
                <Infolinje tittel="Bransje" data={virksomhet.bransje ? capitalizedLabel(virksomhet.bransje) : undefined} />
                <Infolinje tittel="Næring" data={`${virksomhet.næring.navn} (${virksomhet.næring.kode})`} />
                <NæringsgruppeInfolinje virksomhet={virksomhet} />
                <Infolinje tittel="Sektor" data={virksomhet.sektor} />
                <PartneravtaleInfolinje virksomhet={virksomhet} />
            </Info>
        </PopoverContent>
    );
};


function Infolinje({ tittel, data }: { tittel: string; data?: string | string[] }) {
    if (!data) {
        return null;
    }

    if (Array.isArray(data)) {
        return (
            <>
                <InfoTittel>{tittel}</InfoTittel>
                {
                    data.map((d, i) => (
                        <InfoData key={i}>{d}{i + 1 < data.length ? "," : undefined}</InfoData>
                    ))
                }
            </>
        );
    }

    return (
        <>
            <InfoTittel>{tittel}</InfoTittel>
            <InfoData>{data}</InfoData>
        </>
    );
}

function NæringsgruppeInfolinje({ virksomhet }: { virksomhet: Virksomhet }) {
    const næringsgrupper = [`${virksomhet.næringsundergruppe1.navn} (${virksomhet.næringsundergruppe1.kode})`];
    if (virksomhet.næringsundergruppe2) {
        næringsgrupper.push(`${virksomhet.næringsundergruppe2.navn} (${virksomhet.næringsundergruppe2.kode})`);

        if (virksomhet.næringsundergruppe3) {
            næringsgrupper.push(`${virksomhet.næringsundergruppe3.navn} (${virksomhet.næringsundergruppe3.kode})`);

        }
    }
    return (
        <Infolinje tittel={`Næringsundergruppe${virksomhet.næringsundergruppe2 ? "r" : ""}`} data={næringsgrupper} />
    );
}

function PartneravtaleInfolinje({ virksomhet }: { virksomhet: Virksomhet }) {
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    if (!salesforceInfo?.partnerStatus) {
        return null;
    }

    return (

        <>
            <TittelMedHelpTextContainer>
                <span>Partner avtale</span>
                <HelpText>
                    <EksternLenke href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-markedsarbeid/SitePages/Strategisk-Rammeverk-for-Markedsarbeid.aspx">
                        Les mer om partner avtaler på navet
                    </EksternLenke>
                </HelpText>
            </TittelMedHelpTextContainer>
            <InfoData>{salesforceInfo.partnerStatus}</InfoData>
        </>
    );
}
