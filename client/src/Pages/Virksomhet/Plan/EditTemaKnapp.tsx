import React from "react";
import { TilgjengeligTema } from "./PlanFane";
import { Temainnhold } from "./UndertemaConfig";
import { Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import { mobileAndUp } from "../../../styling/breakpoints";
import { DocPencilIcon } from '@navikt/aksel-icons';
import UndertemaSetup, { getDefaultMyUndertema, TilgjengeligUndertema } from "./UndertemaSetup";

const EditTemaModal = styled(Modal)`
  padding: 0rem;
  max-width: 64rem;
  --a-spacing-6: 0.5rem;
  
  ${mobileAndUp} {
    padding: 1.5rem;
    --a-spacing-6: var(--a-spacing-6); // Vi prøver å hente ut originalverdien frå designsystemet
  }
`;

export default function EditTemaKnapp({ tema, setTema, tilgjengeligeTemaer }: {
	tema: Temainnhold;
	setTema: (t: Temainnhold) => void;
	tilgjengeligeTemaer: TilgjengeligTema[];
}) {
	const [modalOpen, setModalOpen] = React.useState(false);

	const tilgjengeligeUndertema = tilgjengeligeTemaer.find((t) => t.tittel === tema.tittel)?.undertema as TilgjengeligUndertema[] ?? [];

	const [myUndertema, setMyUndertema] = React.useState<TilgjengeligUndertema[]>([]);

	React.useEffect(() => {
		setMyUndertema(getDefaultMyUndertema(tilgjengeligeUndertema, tema));
	}, [tema]);

	return (
		<>
			<Button variant="tertiary" onClick={() => setModalOpen(true)} icon={<DocPencilIcon />}>Rediger tema</Button>
			<EditTemaModal open={modalOpen} onCancel={() => setModalOpen(false)}>
				<Modal.Body>
					<UndertemaSetup undertemaListe={myUndertema} setUndertemaListe={setMyUndertema} />
					<br />
					<ModalKnapper>
						<Button variant="secondary" onClick={() => {
							setMyUndertema(getDefaultMyUndertema(tilgjengeligeUndertema, tema));
							setModalOpen(false);
						}}>Avbryt</Button>
						<Button onClick={() => {
							setModalOpen(false);
							setTema({
								...tema,
								undertema: myUndertema.filter(({ valgt }) => valgt).map((v) => ({ ...v, status: "Planlagt", valgt: undefined }))
							});
						}}>Lagre</Button>
					</ModalKnapper>
				</Modal.Body>
			</EditTemaModal>
		</>
	);
}
