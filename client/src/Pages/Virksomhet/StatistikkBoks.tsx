import { Badge } from "../../components/Badge/Badge";
import { FiaFarger } from "../../styling/farger";

interface Props {
    verdi: string;
    tittel: string;
}

export const StatistikkBoks = ({verdi, tittel}: Props) => {
    return (
        <div style={{flex: 1, textAlign: "center"}}>
            <Badge
                backgroundColor={FiaFarger.mørkeGrå}
                text={tittel}
                textColor={FiaFarger.hvit}
                size={"medium"}
            />
            <p
                style={{
                    fontWeight: "bold",
                    fontSize: "3rem",
                    margin: "auto",
                }}
            >
                {verdi}
            </p>
        </div>
    );
};
