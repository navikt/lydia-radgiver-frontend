import React from "react";
import { TilgjengeligUndertema } from "./PlanFane";
import { Temainnhold } from "./TemaConfig";
import { BodyLong, Button, Modal, Select } from "@navikt/ds-react";
import { StyledModal } from "../../../components/Modal/StyledModal";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import { PlusIcon } from '@navikt/aksel-icons';

const StyledBody = styled(BodyLong)`
	margin-top: 1rem;
	margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
	width: fit-content;
`;

export default function LeggTilUndertemaKnapp({ tema, setTema, tilgjengeligeUndertemaer }: {
	tema: Temainnhold;
	setTema: (t: Temainnhold) => void;
	tilgjengeligeUndertemaer: TilgjengeligUndertema[];
}) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const ubrukteUndertema = React.useMemo(() => tilgjengeligeUndertemaer.filter((tma) => {
		return tema.undertema.find((undertema) => undertema.tittel === tma.tittel) === undefined;
	}), [tema, tilgjengeligeUndertemaer]);
	const [valgtUndertema, setValgtUndertema] = React.useState<string | undefined>(ubrukteUndertema?.[0]?.tittel);

	return <>
		<StyledButton
			size="small"
			onClick={() => setModalOpen(true)}
			icon={<PlusIcon />}
			iconPosition="right"
			disabled={ubrukteUndertema.length === 0}>
			Legg til undertema
		</StyledButton>
		<StyledModal
			width="medium"
			open={modalOpen}
			onCancel={() => setModalOpen(false)}
			header={{ heading: "Velg undertema" }}>
			<Modal.Body>
				<StyledBody>Velg hvilke undertemaer dere skal jobbe med</StyledBody>
				<Select
					size="small"
					label="Velg undertema"
					value={valgtUndertema}
					onChange={(evt) => {
						setValgtUndertema(evt.target.value);
					}}>
					{
						ubrukteUndertema.map((tema) => (
							<option key={tema.tittel} value={tema.tittel}>
								{tema.tittel}
							</option>
						))
					}
				</Select>
				<br />
				<ModalKnapper>
					<Button variant="secondary" onClick={() => {
						setValgtUndertema(ubrukteUndertema?.[0]?.tittel);
						setModalOpen(false);
					}}>Avbryt</Button>
					<Button disabled={valgtUndertema === undefined} onClick={() => {
						if (!valgtUndertema) {
							return;
						}
						const undertema = ubrukteUndertema.find((v) => v.tittel === valgtUndertema);
						const nyeTema = { ...tema };
						const start = new Date();
						start.setDate(0);
						const slutt = new Date(start);
						slutt.setMonth(slutt.getMonth() + 1);
						nyeTema.undertema = [...tema.undertema, {
							tittel: valgtUndertema,
							start,
							slutt,
							status: "Planlagt",
							statusfarge: undertema?.statusfarge
						}];
						setTema(nyeTema);
						setValgtUndertema(
							ubrukteUndertema.find(
								(v) => v.tittel !== valgtUndertema
							)?.tittel
						);
						setModalOpen(false);
					}}>Lagre</Button>
				</ModalKnapper>
			</Modal.Body>
		</StyledModal></>
}