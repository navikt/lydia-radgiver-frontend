import React from "react";
import { TilgjengeligTema } from "./PlanFane";
import { Temainnhold, TemainnholdBase } from "./UndertemaConfig";
import { Button, Checkbox, CheckboxGroup, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import UndertemaSetup, { TilgjengeligUndertema } from "./UndertemaSetup";
import styled from "styled-components";

export default function LeggTilTemaKnapp({ temaer, setTemaer, tilgjengeligeTemaer }: {
	temaer: Temainnhold[];
	setTemaer: (t: Temainnhold[]) => void;
	tilgjengeligeTemaer: TilgjengeligTema[];
}) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [valgteTemaer, setValgteTemaer] = React.useState<string[]>(temaer.map((t) => t.tittel));
	const [myTemaliste, setMyTemaliste] = React.useState<TemainnholdBase<TilgjengeligUndertema>[]>(transformTemaliste(tilgjengeligeTemaer, temaer));

	return (
		<>
			<Button onClick={() => setModalOpen(true)} disabled={tilgjengeligeTemaer.length === 0}>Legg til tema</Button>
			<LeggTilTemaModal open={modalOpen} onClose={() => setModalOpen(false)} aria-label="Legg til tema">
				<Modal.Body>
					<CheckboxGroup
						legend="Velg tema i samarbeidsplan"
						description="Velg hvilke temaer dere skal jobbe med under samarbeidsperioden"
						value={valgteTemaer}
						onChange={setValgteTemaer}>
						{
							myTemaliste.map((tema) => (
								<>
									<Checkbox
										key={tema.tittel}
										value={tema.tittel}>
										{tema.tittel}
									</Checkbox>
									{
										valgteTemaer.includes(tema.tittel) && (
											<UndertemaSetupContainer>
												<UndertemaSetup
													legend={`Undertemaer for ${tema.tittel}`}
													undertemaListe={tema.undertema}
													setUndertemaListe={(ut) => {
														const nyTemaliste = [...myTemaliste];
														const temaIndex = nyTemaliste.findIndex((t) => t.tittel === tema.tittel);

														nyTemaliste[temaIndex] = {
															...nyTemaliste[temaIndex],
															undertema: ut
														};

														setMyTemaliste(nyTemaliste);
													}} />
											</UndertemaSetupContainer>
										)
									}
								</>
							))
						}
					</CheckboxGroup>
					<br />
					<ModalKnapper>
						<Button variant="secondary" onClick={() => {
							setValgteTemaer(temaer.map((t) => t.tittel));
							setModalOpen(false);
						}}>
							Avbryt
						</Button>
						<Button onClick={() => {
							setTemaer(myTemaliste.filter((t) => valgteTemaer.includes(t.tittel)).map((t) => ({
								...t,
								undertema: t.undertema.filter(({ valgt }) => valgt).map((v) => ({ ...v, status: "Planlagt", valgt: undefined }))
							})));
							setModalOpen(false);
						}}>
							Lagre
						</Button>
					</ModalKnapper>
				</Modal.Body>
			</LeggTilTemaModal>
		</>
	)
}

const UndertemaSetupContainer = styled.div`
	margin-bottom: 1rem;
	padding: 1rem;
	margin-left: 2rem;
	background-color: var(--a-surface-subtle);
	border-radius: var(--a-border-radius-medium);
`;

const LeggTilTemaModal = styled(Modal)`
  max-width: 72rem;
`;

function transformTemaliste(tilgjengeligeTemaer: TilgjengeligTema[], temaer: Temainnhold[]): TemainnholdBase<TilgjengeligUndertema>[] {
	return tilgjengeligeTemaer.map(
		(tilgjengeligTema) => {
			const tema = temaer.find((t) => t.tittel === tilgjengeligTema.tittel);
			if (tema) {
				return {
					...tema,
					undertema: tilgjengeligTema.undertema.map((undertema) => {
						const myUndertema = tema.undertema.find((ut) => ut.tittel === undertema.tittel);

						if (myUndertema) {
							return {
								...myUndertema,
								valgt: true,
							};
						}

						return {
							...undertema,
							valgt: false,
							status: "Planlagt",
						};
					}),
				};
			}

			return {
				...tilgjengeligTema,
				undertema: tilgjengeligTema.undertema.map((undertema) => ({
					...undertema,
					valgt: false,
					status: "Planlagt",
				})),
				verktøy: []
			};
		}
	);
}