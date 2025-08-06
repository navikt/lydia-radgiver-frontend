import React from "react";
import { Virksomhetsoversikt } from "../../../domenetyper/virksomhetsoversikt";
import { Heading, Loader, Table } from "@navikt/ds-react";
import { InternLenke } from "../../../components/InternLenke";
import styled from "styled-components";

import { useHentSakshistorikk } from "../../../api/lydia-api/virksomhet";
import Samarbeidshistorikk from "../../Virksomhet/Sakshistorikk/Samarbeidshistorikk";
import { flip, useFloating, useHover, useInteractions } from "@floating-ui/react";
import { IAProsessStatusEnum } from "../../../domenetyper/domenetyper";

export default function Virksomhetsnavncelle({
	virksomhetsoversikt
}: {
	virksomhetsoversikt: Virksomhetsoversikt;
}) {
	if (!virksomhetsoversikt.saksnummer || virksomhetsoversikt.status === IAProsessStatusEnum.enum.IKKE_AKTIV) {
		return <BasicVirksomhetsnavncelle virksomhetsoversikt={virksomhetsoversikt} />;
	}

	return (
		<VirksomhetsnavncelleMedPopover virksomhetsoversikt={virksomhetsoversikt} />
	);
}

function VirksomhetsnavncelleMedPopover({
	virksomhetsoversikt
}: {
	virksomhetsoversikt: Virksomhetsoversikt;
}) {
	const [hovered, setHovered] = React.useState(false);
	const { refs, floatingStyles, context } = useFloating({
		open: hovered,
		placement: "bottom-start",
		onOpenChange: setHovered,
		middleware: [
			flip(), // Default popover under ref, men kan flippe til over ref hvis det er lite plass under
		]
	});
	const hover = useHover(context, { delay: { open: 100, close: 0 } });
	const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
	return (
		<Table.DataCell ref={refs.setReference} {...getReferenceProps()}>
			<InternLenke
				style={{ fontWeight: "bold" }}
				href={`/virksomhet/${virksomhetsoversikt.orgnr}`}
			>
				{virksomhetsoversikt.virksomhetsnavn}
			</InternLenke>
			{hovered && (
				<VirksomhetsoversiktPopover
					virksomhetsoversikt={virksomhetsoversikt}
					setFloatingrefs={refs.setFloating}
					getFloatingProps={getFloatingProps}
					style={floatingStyles}
				/>
			)}
		</Table.DataCell>
	);
}

function BasicVirksomhetsnavncelle({
	virksomhetsoversikt,
}: {
	virksomhetsoversikt: Virksomhetsoversikt;
}) {
	return (
		<Table.DataCell style={{ fontWeight: "bold" }}>
			<InternLenke
				href={`/virksomhet/${virksomhetsoversikt.orgnr}`}
			>
				{virksomhetsoversikt.virksomhetsnavn}
			</InternLenke>
		</Table.DataCell>
	);
}

const PopoverContainer = styled.div`
	position: absolute;
	background-color: white;
	border: 1px solid #ccc;
	padding: 0.75rem 1rem 1rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	z-index: 100;
	pointer-events: none;
`;


const HeadingMedEllipse = styled(Heading)`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
	max-width: 100%;
`;

function VirksomhetsoversiktPopover({
	virksomhetsoversikt,
	setFloatingrefs,
	getFloatingProps,
	style,
}: {
	virksomhetsoversikt: Virksomhetsoversikt;
	setFloatingrefs: (element: HTMLElement | null) => void;
	getFloatingProps: () => React.HTMLAttributes<HTMLDivElement>;
	style: React.CSSProperties;
}) {
	const { data: sakshistorikk, loading: lasterSakshistorikk } =
		useHentSakshistorikk(virksomhetsoversikt.orgnr);

	const aktivSak = React.useMemo(() => {
		if (!sakshistorikk || sakshistorikk.length === 0) {
			return undefined;
		}

		return sakshistorikk.find((historikk) => historikk.saksnummer === virksomhetsoversikt.saksnummer);
	}, [sakshistorikk]);


	if (lasterSakshistorikk) {
		return (
			<PopoverContainer ref={setFloatingrefs} style={style} {...getFloatingProps()}>
				<Loader size="small" />
			</PopoverContainer>
		);
	}

	if (!aktivSak || aktivSak.samarbeid.length === 0) {
		return (
			<PopoverContainer ref={setFloatingrefs} style={style} {...getFloatingProps()}>
				Ingen samarbeid på saken
			</PopoverContainer>
		);
	}

	return (
		<PopoverContainer ref={setFloatingrefs} style={style} {...getFloatingProps()}>
			<HeadingMedEllipse size="small" spacing level="3">
				{virksomhetsoversikt.virksomhetsnavn}
			</HeadingMedEllipse>
			<Samarbeidshistorikk
				kompakt
				lenke={false}
				historikk={aktivSak}
				visHeading={false}
				orgnr={virksomhetsoversikt.orgnr} />
		</PopoverContainer>
	);
}