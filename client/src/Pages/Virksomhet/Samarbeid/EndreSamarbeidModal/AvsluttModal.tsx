import { Modal, Heading, BodyLong, RadioGroup, Radio, Button, BodyShort } from "@navikt/ds-react";
import React from "react";
import { StyledSamarbeidModal } from "../NyttSamarbeidModal";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { muligeHandlinger, MuligSamarbeidsgandling } from "../../../../domenetyper/samarbeidsEndring";
import { useBøyningerAvSamarbeidshandling } from "../../../../util/formatering/useBøyninger";
import styled from "styled-components";

const StyledRadioGroup = styled(RadioGroup)`
	margin-bottom: 1rem;
	margin-top: 0.75rem;
`;

const StyledErDuSikker = styled(BodyShort)`
	min-height: 1.5rem;
`;

const StyledJaKnapp = styled(Button)`
	min-width: 14rem;
	text-align: center;
`;

export default function AvsluttModal({ samarbeid, åpen, setÅpen, prøvÅGjennomføreHandling }: {
	iaSak: IASak,
	samarbeid: IaSakProsess,
	åpen: boolean,
	setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
	prøvÅGjennomføreHandling: (handling: MuligSamarbeidsgandling) => void;
}) {
	const [valgtHandling, setValgtHandling] = React.useState<MuligSamarbeidsgandling | null>(null);
	const bøydHandling = useBøyningerAvSamarbeidshandling(valgtHandling || muligeHandlinger.Enum.fullfores);
	return (
		<StyledSamarbeidModal aria-label="Avslutt samarbeid" open={åpen} onClose={() => setÅpen(false)}>
			<Modal.Header closeButton={true}>
				<Heading size="medium">Avslutt <i>{samarbeid.navn}</i></Heading>
			</Modal.Header>
			<Modal.Body>
				<BodyLong>
					Når du avslutter samarbeidet vil alle dokumenter bli journalført og det vil ikke være mulig å gjøre endringer.
				</BodyLong>
				<StyledRadioGroup onChange={setValgtHandling} value={valgtHandling} legend="Hva har skjedd med samarbeidet?" hideLegend>
					<HandlingRadio handling={muligeHandlinger.Enum.fullfores} />
					<HandlingRadio handling={muligeHandlinger.Enum.avbrytes} />
				</StyledRadioGroup>
				<StyledErDuSikker weight="semibold">
					{valgtHandling && `Er du sikker på at du vil ${bøydHandling.infinitiv} samarbeidet?`}
				</StyledErDuSikker>
			</Modal.Body>
			<Modal.Footer>
				<StyledJaKnapp
					variant="primary"
					disabled={!valgtHandling}
					onClick={() => {
						if (valgtHandling) {
							prøvÅGjennomføreHandling(valgtHandling);
							setÅpen(false);
						}
					}}
				>
					Ja {bøydHandling.imperativ} samarbeidet
				</StyledJaKnapp>
				<Button
					variant="secondary"
					onClick={() => {
						setÅpen(false);
					}}
				>
					Avbryt
				</Button>

			</Modal.Footer>
		</StyledSamarbeidModal>
	);
}


function HandlingRadio({ handling }: { handling: MuligSamarbeidsgandling }) {
	const bøydHandling = useBøyningerAvSamarbeidshandling(handling);
	return (
		<Radio value={handling}>
			Samarbeidet er {bøydHandling.presensPerfektum}
		</Radio>
	);
}