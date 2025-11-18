import React from "react";
import { Button, Modal } from "@navikt/ds-react";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { Historiskstatistikk } from "./Graf/Historiskstatistikk";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import { TrendUpIcon } from "@navikt/aksel-icons";

export default function Sykefraværsstatistikkmodal({ virksomhet }: { virksomhet: Virksomhet }) {
	const [open, setOpen] = React.useState(false);

	return (
		<>
			<Button variant="tertiary" size="small" onClick={() => setOpen(true)} icon={<TrendUpIcon aria-hidden fontSize="1.25rem" />}>
				Sykefraværsstatistikk
			</Button>
			<Modal width="64rem" header={{ heading: `Sykefraværsstatistikk for ${virksomhet.navn}` }} open={open} onClose={() => setOpen(false)} closeOnBackdropClick>
				{
					open && <Modalinnhold virksomhet={virksomhet} />
				}
			</Modal>
		</>
	)
}

function Modalinnhold({ virksomhet }: { virksomhet: Virksomhet }) {
	return (
		<>
			<Modal.Body>
				<Sykefraværsstatistikk
					orgnummer={virksomhet.orgnr}
					bransje={virksomhet.bransje}
					næring={virksomhet.næring}
				/>
				<Historiskstatistikk orgnr={virksomhet.orgnr} />
			</Modal.Body>
		</>
	);
}