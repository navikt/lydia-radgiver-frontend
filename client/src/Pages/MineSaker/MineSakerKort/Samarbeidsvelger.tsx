import { ActionMenu, Button, Chips, HStack, Spacer } from "@navikt/ds-react";
import { IaSakProsess, defaultNavnHvisTomt } from "../../../domenetyper/iaSakProsess";
import { SplittedeSamarbeid } from "./SamarbeidsKort";
import { ArchiveIcon } from "@navikt/aksel-icons";
import { Link } from "react-router-dom";
import { IASak } from "../../../domenetyper/domenetyper";

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
				setValgtSamarbeid={setValgtSamarbeid}
				iaSak={iaSak}
			/>
		</HStack>
	);
}

function InaktiveSamarbeidExpand({
	avsluttedeSamarbeid,
	setValgtSamarbeid,
	iaSak,
}: {
	avsluttedeSamarbeid: IaSakProsess[],
	setValgtSamarbeid: React.Dispatch<React.SetStateAction<IaSakProsess>>;
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
							as={Link}
							to={`/virksomhet/${iaSak.orgnr}/sak/${samarbeid.saksnummer}/samarbeid/${samarbeid.id}`}
						>
							{defaultNavnHvisTomt(samarbeid.navn)}
						</ActionMenu.Item>
					))}
				</ActionMenu.Group>
			</ActionMenu.Content>
		</ActionMenu>
	)
	return (
		<Chips>
			{avsluttedeSamarbeid.map((samarbeid) => (
				<Chips.Toggle
					key={samarbeid.id}
					selected={samarbeid.id === samarbeid.id}
					onClick={() => setValgtSamarbeid(samarbeid)}
				>
					{defaultNavnHvisTomt(samarbeid.navn)}
				</Chips.Toggle>
			))}
		</Chips>
	);
}