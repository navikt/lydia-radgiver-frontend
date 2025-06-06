import { BodyShort, HelpText, Popover } from "@navikt/ds-react";

import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { EksternLenke } from "../../../../components/EksternLenke";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";
import { IASak } from "../../../../domenetyper/domenetyper";

import styles from "./virksomhetsinfoheader.module.scss";


interface PopoverInnholdProps {
    virksomhet: Virksomhet;
    iaSak?: IASak;
}
export const VirksomhetsInfoPopoverInnhold = ({
    virksomhet,
    iaSak: sak,
}: PopoverInnholdProps) => {
    const adresse = virksomhet.adresse.join(", ");
    const capitalizedLabel = (label: string) => {
        const lowerCasedLabel: string = label.toLowerCase();
        return lowerCasedLabel[0].toUpperCase() + lowerCasedLabel.slice(1);
    };

    return (
        <Popover.Content>
            <dl className={styles.virksomhetsinfoPopoverInnhold}>
                <Infolinje tittel="Saksnummer" data={sak?.saksnummer} />
                <Infolinje tittel="Orgnummer" data={virksomhet.orgnr} />
                <Infolinje
                    tittel="Adresse"
                    data={`${adresse}, ${virksomhet.postnummer} ${virksomhet.poststed}`}
                />
                <Infolinje
                    tittel="Bransje"
                    data={
                        virksomhet.bransje
                            ? capitalizedLabel(virksomhet.bransje)
                            : undefined
                    }
                />
                <Infolinje
                    tittel="Næring"
                    data={`${virksomhet.næring.navn} (${virksomhet.næring.kode})`}
                />
                <NæringsgruppeInfolinje virksomhet={virksomhet} />
                <Infolinje tittel="Sektor" data={virksomhet.sektor} />
                <PartneravtaleInfolinje virksomhet={virksomhet} />
            </dl>
        </Popover.Content>
    );
};

function Infolinje({
    tittel,
    data,
}: {
    tittel: string;
    data?: string | string[];
}) {
    if (!data) {
        return null;
    }

    if (Array.isArray(data)) {
        return (
            <>
                <BodyShort as="dt" className={styles.infoTittel}>{tittel}</BodyShort>
                {data.map((d, i) => (
                    <BodyShort as="dd" className={styles.infoData} key={i}>
                        {d}
                        {i + 1 < data.length ? "," : undefined}
                    </BodyShort>
                ))}
            </>
        );
    }

    return (
        <>
            <BodyShort as="dt" className={styles.infoTittel}>{tittel}</BodyShort>
            <BodyShort as="dd" className={styles.infoData}>{data}</BodyShort>
        </>
    );
}

function NæringsgruppeInfolinje({ virksomhet }: { virksomhet: Virksomhet }) {
    const næringsgrupper = [
        `${virksomhet.næringsundergruppe1.navn} (${virksomhet.næringsundergruppe1.kode})`,
    ];
    if (virksomhet.næringsundergruppe2) {
        næringsgrupper.push(
            `${virksomhet.næringsundergruppe2.navn} (${virksomhet.næringsundergruppe2.kode})`,
        );

        if (virksomhet.næringsundergruppe3) {
            næringsgrupper.push(
                `${virksomhet.næringsundergruppe3.navn} (${virksomhet.næringsundergruppe3.kode})`,
            );
        }
    }
    return (
        <Infolinje
            tittel={`Næringsundergruppe${virksomhet.næringsundergruppe2 ? "r" : ""}`}
            data={næringsgrupper}
        />
    );
}

function PartneravtaleInfolinje({ virksomhet }: { virksomhet: Virksomhet }) {
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    if (!salesforceInfo?.partnerStatus) {
        return null;
    }

    return (
        <>
            <BodyShort as="dt" className={styles.tittelMedHelpTextContainer}>
                <span>Partner avtale</span>
                <HelpText>
                    <EksternLenke href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-markedsarbeid/SitePages/Strategisk-Rammeverk-for-Markedsarbeid.aspx">
                        Les mer om partner avtaler på navet
                    </EksternLenke>
                </HelpText>
            </BodyShort>
            <BodyShort as="dd" className={styles.infoData}>{salesforceInfo.partnerStatus}</BodyShort>
        </>
    );
}
