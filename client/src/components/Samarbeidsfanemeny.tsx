import { BookIcon, CircleBrokenIcon, HikingTrailSignIcon, MenuHamburgerIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { ActionMenu, Button } from "@navikt/ds-react";
import { SpørreundersøkelseType } from "../domenetyper/spørreundersøkelseMedInnhold";
import styled from "styled-components";
import React from "react";

export default function Samarbeidsfanemeny({ type, children, laster = false }: { type: SpørreundersøkelseType | "Samarbeidsplan", children?: React.ReactNode, laster?: boolean }) {
	const [open, setOpen] = React.useState(false);
	return (
		<ActionMenu onOpenChange={setOpen} open={open}>
			<ActionMenu.Trigger>
				<Button variant="tertiary-neutral" icon={laster ? <Spinner title="Laster" /> : <AnimertHamburger $isOpen={open} title="Meny" />} />
			</ActionMenu.Trigger>
			<ActionMenu.Content>
				<MenuHeading>{type}</MenuHeading>
				<Samarbeidsfanelenkeliste type={type}>
					{children}
				</Samarbeidsfanelenkeliste>
			</ActionMenu.Content>
		</ActionMenu>
	)
}

const MenuHeading = styled(ActionMenu.Label)`
	font-weight: 600;
	font-size: 1.25rem;
	color: var(--a-text-default);
	padding-right: 2rem;
	margin-bottom: 0.25rem;
`;

const Spinner = styled(CircleBrokenIcon)`
    animation: spin 1s linear infinite;
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const AnimertHamburger = styled(MenuHamburgerIcon) <{ $isOpen: boolean }>`
	transition: transform 0.2s ease-in-out;
	transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;


function Samarbeidsfanelenkeliste({ type, children }: { type: SpørreundersøkelseType | "Samarbeidsplan", children?: React.ReactNode }) {
	switch (type) {
		case "Behovsvurdering":
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
						icon={<HikingTrailSignIcon aria-hidden fontSize="1.25rem" />}
						tekst="IA-Veileder"
						href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Kartlegge%20behovet%20for%20tjenester.aspx"
					/>
				</>
			);
		case "Evaluering":
			return (
				<>
					<Samarbeidsfanelenke
						icon={<BookIcon aria-hidden fontSize="1.25rem" />}
						tekst="Brukerveileder"
						href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/Evaluering.aspx"
					/>
					<Samarbeidsfanelenke
						icon={<HikingTrailSignIcon aria-hidden fontSize="1.25rem" />}
						tekst="IA-veileder"
						href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Evaluere%20status%20p%C3%A5%20IA-arbeidet%20med%20partssammensatt%20gruppe.aspx"
					/>
				</>
			);
		case "Samarbeidsplan":
			return (
				<>
					<Samarbeidsfanelenke
						icon={<BookIcon aria-hidden fontSize="1.25rem" />}
						tekst="Brukerveileder"
						href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/Samarbeidsplan.aspx"
					/>
					<Samarbeidsfanelenke
						icon={<HikingTrailSignIcon aria-hidden fontSize="1.25rem" />}
						tekst="IA-veileder"
						href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv/SitePages/Ferdigstille%20plan%20for%20samarbeidet.aspx"
					/>
					{children}
				</>
			);

	};
}

function Samarbeidsfanelenke({ icon, tekst, href }: { icon: React.ReactNode, tekst: string, href: HTMLAnchorElement["href"] }) {
	return (<ActionMenu.Item as="a" href={href} target="_blank">
		{icon}
		{tekst}
	</ActionMenu.Item>);
}