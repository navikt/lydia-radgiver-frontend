import React from "react";
import { IASak } from "../../../../domenetyper/domenetyper";
import { Button, Dropdown } from "@navikt/ds-react";
import { SamarbeidStatusBadge } from "../../../../components/Badge/SamarbeidStatusBadge";
import styled from "styled-components";
import { defaultNavnHvisTomt, IaSakProsess, IASamarbeidStatusEnum } from "../../../../domenetyper/iaSakProsess";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import { InternLenke } from "../../../../components/InternLenke";

const StyledDropdownMenuList = styled(Dropdown.Menu.List)`
	border-top: 1px solid var(--ac-button-primary-bg, var(--__ac-button-primary-bg, var(--a-surface-action)));
	padding-top: 1rem;
`;

const StyledOverflowDropdownMenuList = styled(StyledDropdownMenuList)`
	max-height: 14rem;
	overflow-y: auto;
`;

const StyledDropdownMenuListItem = styled(Dropdown.Menu.List.Item)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
`;

const StyledListItemButtonContainer = styled(Dropdown.Menu.List.Item)`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StyledLenke = styled(InternLenke)`
	width: 100%;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
`;

const SeMerKnapp = styled(Button)`
	width: 100%;
`;

export default function FullførteSamarbeid({ iaSak, alleSamarbeid, erEkspandert, setErEkspandert, setModalErÅpen }: { iaSak: IASak | undefined, alleSamarbeid?: IaSakProsess[], erEkspandert: boolean, setErEkspandert: React.Dispatch<React.SetStateAction<boolean>>, setModalErÅpen: React.Dispatch<React.SetStateAction<boolean>> }) {

	const fullførteSamarbeid = alleSamarbeid
		?.sort(sorterSamarbeidPåSistEndret)
		?.filter(({ status }) => status === IASamarbeidStatusEnum.Enum.FULLFØRT || status === IASamarbeidStatusEnum.Enum.AVBRUTT);

	if (!iaSak || fullførteSamarbeid === undefined || fullførteSamarbeid?.length === 0) {
		return null;
	}

	if (!erEkspandert && fullførteSamarbeid.length > 3) {
		return (
			<StyledDropdownMenuList>
				{
					fullførteSamarbeid.slice(0, 3).map((samarbeid) => (
						<StyledDropdownMenuListItem key={samarbeid.id} as="li">
							<StyledLenke
								href={`/virksomhet/${iaSak.orgnr}/sak/${iaSak.saksnummer}/samarbeid/${samarbeid.id}`}
								title={`Gå til samarbeid '${defaultNavnHvisTomt(samarbeid.navn)}'`}
								onClick={() => {
									setErEkspandert(false);
									setModalErÅpen(false);
								}}
							>
								{defaultNavnHvisTomt(samarbeid.navn)}
							</StyledLenke>
							<SamarbeidStatusBadge status={samarbeid.status} />
						</StyledDropdownMenuListItem>
					))
				}
				<StyledListItemButtonContainer as="li">
					<SeMerKnapp onClick={() => setErEkspandert(true)} variant="tertiary" icon={<ChevronDownIcon aria-hidden />}>
						Se mer
					</SeMerKnapp>
				</StyledListItemButtonContainer>
			</StyledDropdownMenuList>
		);
	}

	return (
		<StyledOverflowDropdownMenuList>
			{
				fullførteSamarbeid.map((samarbeid) => (
					<StyledDropdownMenuListItem key={samarbeid.id} as="li">
						<StyledLenke
							href={`/virksomhet/${iaSak.orgnr}/sak/${iaSak.saksnummer}/samarbeid/${samarbeid.id}`}
							title={`Gå til samarbeid '${defaultNavnHvisTomt(samarbeid.navn)}'`}
						>
							{defaultNavnHvisTomt(samarbeid.navn)}
						</StyledLenke>
						<SamarbeidStatusBadge status={samarbeid.status} />
					</StyledDropdownMenuListItem>
				))
			}
		</StyledOverflowDropdownMenuList>
	);
}

function sorterSamarbeidPåSistEndret(a: IaSakProsess, b: IaSakProsess) {
	if (a.sistEndret === undefined || a.sistEndret === null) {
		if (b.sistEndret === undefined || b.sistEndret === null) {
			return 0;
		}

		return 1;
	}

	if (b.sistEndret === undefined || b.sistEndret === null) {
		return -1;

	}

	const aDate = new Date(a.sistEndret);
	const bDate = new Date(b.sistEndret);

	if (aDate > bDate) {
		return -1;
	}

	if (aDate < bDate) {
		return 1;
	}
	return 0;
}