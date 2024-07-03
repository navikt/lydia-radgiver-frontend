import React from "react";
import { TilgjengeligTema } from "./PlanFane";
import { Temainnhold } from "./TemaConfig";
import { Button, Checkbox, CheckboxGroup, Modal } from "@navikt/ds-react";
import { StyledModal } from "../../../components/Modal/StyledModal";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";

export default function LeggTilTemaKnapp({ temaer, setTemaer, tilgjengeligeTemaer }: {
	temaer: Temainnhold[];
	setTemaer: (t: Temainnhold[]) => void;
	tilgjengeligeTemaer: TilgjengeligTema[];
}) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [valgteTemaer, setValgteTemaer] = React.useState<string[]>([]);
	const ubrukteTema = React.useMemo(() => tilgjengeligeTemaer.filter((tma) => {
		return temaer.find((tema) => tema.tittel === tma.tittel) === undefined;
	}), [temaer, tilgjengeligeTemaer]);

	return <>
		<Button onClick={() => setModalOpen(true)} disabled={ubrukteTema.length === 0}>Legg til tema</Button>
		<StyledModal open={modalOpen} onCancel={() => setModalOpen(false)}>
			<Modal.Body>
				<CheckboxGroup
					legend="Velg tema i samarbeidsplan"
					description="Velg hvilke temaer dere skal jobbe med under samarbeidsperioden"
					value={valgteTemaer}
					onChange={setValgteTemaer}>
					{
						ubrukteTema.map((tema) => (
							<Checkbox key={tema.tittel} value={tema.tittel}>
								{tema.tittel}
							</Checkbox>
						))
					}
				</CheckboxGroup>
				<br />
				<ModalKnapper>
					<Button variant="secondary" onClick={() => {
						setValgteTemaer([]);
						setModalOpen(false);
					}}>Avbryt</Button>
					<Button onClick={() => {
						setTemaer([...temaer, ...valgteTemaer.map((tittel) => ({
							tittel,
							undertema: [],
							verktøy: [],
						}))]);
						setValgteTemaer([]);
						setModalOpen(false);
					}}>Lagre</Button>
				</ModalKnapper>
			</Modal.Body>
		</StyledModal></>
}