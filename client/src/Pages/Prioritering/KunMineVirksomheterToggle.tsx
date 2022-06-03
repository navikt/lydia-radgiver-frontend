import {CheckboxGroup, Checkbox, ToggleGroup} from "@navikt/ds-react";
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
    return CheckboxVisKunMineVirksomheter() // Toggle();
}

function CheckboxVisKunMineVirksomheter() {
    const checkedState = ["visKunMineVirksomheter"]
    const [visKunMineVirksomheter, setVisKunMineVirksomheter] = useState<boolean>(false)
    return <CheckboxGroup
        onChange={(nyToggleVerdi : string[]) => {
            console.log(nyToggleVerdi)
            setVisKunMineVirksomheter(nyToggleVerdi in checkedState)
            // onChangeCallback(skalViseKunMineVirksomheter(nyToggleVerdi))
        }}
        hideLegend={true}
        legend={"Vis kun mine virksomheter"}
        size="small"
        value={visKunMineVirksomheter ? checkedState : []}
    >
        <Checkbox value={checkedState}>
            Vis kun mine virksomheter
        </Checkbox>
    </CheckboxGroup>
}

function Toggle() {
    const [toggleVerdi, setToggleVerdi] = useState<string>(toggleVerdier.visAlleVirksomheter)
    return <ToggleGroup
        onChange={(nyToggleVerdi) => {
            setToggleVerdi(nyToggleVerdi)
            // onChangeCallback(skalViseKunMineVirksomheter(nyToggleVerdi))
        }}
        size="small"
        value={toggleVerdi}
    >
        <ToggleGroup.Item value={toggleVerdier.visKunMineVirksomheter}>
            Vis kun mine virksomheter
        </ToggleGroup.Item>
        <ToggleGroup.Item value={toggleVerdier.visAlleVirksomheter}>
            Vis alle virksomheter
        </ToggleGroup.Item>
    </ToggleGroup>
}



