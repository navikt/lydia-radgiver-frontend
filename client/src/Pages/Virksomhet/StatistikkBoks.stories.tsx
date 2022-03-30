import {ComponentMeta} from "@storybook/react";
import {StatistikkBoks} from "./StatistikkBoks";
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {sykefraværsstatistikkMock} from "../Prioritering/mocks/sykefraværsstatistikkMock";

export default {
    title: "StatistikkBoks",
    component: StatistikkBoks,
} as ComponentMeta<typeof StatistikkBoks>;

const { tapteDagsverk, muligeDagsverk, sykefraversprosent, antallPersoner }: SykefraversstatistikkVirksomhet = sykefraværsstatistikkMock[0]

export const Hovedstory = () => {
    return (<div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <StatistikkBoks verdi={sykefraversprosent} tittel="Sykefravær" bakgrunnsfarge={"#D47B00"} type="percent" inheritColor/>
        <StatistikkBoks verdi={antallPersoner} tittel="Antall arbeidsforhold" bakgrunnsfarge={"#A0A0A0"} type="decimal" />
        <StatistikkBoks verdi={muligeDagsverk} tittel="Avtalte dagsverk" bakgrunnsfarge={"#A0A0A0"} type="decimal" />
        <StatistikkBoks verdi={tapteDagsverk} tittel="Tapte dagsverk" bakgrunnsfarge={"#A32A17"} type="decimal" inheritColor />
    </div>)
}