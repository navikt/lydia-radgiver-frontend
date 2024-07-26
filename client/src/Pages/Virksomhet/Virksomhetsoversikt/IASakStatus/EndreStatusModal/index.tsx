import { Button, Heading, Modal } from "@navikt/ds-react";
import React from "react";
import { GyldigNesteHendelse, IASak } from "../../../../../domenetyper/domenetyper";
import Historikk from "./Historikk";
import { StatusHendelseSteg, Statusknapper } from "./Statusknapper";
import { erIDev } from "../../../../../components/Dekoratør/Dekoratør";

export default function EndreStatusModal({
	sak,
	hendelser,
	setVisKonfetti
}: {
	sak: IASak;
	hendelser: GyldigNesteHendelse[];
	setVisKonfetti?: (visKonfetti: boolean) => void;
}) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [nesteSteg, setNesteSteg] = React.useState<{ nesteSteg: StatusHendelseSteg | null, hendelse: GyldigNesteHendelse | null }>({ nesteSteg: null, hendelse: null });

	if (!erIDev) {
		return null;
	}

	return (
		<>
			<Button onClick={() => setModalOpen(true)}>Endre status</Button>
			<Modal open={modalOpen} style={{ minWidth: "36rem" }} onClose={() => {
				setModalOpen(false);
				setNesteSteg({ nesteSteg: null, hendelse: null });
			}}>
				<Modal.Header>
					<Heading size="medium">Endre status</Heading>
				</Modal.Header>
				<Modal.Body style={nesteSteg.nesteSteg === null ? {} : { maxHeight: "20rem" }}>
					<Historikk sak={sak} />
				</Modal.Body>
				<Statusknapper
					hendelser={hendelser}
					sak={sak}
					setModalOpen={setModalOpen}
					setVisKonfetti={setVisKonfetti}
					nesteSteg={nesteSteg}
					setNesteSteg={setNesteSteg} />
			</Modal>
		</>
	);
}

