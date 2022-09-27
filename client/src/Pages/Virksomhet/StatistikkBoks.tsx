import { Badge, Farge } from "../../components/Badge/Badge";

interface Props {
    verdi: string;
    tittel: string;
}

export const StatistikkBoks = ({verdi, tittel}: Props) => {
    return (
        <div style={{flex: 1, textAlign: "center"}}>
            <Badge
                backgroundColor={Farge.mørkeGrå}
                text={tittel}
                textColor={Farge.hvit}
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
