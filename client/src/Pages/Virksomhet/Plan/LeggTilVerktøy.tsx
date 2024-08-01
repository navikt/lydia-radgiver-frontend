import React from "react";
import { BodyLong, Button, Label, Modal, TextField } from "@navikt/ds-react";
import { StyledModal } from "../../../components/Modal/StyledModal";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import {IASakPlanRessurs} from "../../../domenetyper/iaSakPlan";

const StyledBody = styled(BodyLong)`
	margin-top: 1rem;
	margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
	width: fit-content;
`;

export default function LeggTilVerktøy({ verktøy, setVerktøy }: {
	verktøy: IASakPlanRessurs[];
	setVerktøy: (t: IASakPlanRessurs[]) => void;
}) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [minVerktøyliste, setMinVerktøyliste] = React.useState<IASakPlanRessurs[]>(verktøy);

	React.useEffect(() => {
		if (minVerktøyliste?.[minVerktøyliste.length - 1]?.beskrivelse !== "" || minVerktøyliste?.[minVerktøyliste.length - 1]?.url !== "") {
			setMinVerktøyliste([...minVerktøyliste, { id: 0, beskrivelse: "", url: "" }]);
		}
	}, [minVerktøyliste]);

	return <>
		<StyledButton
			size="small"
			onClick={() => setModalOpen(true)}
			icon={<PlusIcon />}
			variant="secondary"
			iconPosition="right">
			Legg til verktøy
		</StyledButton>
		<StyledModal
			width="medium"
			open={modalOpen}
			onClose={() => setModalOpen(false)}
			header={{ heading: "Legg til verktøy og ressurser" }}>
			<Modal.Body>
				<StyledBody>Her kan du dele ressurser med virksomheten ved å laste opp relevante lenker til temaet. Vær sikker på at du laster opp riktig lenke før du lagrer.</StyledBody>
				<VerktøyListe minVerktøyliste={minVerktøyliste} setMinVerktøyliste={setMinVerktøyliste} />
				<ModalKnapper>
					<Button variant="secondary" onClick={() => {
						setMinVerktøyliste(verktøy);
						setModalOpen(false);
					}}>Avbryt</Button>
					<Button onClick={() => {
						setVerktøy(minVerktøyliste.filter((ressurs) => ressurs.beskrivelse !== ""));
						setModalOpen(false);
					}}>Lagre</Button>
				</ModalKnapper>
			</Modal.Body>
		</StyledModal></>
}

const VerktøyListeWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr min-content;
	grid-gap: 1rem;
`;

function VerktøyListe({ minVerktøyliste, setMinVerktøyliste }: { minVerktøyliste: IASakPlanRessurs[], setMinVerktøyliste: (t: IASakPlanRessurs[]) => void }) {
	const setVerktøy = (verktøy: IASakPlanRessurs, index: number) => {
		const nyeVerktøy = [...minVerktøyliste];
		nyeVerktøy[index] = verktøy;

		return setMinVerktøyliste(nyeVerktøy);
	};

	const slettVerktøy = (index: number) => {
		const nyeVerktøy = [...minVerktøyliste];
		nyeVerktøy.splice(index, 1);

		return setMinVerktøyliste(nyeVerktøy);
	}
	return (
		<VerktøyListeWrapper>
			<Headerrad />
			{minVerktøyliste.map((verktøy, index) => <Verktøyrad key={index} verktøy={verktøy} setVerktøy={(ressurs: IASakPlanRessurs) => setVerktøy(ressurs, index)} slettVerktøy={index < minVerktøyliste.length - 1 ? () => slettVerktøy(index) : undefined} />)}
		</VerktøyListeWrapper>
	);
}

function Headerrad() {
	return (
		<>
			<Label>Beskrivelse</Label>
			<Label>Lenke</Label>
			<span />
		</>
	);
}

const SlettKnapp = styled(Button)`
	padding: 0;

	span {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--a-text-default);
	}
`;

function Verktøyrad({ verktøy, setVerktøy, slettVerktøy }: { verktøy: IASakPlanRessurs, setVerktøy: (t: IASakPlanRessurs) => void, slettVerktøy?: () => void }) {
	return (
		<>
			<TextField size="small" label="Beskrivelse" hideLabel value={verktøy.beskrivelse} onChange={(evt) => setVerktøy({ ...verktøy, beskrivelse: evt.target.value })} />
			<TextField size="small" label="Lenke" hideLabel value={verktøy.beskrivelse} onChange={(evt) => setVerktøy({ ...verktøy, url: evt.target.value })} />
			{slettVerktøy ? <SlettKnapp variant="tertiary" onClick={slettVerktøy}><TrashIcon title={`Slett ${verktøy.beskrivelse}`} fontSize="2rem" /></SlettKnapp> : <span />}
		</>
	);
}