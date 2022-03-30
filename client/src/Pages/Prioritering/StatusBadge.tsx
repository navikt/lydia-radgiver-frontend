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
        case "TAKKET_NEI": {
            return {
                text: "Har takket nei",
                color: textColors.white,
                backgroundColor: "#E18071"
            }
        }
        case "GJENNOMFORING":
        case "EVALUERING": {
            return {
                text: "Vi bistår",
                backgroundColor: "#99DEAD",
                color: textColors.black
            }
        }
        case "PRIORITERT": {
            return {
                text: "Ta kontakt",
                backgroundColor: "#CCE1FF",
                color: textColors.black
            }
        }
        case "AVSLUTTET":
        case "IKKE_AKTIV":
        case "NY": {
            return {
                text: "Ikke aktivt",
                backgroundColor: "#A0A0A0",
                color: textColors.white
            }
        }
        case "KARTLEGGING": {
            return {
                text: "Kartlegges",
                color: textColors.black,
                backgroundColor: "#FFD799"
            }
        }
        case "AVSLATT_AV_NALS": {
            return {
                text: "Avslått av NALS",
                color: textColors.white,
                backgroundColor: "#E18071"
            }
        }
        default: throw new Error("Ukjent prosess-status")
    }
}
