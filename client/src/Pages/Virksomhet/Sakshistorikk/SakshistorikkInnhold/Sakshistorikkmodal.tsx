import React from 'react';
import { Button, Modal } from "@navikt/ds-react";
import { useHentSakshistorikk } from '../../../../api/lydia-api/virksomhet';
import { SykefraværshistorikkInnhold } from '.';

export default function Sakshistorikkmodal({ orgnr, virksomhetsnavn }: { orgnr: string; virksomhetsnavn?: string; }) {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Historikk
			</Button>
			<Modal width="64rem" header={{ heading: `Historikk${virksomhetsnavn ? ` for ${virksomhetsnavn}` : ''}` }} open={open} onClose={() => setOpen(false)} closeOnBackdropClick>
				{
					open && <Modalinnhold orgnr={orgnr} />
				}
			</Modal>
		</>
	);
}

function Modalinnhold({ orgnr }: { orgnr: string }) {
	const { data: sakshistorikk, loading: lasterSakshistorikk } = useHentSakshistorikk(orgnr);

	return (
		<Modal.Body>
			<SykefraværshistorikkInnhold sakshistorikk={sakshistorikk} lasterSakshistorikk={lasterSakshistorikk} orgnr={orgnr} defaultOpenFørste />
		</Modal.Body>
	);
}