import { Chips } from "@navikt/ds-react";
import { IaSakProsess, defaultNavnHvisTomt } from "../../../domenetyper/iaSakProsess";

export function Samarbeidsvelger({
	alleSamarbeid, valgtSamarbeid, setValgtSamarbeid,
}: {
	alleSamarbeid: IaSakProsess[];
	valgtSamarbeid: IaSakProsess;
	setValgtSamarbeid: React.Dispatch<React.SetStateAction<IaSakProsess>>;
}) {
	return (
		<Chips>
			{alleSamarbeid.map((samarbeid) => (
				<Chips.Toggle
					key={samarbeid.id}
					selected={samarbeid.id === valgtSamarbeid?.id}
					onClick={() => setValgtSamarbeid(samarbeid)}
				>
					{defaultNavnHvisTomt(samarbeid.navn)}
				</Chips.Toggle>
			))}
		</Chips>
	);
}
