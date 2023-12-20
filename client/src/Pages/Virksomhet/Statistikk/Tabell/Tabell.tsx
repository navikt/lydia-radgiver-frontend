import { Table } from '@navikt/ds-react';
import { HistoriskStatistikk } from '../../../../domenetyper/historiskstatistikk';
import Tabellrader from './Tabellrader';
import { ScrollUtTilKantenContainer } from '../../../../components/ScrollUtTilKantenContainer/ScrollUtTilKantenContainer';


const Tabell = ({ historiskStatistikk }: { historiskStatistikk: HistoriskStatistikk }) => {
	const visBransje = historiskStatistikk.bransjestatistikk.beskrivelse?.length > 0;

	return (
		<ScrollUtTilKantenContainer $offsetLeft={1.5} $offsetRight={1.5}>
			<Table size="small" zebraStripes={true}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell scope={'col'}>År</Table.HeaderCell>
						<Table.HeaderCell scope="col">Kvartal</Table.HeaderCell>
						<Table.HeaderCell scope="col" align="right">
							{historiskStatistikk.virksomhetsstatistikk.beskrivelse}
						</Table.HeaderCell>
						<Table.HeaderCell scope="col" align="right">
							Næring
						</Table.HeaderCell>
						{
							visBransje && <Table.HeaderCell scope="col" align="right">
								Bransje
							</Table.HeaderCell>
						}
						<Table.HeaderCell scope="col" align="right">
							Sektor
						</Table.HeaderCell>
						<Table.HeaderCell scope="col" align="right">
							Norge
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{
						<Tabellrader
							historiskStatistikk={historiskStatistikk}
							visBransje={visBransje}
						/>
					}
				</Table.Body>
			</Table>
		</ScrollUtTilKantenContainer>
	);
};

export default Tabell;
