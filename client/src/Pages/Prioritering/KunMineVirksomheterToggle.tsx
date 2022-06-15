import {ToggleGroup} from "@navikt/ds-react";
import {useState} from "react";

interface Props {
    onChangeCallback : (b : boolean) => void
}
const toggleVerdier = {
    visAlleVirksomheter: "visAlleVirksomheter",
    visKunMineVirksomheter: "visKunMineVirksomheter"
}

const skalViseKunMineVirksomheter = (toggleVerdi : string) =>
    toggleVerdi === toggleVerdier.visKunMineVirksomheter

export const KunMineVirksomheterToggle = ({ onChangeCallback } : Props) => {
    const [toggleVerdi, setToggleVerdi] = useState<string>(toggleVerdier.visAlleVirksomheter)
    return <ToggleGroup
        onChange={(nyToggleVerdi) => {
            setToggleVerdi(nyToggleVerdi)
            onChangeCallback(skalViseKunMineVirksomheter(nyToggleVerdi))
        }}
        size="medium"
        value={toggleVerdi}
    >
        <ToggleGroup.Item value={toggleVerdier.visAlleVirksomheter}>
            Vis alle
        </ToggleGroup.Item>
        <ToggleGroup.Item value={toggleVerdier.visKunMineVirksomheter}>
            Vis kun mine
        </ToggleGroup.Item>
    </ToggleGroup>
}
