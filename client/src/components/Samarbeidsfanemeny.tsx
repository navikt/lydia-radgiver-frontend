import {
    BookIcon,
    CircleBrokenIcon,
    FileWordIcon,
    HikingTrailSignIcon,
    MenuHamburgerIcon,
    PaperplaneIcon,
} from "@navikt/aksel-icons";
import { ActionMenu, Button } from "@navikt/ds-react";
import React from "react";
import { DokumentType } from "../domenetyper/domenetyper";
import capitalizeFirstLetterLowercaseRest from "../util/formatering/capitalizeFirstLetterLowercaseRest";
import styles from './components.module.scss';

export default function Samarbeidsfanemeny({
    type,
    children,
    laster = false,
}: {
    type?: DokumentType;
    children?: React.ReactNode;
    laster?: boolean;
}) {
    const [open, setOpen] = React.useState(false);
    return (
        <ActionMenu onOpenChange={setOpen} open={open}>
            <ActionMenu.Trigger>
                <Button
                    variant="tertiary-neutral"
                    icon={
                        laster ? (
                            <CircleBrokenIcon className={styles.spinner} title="Laster" />
                        ) : (
                            <MenuHamburgerIcon className={`${styles.animertBurger} ${open ? styles.open : ""}`} title="Meny" />
                        )
                    }
                />
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                {type && <ActionMenu.Label className={styles.samarbeidsfanemenyHeading}>{capitalizeFirstLetterLowercaseRest(type)}</ActionMenu.Label>}
                <Samarbeidsfanelenkeliste type={type}>
                    {children}
                </Samarbeidsfanelenkeliste>
            </ActionMenu.Content>
        </ActionMenu>
    );
}

function Samarbeidsfanelenkeliste({
    type,
    children,
}: {
    type?: DokumentType;
    children?: React.ReactNode;
}) {
    switch (type) {
        case "BEHOVSVURDERING":
            return (
                <>
                    <Samarbeidsfanelenke
                        icon={<BookIcon aria-hidden fontSize="1.25rem" />}
                        tekst="Brukerveileder"
                        href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/Behovsvurdering-av-IA-samarbeidet_brukerveiledning.aspx"
                    />
                    <Samarbeidsfanelenke
                        icon={<PaperplaneIcon aria-hidden fontSize="1.25rem" />}
                        tekst="Invitasjonsmal"
                        href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Kartlegge%20med-partssammensatt-gruppe.aspx"
                    />
                    <Samarbeidsfanelenke
                        icon={<FileWordIcon aria-hidden fontSize="1.25rem" />}
                        tekst="Tips og råd til gjennomføring"
                        href="https://navno.sharepoint.com/:w:/r/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/_layouts/15/Doc.aspx?sourcedoc=%7BDF2337B7-18A8-4F1D-BA41-0D0654D6E5A8%7D&file=Gjennomf%25u00f8ring-av-behovsvurdering.docx"
                    />
                    <Samarbeidsfanelenke
                        icon={
                            <HikingTrailSignIcon
                                aria-hidden
                                fontSize="1.25rem"
                            />
                        }
                        tekst="IA-veileder"
                        href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Kartlegge%20behovet%20for%20tjenester.aspx"
                    />
                </>
            );
        case "EVALUERING":
            return (
                <>
                    <Samarbeidsfanelenke
                        icon={<BookIcon aria-hidden fontSize="1.25rem" />}
                        tekst="Brukerveileder"
                        href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/Evaluering.aspx"
                    />
                    <Samarbeidsfanelenke
                        icon={
                            <HikingTrailSignIcon
                                aria-hidden
                                fontSize="1.25rem"
                            />
                        }
                        tekst="IA-veileder"
                        href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Evaluere%20status%20p%C3%A5%20IA-arbeidet%20med%20partssammensatt%20gruppe.aspx"
                    />
                </>
            );
        case "SAMARBEIDSPLAN":
            return (
                <>
                    <Samarbeidsfanelenke
                        icon={<BookIcon aria-hidden fontSize="1.25rem" />}
                        tekst="Brukerveileder"
                        href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/Samarbeidsplan.aspx"
                    />
                    <Samarbeidsfanelenke
                        icon={
                            <HikingTrailSignIcon
                                aria-hidden
                                fontSize="1.25rem"
                            />
                        }
                        tekst="IA-veileder"
                        href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Ferdigstille%20plan%20for%20samarbeidet.aspx"
                    />
                    {children}
                </>
            );
        case undefined: //Kartlegging
            return (
                <>
                    <ActionMenu.Group label="Behovsvurdering">
                        <Samarbeidsfanelenke
                            icon={<BookIcon aria-hidden fontSize="1.25rem" />}
                            tekst="Brukerveileder"
                            href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/Behovsvurdering-av-IA-samarbeidet_brukerveiledning.aspx"
                        />
                        <Samarbeidsfanelenke
                            icon={<PaperplaneIcon aria-hidden fontSize="1.25rem" />}
                            tekst="Invitasjonsmal"
                            href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Kartlegge%20med-partssammensatt-gruppe.aspx"
                        />
                        <Samarbeidsfanelenke
                            icon={<FileWordIcon aria-hidden fontSize="1.25rem" />}
                            tekst="Tips og råd til gjennomføring"
                            href="https://navno.sharepoint.com/:w:/r/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/_layouts/15/Doc.aspx?sourcedoc=%7BDF2337B7-18A8-4F1D-BA41-0D0654D6E5A8%7D&file=Gjennomf%25u00f8ring-av-behovsvurdering.docx"
                        />
                        <Samarbeidsfanelenke
                            icon={
                                <HikingTrailSignIcon
                                    aria-hidden
                                    fontSize="1.25rem"
                                />
                            }
                            tekst="IA-veileder"
                            href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Kartlegge%20behovet%20for%20tjenester.aspx"
                        />
                    </ActionMenu.Group>
                    <ActionMenu.Group label="Evaluering">
                        <Samarbeidsfanelenke
                            icon={<BookIcon aria-hidden fontSize="1.25rem" />}
                            tekst="Brukerveileder"
                            href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/Evaluering.aspx"
                        />
                        <Samarbeidsfanelenke
                            icon={
                                <HikingTrailSignIcon
                                    aria-hidden
                                    fontSize="1.25rem"
                                />
                            }
                            tekst="IA-veileder"
                            href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Evaluere%20status%20p%C3%A5%20IA-arbeidet%20med%20partssammensatt%20gruppe.aspx"
                        />
                    </ActionMenu.Group>
                </>
            );
    }
}

function Samarbeidsfanelenke({
    icon,
    tekst,
    href,
}: {
    icon: React.ReactNode;
    tekst: string;
    href: HTMLAnchorElement["href"];
}) {
    return (
        <ActionMenu.Item as="a" href={href} target="_blank">
            {icon}
            {tekst}
        </ActionMenu.Item>
    );
}
