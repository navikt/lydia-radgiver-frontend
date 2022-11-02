import { Badge } from "../../components/Badge/Badge";
import { FiaFarger } from "../../styling/farger";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  text-align: center;
`;

const Verdi = styled.div`
  font-weight: bold;
  font-size: 3rem;
  margin: auto;
`;

interface Props {
    verdi: string;
    tittel: string;
}

export const StatistikkBoks = ({verdi, tittel}: Props) => {
    return (
        <Container>
            <Badge
                backgroundColor={FiaFarger.mørkeGrå}
                text={tittel}
                textColor={FiaFarger.hvit}
                size={"medium"}
            />
            <Verdi>{verdi}</Verdi>
        </Container>
    );
};
