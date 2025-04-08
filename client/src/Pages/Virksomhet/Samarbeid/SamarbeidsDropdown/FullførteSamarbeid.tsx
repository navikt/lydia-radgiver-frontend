import React from "react";
import { useHentSamarbeid } from "../../../../api/lydia-api/spørreundersøkelse";
import { IASak } from "../../../../domenetyper/domenetyper";
import { Dropdown, Link } from "@navikt/ds-react";
import { SamarbeidStatusBadge } from "../../../../components/Badge/SamarbeidStatusBadge";
import styled from "styled-components";
import { defaultNavnHvisTomt } from "../../../../domenetyper/iaSakProsess";

const StyledDropdownMenuList = styled(Dropdown.Menu.List)`
	border-top: 1px solid var(--ac-button-primary-bg, var(--__ac-button-primary-bg, var(--a-surface-action)));
	padding-top: 1rem;

	max-height: 10rem;
	overflow-y: auto;
`;

const StyledDropdownMenuListItem = styled(Dropdown.Menu.List.Item)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
`;

const StyledLink = styled(Link)`
	width: 100%;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
`;

export default function FullførteSamarbeid({ iaSak }: { iaSak: IASak | undefined }) {
	const { data: alleSamarbeid } =
		useHentSamarbeid(iaSak?.orgnr, iaSak?.saksnummer);

	const fullførteSamarbeid = alleSamarbeid?.map((samarbeid) => (
		{ ...samarbeid }
	));

	if (!iaSak || fullførteSamarbeid === undefined || fullførteSamarbeid?.length === 0) {
		return null;
	}

	return (
		<StyledDropdownMenuList>
			{
				fullførteSamarbeid.map((samarbeid) => (
					<StyledDropdownMenuListItem key={samarbeid.id} as="li">
						<StyledLink
							href={`/virksomhet/${iaSak.orgnr}/sak/${iaSak.saksnummer}/samarbeid/${samarbeid.id}`}
							title={`Gå til samarbeid '${defaultNavnHvisTomt(samarbeid.navn)}'`}
						>
							{defaultNavnHvisTomt(samarbeid.navn)}
						</StyledLink>
						<SamarbeidStatusBadge status={samarbeid.status} />
					</StyledDropdownMenuListItem>
				))
			}
		</StyledDropdownMenuList>
	);
}