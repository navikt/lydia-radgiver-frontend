import { Checkbox, CheckboxGroup, HStack, MonthPicker, TimelinePeriodProps } from "@navikt/ds-react";
import { Arbeidsperiodestatus, Temainnhold } from "./UndertemaConfig";
import styled from "styled-components";

export type TilgjengeligUndertema = {
	valgt: boolean;
	tittel: string;
	start?: Date
	slutt?: Date
	status: Arbeidsperiodestatus;
	statusfarge: TimelinePeriodProps["status"];
}

const UndertemaRad = styled(HStack)`
	margin-bottom: 0.5rem;
`;

export default function UndertemaSetup({ undertemaListe, setUndertemaListe, legend = "Undertemaer" }: {
	undertemaListe: TilgjengeligUndertema[];
	setUndertemaListe: (ut: TilgjengeligUndertema[]) => void;
	legend?: string
}) {
	return (
		<CheckboxGroup
			legend={legend}
			description="Velg hvilke undertemaer dere skal jobbe med og når"
			value={undertemaListe.filter(({ valgt }) => valgt).map(({ tittel }) => tittel)}
			onChange={(valgte) => {
				setUndertemaListe(
					undertemaListe.map((ut) => {
						const valgt = valgte.indexOf(ut.tittel) !== -1;
						const start = ut.start ?? new Date();
						if (!ut.start) {
							start.setDate(1);
						}
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
				undertemaListe?.map((undertema, index) => {
					const settMittUndertema = (undertema: TilgjengeligUndertema) => {
						const nyMyUndertema = [...undertemaListe];

						nyMyUndertema[index] = undertema;

						setUndertemaListe(nyMyUndertema);
					}

					const setStart = (d: Date) => {
						if (undertemaListe) {
							settMittUndertema({ ...undertema, start: d });
						}
					}
					const setSlutt = (d: Date) => {
						if (undertemaListe) {
							settMittUndertema({ ...undertema, slutt: d });
						}
					}

					return (
						<UndertemaRad key={undertema.tittel} justify="space-between" gap="4" align="center">
							<Checkbox value={undertema.tittel}>
								{undertema.tittel}
							</Checkbox>
							{
								undertema.valgt ?
									(<HStack align="center" gap="3">
										<MonthPicker selected={undertema.start} defaultSelected={undertema.start} onMonthSelect={(m) => {
											if (m) {
												setStart(m);
											}
										}}>
											<MonthPicker.Input
												hideLabel
												size="small"
												onChange={() => null}
												label={`Startdato for ${undertema.tittel}`}
												value={`${undertema?.start?.toLocaleString('default', { month: 'short' })} ${undertema?.start?.getFullYear()}`} />
										</MonthPicker>
										{" - "}
										<MonthPicker selected={undertema.slutt} onMonthSelect={(m) => {
											if (m) {
												setSlutt(m);
											}
										}}>
											<MonthPicker.Input
												hideLabel
												size="small"
												onChange={() => null}
												label={`Sluttdato for ${undertema.tittel}`}
												value={`${undertema?.slutt?.toLocaleString('default', { month: 'short' })} ${undertema?.slutt?.getFullYear()}`} />
										</MonthPicker>
									</HStack>) : undefined
							}
						</UndertemaRad>
					)
				})
			}
		</CheckboxGroup>
	);
}

export function getDefaultMyUndertema(tilgjengeligeUndertema: TilgjengeligUndertema[] | undefined, tema: Temainnhold): TilgjengeligUndertema[] {
	if (tilgjengeligeUndertema === undefined) {
		return [];
	} else {
		return tilgjengeligeUndertema.map((ut) => {
			const undertemaListe = tema.undertema.find((v) => v.tittel === ut.tittel);
			if (undertemaListe) {
				return { ...undertemaListe, valgt: true };
			}

			const start = new Date();
			const slutt = new Date(start);
			slutt.setMonth(slutt.getMonth() + 1);

			return {
				valgt: false,
				tittel: ut.tittel,
				start,
				slutt,
				status: "Planlagt",
				statusfarge: ut.statusfarge
			}
		});
	}
}