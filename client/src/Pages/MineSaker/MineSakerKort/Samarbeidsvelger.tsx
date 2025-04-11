import { ActionMenu, Button, Chips, HStack, Spacer } from "@navikt/ds-react";
import { IaSakProsess, defaultNavnHvisTomt } from "../../../domenetyper/iaSakProsess";
import { SplittedeSamarbeid } from "./SamarbeidsKort";
import { ArchiveIcon } from "@navikt/aksel-icons";
import { Link } from "react-router-dom";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";

export function Samarbeidsvelger({
	sorterteSamarbeid, valgtSamarbeid, setValgtSamarbeid, iaSak,
}: {
	sorterteSamarbeid: SplittedeSamarbeid;
	valgtSamarbeid: IaSakProsess;
	setValgtSamarbeid: React.Dispatch<React.SetStateAction<IaSakProsess>>;
	iaSak: IASak;
}) {
	return (
		<HStack>
			<Chips>
				{sorterteSamarbeid.aktive.map((samarbeid) => (
					<Chips.Toggle
						key={samarbeid.id}
						selected={samarbeid.id === valgtSamarbeid?.id}
						onClick={() => setValgtSamarbeid(samarbeid)}
					>
						{defaultNavnHvisTomt(samarbeid.navn)}
					</Chips.Toggle>
				))}
			</Chips>
			<Spacer />
			<InaktiveSamarbeidExpand
				avsluttedeSamarbeid={sorterteSamarbeid.avsluttede}
				iaSak={iaSak}
			/>
		</HStack>
	);
}

const StyledLenke = styled(Link)`
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-width: 20rem;
	color: var(--a-text-action);
	text-decoration: underline;

	&:hover {
		text-decoration: none;
	}
`;

function InaktiveSamarbeidExpand({
	avsluttedeSamarbeid,
	iaSak,
}: {
	avsluttedeSamarbeid: IaSakProsess[],
	iaSak: IASak;
}) {
	if (avsluttedeSamarbeid.length === 0) {
		return null;
	}

	return (
		<ActionMenu>
			<ActionMenu.Trigger>
				<Button size="small" variant="secondary" icon={<ArchiveIcon title="Se arkiverte samarbeid" />} />
			</ActionMenu.Trigger>
			<ActionMenu.Content>
				<ActionMenu.Group label="Avsluttede samarbeid">
					{avsluttedeSamarbeid.map((samarbeid) => (
						<ActionMenu.Item
							key={samarbeid.id}
							as={StyledLenke}
							to={`/virksomhet/${iaSak.orgnr}/sak/${samarbeid.saksnummer}/samarbeid/${samarbeid.id}`}
						>
							{defaultNavnHvisTomt(samarbeid.navn)}
							<SamarbeidStatusBadge status={samarbeid.status} />
						</ActionMenu.Item>
					))}
				</ActionMenu.Group>
			</ActionMenu.Content>
		</ActionMenu>
	)
}