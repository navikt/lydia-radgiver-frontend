import { Badge } from "../../components/Badge/Badge";

const percentFormatter: Formatter = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 1,
    style: "percent",
});
const decimalFormatter: Formatter = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
    style: "decimal",
});
const stringFormatter: Formatter = {
    format(value: number): string {
        return value.toString();
    },
};

type FormatterType = "percent" | "decimal";

function getFormatter(type: FormatterType) {
    switch (type) {
        case "decimal":
            return decimalFormatter;
        case "percent":
            return percentFormatter;
        default:
            return stringFormatter;
    }
}

interface Formatter {
    format(value: number): string;
}

interface Props {
    verdi: number;
    tittel: string;
    bakgrunnsfarge: string;
    type: FormatterType;
}

export const StatistikkBoks = ({
    verdi,
    tittel,
    type,
    bakgrunnsfarge,
}: Props) => {
    const formatter = getFormatter(type);
    return (
        <div style={{flex: 1}}>
            <Badge
                color="white"
                backgroundColor={bakgrunnsfarge}
                text={tittel}
                customStyles={{ width: "16rem" }}
            />
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        fontWeight: "bold",
                        fontSize: "3rem",
                        margin: "auto",
                    }}
                >
                    {formatter.format(verdi)}
                </p>
            </div>
        </div>
    );
};
