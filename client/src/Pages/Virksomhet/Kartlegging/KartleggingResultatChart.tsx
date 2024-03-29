import styled from "styled-components";

const ChartWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const BarWrapper = styled.div`
	display: flex;
	width: 100%;
`;

const Bar = styled.div<{$prosent: number, $farge: string}>`
	background-color: ${props => props.$farge};
	width: ${props => props.$prosent}%;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 600;
`;

const LabelList = styled.ul`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	margin-top: 1rem;
`;

const Label = styled.li`
	list-style-type: none;
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 0.5rem;
`;

const LabelBox = styled.div<{$farge: string}>`
	width: 1rem;
	height: 1rem;
	margin-right: 0.5rem;
	margin-left: 0.5rem;
	background-color: ${props => props.$farge};
`

export default function StackedBarChart({harNokDeltakere, spørsmål}: { harNokDeltakere: boolean, spørsmål: {
    spørsmålId: string;
    tekst: string;
    svarListe: {
        svarId: string;
        tekst: string;
        antallSvar: number;
        prosent: number;
    }[];
}}) {

    const svarGrafFarger: string[] = [
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#ff8042",
        "#8dd1e1",
    ];

    function getSvarGrafFarge(index: number): string {
        return svarGrafFarger[index % svarGrafFarger.length];
    }

    return (
        <ChartWrapper>
            <BarWrapper>
                {harNokDeltakere ? spørsmål.svarListe.map((svar, index) =>
                    (svar.prosent > 0) &&  (
                        <Bar key={svar.svarId} $prosent={svar.prosent} $farge={getSvarGrafFarge(index)}>
                            {svar.prosent.toFixed(0)}%
                        </Bar>
                    )) : (
                    <Bar $prosent={100} $farge="#ccc">
                        For få deltakere
                    </Bar>
                )}
            </BarWrapper>
            <LabelList>
                {spørsmål.svarListe.map((svar, index) => (
                    <Label key={svar.svarId}>
                        {harNokDeltakere ?
                            <>
                                <LabelBox $farge={getSvarGrafFarge(index)} />{svar.tekst}: {svar.prosent.toFixed(0)}%
                            </>
                            :
                            <>
                                <LabelBox $farge={getSvarGrafFarge(index)} /> {svar.tekst}
                            </>
                        }

					</Label>
                ))}
            </LabelList>
        </ChartWrapper>
    )
}