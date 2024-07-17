import React from "react";
import { TilgjengeligTema } from "./PlanFane";
import { Arbeidsperiodestatus, Temainnhold } from "./UndertemaConfig";
import { Button, Checkbox, CheckboxGroup, HStack, Modal, MonthPicker, TimelinePeriodProps } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import { mobileAndUp } from "../../../styling/breakpoints";
import { DocPencilIcon } from '@navikt/aksel-icons';

const StyledModal = styled(Modal)`
  padding: 0rem;
  max-width: 64rem;
  --a-spacing-6: 0.5rem;
  
  ${mobileAndUp} {
    padding: 1.5rem;
    --a-spacing-6: var(--a-spacing-6); // Vi prøver å hente ut originalverdien frå designsystemet
  }
`;

type TilgjengeligUndertema = {
	valgt: boolean;
	tittel: string;
	start: Date
	slutt: Date
	status?: Arbeidsperiodestatus;
	statusfarge: TimelinePeriodProps["status"];
}

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
			<StyledModal open={modalOpen} onCancel={() => setModalOpen(false)}>
				<Modal.Body>
					<CheckboxGroup
						legend="Undertemaer"
						description="Velg hvilke undertemaer dere skal jobbe med under samarbeidsperioden"
						value={myUndertema.filter(({ valgt }) => valgt).map(({ tittel }) => tittel)}
						onChange={(valgte) => {
							setMyUndertema(
								myUndertema.map((ut) => {
									const valgt = valgte.indexOf(ut.tittel) !== -1;
									const start = ut.start ?? new Date();
									const slutt = ut.slutt ?? new Date(start);

									if (!ut.slutt) {
										slutt.setMonth(slutt.getMonth() + 1);
									}

									return {
										...ut,
										valgt,
										start,
										slutt
									}
								})
							)
						}}
					>
						{
							myUndertema?.map((undertema, index) => {
								const settMittUndertema = (undertema: TilgjengeligUndertema) => {
									const nyMyUndertema = [...myUndertema];

									nyMyUndertema[index] = undertema;

									setMyUndertema(nyMyUndertema);
								}

								const setStart = (d: Date) => {
									if (myUndertema) {
										settMittUndertema({ ...undertema, start: d });
									}
								}
								const setSlutt = (d: Date) => {
									if (myUndertema) {
										settMittUndertema({ ...undertema, slutt: d });
									}
								}

								return (
									<HStack key={undertema.tittel} justify="space-between" gap="4" align="center">
										<Checkbox value={undertema.tittel}>
											{undertema.tittel}
										</Checkbox>
										{
											undertema.valgt ?
												(<HStack align="center" gap="05">
													<MonthPicker selected={undertema.start} defaultSelected={undertema.start} onMonthSelect={(m) => {
														if (m) {
															setStart(m);
														}
													}}>
														<MonthPicker.Input hideLabel onChange={() => null} label="Start" value={`${undertema?.start?.toLocaleString('default', { month: 'short' })} ${undertema?.start?.getFullYear()}`} />
													</MonthPicker>
													{" - "}
													<MonthPicker selected={undertema.slutt} onMonthSelect={(m) => {
														if (m) {
															setSlutt(m);
														}
													}}>
														<MonthPicker.Input hideLabel onChange={() => null} label="Slutt" value={`${undertema?.slutt?.toLocaleString('default', { month: 'short' })} ${undertema?.slutt?.getFullYear()}`} />
													</MonthPicker>
												</HStack>) : undefined
										}
									</HStack>
								)
							})
						}
					</CheckboxGroup>
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
			</StyledModal>
		</>
	);
}

function getDefaultMyUndertema(tilgjengeligeUndertema: TilgjengeligUndertema[] | undefined, tema: Temainnhold) {
	if (tilgjengeligeUndertema === undefined) {
		return [];
	} else {
		return tilgjengeligeUndertema.map((ut) => {
			const myUndertema = tema.undertema.find((v) => v.tittel === ut.tittel);
			if (myUndertema) {
				return { ...myUndertema, valgt: true };
			}

			const start = new Date();
			const slutt = new Date(start);
			slutt.setMonth(slutt.getMonth() + 1);

			return {
				valgt: false,
				tittel: ut.tittel,
				start,
				slutt,
				status: undefined,
				statusfarge: ut.statusfarge
			}
		});
	}
}