import { Modal, Heading, BodyLong, RadioGroup, Radio, Button } from "@navikt/ds-react";
import React from "react";
import { StyledSamarbeidModal } from "../NyttSamarbeidModal";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { KanGjennomføreStatusendring, muligeHandlinger, MuligSamarbeidsgandling } from "../../../../domenetyper/samarbeidsEndring";
import { useBøyningerAvSamarbeidshandling } from "../../../../util/formatering/useBøyninger";
import styled from "styled-components";
import BegrunnelserForIkkeKunne from "./BegrunnelserForIkkeKunne";

const StyledRadioGroup = styled(RadioGroup)`
	margin-bottom: 1rem;
	margin-top: 0.75rem;
`;

const StyledJaKnapp = styled(Button)`
	min-width: 14rem;
	text-align: center;
`;

export default function VelgHandlingModal({
	samarbeid,
	åpen,
	setÅpen,
	hentKanGjennomføreStatusendring,
	kanGjennomføreResultat,
	lasterKanGjennomføreHandling,
	setBekreftType,
}: {
	iaSak: IASak,
	samarbeid: IaSakProsess,
	åpen: boolean,
	setÅpen: React.Dispatch<React.SetStateAction<boolean>>;
	hentKanGjennomføreStatusendring: (handling: MuligSamarbeidsgandling) => void;
	kanGjennomføreResultat?: KanGjennomføreStatusendring;
	lasterKanGjennomføreHandling: string | null;
	setBekreftType: React.Dispatch<React.SetStateAction<MuligSamarbeidsgandling | null>>;
}) {
	const [valgtHandling, setValgtHandling] = React.useState<MuligSamarbeidsgandling | null>(null);

	return (
		<StyledSamarbeidModal aria-label="Avslutt samarbeid" open={åpen} onClose={() => setÅpen(false)}>
			<Modal.Header closeButton={true}>
				<Heading size="medium">Avslutt <i>{samarbeid.navn}</i></Heading>
			</Modal.Header>
			<Modal.Body>
				<BodyLong>
					Når du avslutter samarbeidet vil alle dokumenter bli journalført og det vil ikke være mulig å gjøre endringer.
				</BodyLong>
				<StyledRadioGroup onChange={(handling: MuligSamarbeidsgandling) => {
					hentKanGjennomføreStatusendring(handling);
					setValgtHandling(handling);
				}} value={valgtHandling} legend="Hva har skjedd med samarbeidet?" hideLegend disabled={lasterKanGjennomføreHandling !== null}>
					<HandlingRadio handling={muligeHandlinger.Enum.fullfores} />
					<HandlingRadio handling={muligeHandlinger.Enum.avbrytes} />
				</StyledRadioGroup>
				{
					!lasterKanGjennomføreHandling && kanGjennomføreResultat && valgtHandling ? (
						<BegrunnelserForIkkeKunne begrunnelser={kanGjennomføreResultat?.blokkerende} type={valgtHandling} blokkerende />
					) : null
				}
			</Modal.Body>
			<Modal.Footer>
				<StyledJaKnapp
					variant="primary"
					disabled={!valgtHandling || lasterKanGjennomføreHandling !== null || !kanGjennomføreResultat?.kanGjennomføres}
					onClick={() => {
						setBekreftType(valgtHandling);
						setÅpen(false);
					}}
				>
					Avslutt samarbeidet
				</StyledJaKnapp>
				<Button
					variant="secondary"
					onClick={() => {
						setBekreftType(null);
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
