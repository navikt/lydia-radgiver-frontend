import { BodyLong, BodyShort, Button, Heading, Modal } from "@navikt/ds-react";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";

export default function BekreftFullførModal({
	åpen,
	lukkModal,
	samarbeid,
}: {
	åpen: boolean;
	lukkModal: () => void;
	samarbeid: IaSakProsess;
}) {
	return (
		<Modal open={åpen} onClose={lukkModal} aria-labelledby="bekreft-fullfør-samarbeid-modal-heading" closeOnBackdropClick width="small">
			<Modal.Header>
				<Heading size="medium" id="bekreft-fullfør-samarbeid-modal-heading">Fullfør <i>Avdeling</i> {samarbeid.navn}</Heading>
			</Modal.Header>
			<Modal.Body>
				<BodyLong spacing>
					Når samarbeidet er fullført kan du ikke gjøre endringer i Fia eller opprette nye aktiviteter i Salesforfce.
				</BodyLong>
				<BodyShort weight="semibold">
					Ønsker du å fullføre samarbeidet?
				</BodyShort>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => {
					// TODO: Faktisk gjør noe her.
					lukkModal();
				}}>Avbryt</Button>
				<Button variant="primary" onClick={() => {
					// TODO: Faktisk gjør noe her.
					lukkModal();
				}}>Fullfør</Button>
			</Modal.Footer>
		</Modal>
	);
}