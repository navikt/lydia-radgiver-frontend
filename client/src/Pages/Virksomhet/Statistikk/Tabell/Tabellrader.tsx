import React, { FunctionComponent } from 'react';
import { Table } from '@navikt/ds-react';
import { formaterProsent } from './tabell-utils';
import { HistoriskStatistikk } from '../../../../domenetyper/historiskstatistikk';

type TabellRadProps = {
	historiskStatistikk: HistoriskStatistikk;
	visBransje: boolean;
};

function genererTabellRader(historiskStatistikk: HistoriskStatistikk, visBransje: boolean) {
	let førsteKvartal = undefined as { kvartal: number, årstall: number } | undefined;
	let sisteKvartal = undefined as { kvartal: number, årstall: number } | undefined;

	const keys = Object.keys(historiskStatistikk);

	for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
		const iterator = keys[keyIndex] as keyof HistoriskStatistikk;
		const statistikkobjekt = historiskStatistikk[iterator];
		if (iterator === "bransjestatistikk" && !visBransje) {
			continue;
		}

		for (let index = 0; index < statistikkobjekt.statistikk.length; index++) {
			const statistikk = statistikkobjekt.statistikk[index];
			if (førsteKvartal === undefined
				|| førsteKvartal.årstall > statistikk.årstall
				|| (førsteKvartal.årstall === statistikk.årstall && førsteKvartal.kvartal > statistikk.kvartal)) {
				førsteKvartal = { kvartal: statistikk.kvartal, årstall: statistikk.årstall };
			}

			if (sisteKvartal === undefined
				|| sisteKvartal.årstall < statistikk.årstall
				|| (sisteKvartal.årstall === statistikk.årstall && sisteKvartal.kvartal < statistikk.kvartal)) {
				sisteKvartal = { kvartal: statistikk.kvartal, årstall: statistikk.årstall };
			}
		}
	}

	if (førsteKvartal === undefined || sisteKvartal === undefined) {
		return [];
	}

	const rader = [] as {
		årstall: number,
		kvartal: number,
		virksomhet?: string,
		bransje?: string,
		næring?: string,
		sektor?: string,
		land?: string
	}[];

	let aktivtÅrstall = førsteKvartal.årstall;
	let aktivtKvartal = førsteKvartal.kvartal;
	while (aktivtÅrstall <= sisteKvartal.årstall) {
		while ((aktivtÅrstall === sisteKvartal.årstall && aktivtKvartal <= sisteKvartal.kvartal)
			|| (aktivtÅrstall < sisteKvartal.årstall && aktivtKvartal <= 4)) {

			rader.push({
				årstall: aktivtÅrstall,
				kvartal: aktivtKvartal,
				virksomhet: formaterProsent(finnStatistikkverdi(historiskStatistikk, "virksomhetsstatistikk", aktivtÅrstall, aktivtKvartal)),
				bransje: formaterProsent(finnStatistikkverdi(historiskStatistikk, "bransjestatistikk", aktivtÅrstall, aktivtKvartal)),
				næring: formaterProsent(finnStatistikkverdi(historiskStatistikk, "næringsstatistikk", aktivtÅrstall, aktivtKvartal)),
				sektor: formaterProsent(finnStatistikkverdi(historiskStatistikk, "sektorstatistikk", aktivtÅrstall, aktivtKvartal)),
				land: formaterProsent(finnStatistikkverdi(historiskStatistikk, "landsstatistikk", aktivtÅrstall, aktivtKvartal)),
			});
			aktivtKvartal++;
		}

		aktivtKvartal = 1;
		aktivtÅrstall++;
	}

	return rader;
}

function finnStatistikkverdi(historiskStatistikk: HistoriskStatistikk, statistikktype: keyof HistoriskStatistikk, årstall: number, kvartal: number) {
	const funnetVerdi = historiskStatistikk[statistikktype].statistikk.find(statistikk => statistikk.årstall === årstall && statistikk.kvartal === kvartal);

	return funnetVerdi ? { erMaskert: funnetVerdi.maskert, prosent: funnetVerdi.sykefraværsprosent } : undefined;
}

export const Tabellrader: FunctionComponent<TabellRadProps> = ({
	historiskStatistikk,
	visBransje
}: TabellRadProps) => {
	const rader = genererTabellRader(historiskStatistikk, visBransje).reverse();

	return (
		<>
			{rader.map((rad) => {
				const {
					årstall,
					kvartal,
					virksomhet,
					næring,
					bransje,
					sektor,
					land,
				} = rad;
				return (
					<Table.Row key={årstall + '-' + kvartal}>
						<Table.DataCell>{årstall}</Table.DataCell>
						<Table.DataCell>{kvartal}</Table.DataCell>
						<Table.DataCell align={'right'}>
							{virksomhet}
						</Table.DataCell>
						<Table.DataCell align={'right'}>
							{næring}
						</Table.DataCell>
						{
							visBransje && <Table.DataCell align={'right'}>
								{bransje}
							</Table.DataCell>
						}
						<Table.DataCell align={'right'}>{sektor}</Table.DataCell>
						<Table.DataCell align={'right'}>{land}</Table.DataCell>
					</Table.Row>
				);
			})}
		</>
	);
};

export default Tabellrader;
