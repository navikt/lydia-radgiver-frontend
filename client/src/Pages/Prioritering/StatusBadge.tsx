import {IAProsessStatusType} from "../../domenetyper";
import "@navikt/ds-css";
import {Badge} from "../../components/Badge/Badge";

interface StatusBadgeProps {
    status: IAProsessStatusType
}

export const StatusBadge = ({status}: StatusBadgeProps) => {
    const {text, backgroundColor, color} = hentBadgeFraStatus(status)

    return (<Badge color={color} backgroundColor={backgroundColor} text={text}/>)
}



const textColors = {
    black: "#000000",
    white: "#FFFFFF"
}

interface BadgeData {
    text: string,
    color: string,
    backgroundColor: string
}

export function hentBadgeFraStatus(status: IAProsessStatusType): BadgeData {
    switch (status) {
        case "VURDERES": {
            return {
                text: "Vurderes",
                backgroundColor: "#D8F9FF",
                color: textColors.black
            }
        }
        case "IKKE_AKTIV": {
            return {
                text: "Ikke aktivt",
                backgroundColor: "#C9C9C9",
                color: textColors.white
            }
        }
        case "KONTAKTES": {
            return {
                text: "Kontaktes",
                color: textColors.black,
                backgroundColor: "#CCE1FF"
            }
        }
        case "IKKE_AKTUELL": {
            return {
                text: "Ikke aktuell",
                color: textColors.white,
                backgroundColor: "#EFA89D"
            }
        }
        default: throw new Error("Ukjent prosess-status")
    }
}
