import { Table } from '@navikt/ds-react';
import { HistoriskStatistikk } from '../../../../domenetyper/historiskstatistikk';
import Tabellrader from './Tabellrader';
import styled from 'styled-components';

const Container = styled.div`
	overflow-x: auto;
`;


const Tabell = ({ historiskStatistikk }: { historiskStatistikk: HistoriskStatistikk }) => {
	const visBransje = historiskStatistikk.bransjestatistikk.beskrivelse?.length > 0;

	return (
		<Container>
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
		</Container>
	);
};

export default Tabell;
