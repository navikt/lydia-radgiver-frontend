import { ComponentMeta } from "@storybook/react";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";
import { StatistikkBoks } from "./StatistikkBoks";

export default {
    title: "Virksomhet/Statistikkboks",
    component: StatistikkBoks,
    parameters: {
        backgrounds: {
            default: 'white'
        }
    },
    decorators: [
        (Story) => (
            <div style={{width: 230 / 16 + "px"}}> {/* Min-width StatistikkBoks-container */}
                <Story />
            </div>
        )
    ],
} as ComponentMeta<typeof SykefraværsstatistikkVirksomhet>;

export const Arbeidsforhold = () => <StatistikkBoks tittel="Arbeidsforhold" verdi="5001" />

export const Sykefravarsprosent = () => <StatistikkBoks tittel="Sykefravær" verdi="14.0%" />

export const SykefravarsprosentMedVerdiSisteKvartal = () =>
    <StatistikkBoks tittel="Sykefravær" verdi="14.0%" verdiSisteKvartal="13.4%" />

export const TapteDagsverkMedVerdiSisteKvartal = () =>
    <StatistikkBoks tittel="Tapte dagsverk" verdi="142" verdiSisteKvartal="11" />

export const MuligeDagsverkMedVerdiSisteKvartal = () =>
    <StatistikkBoks verdi="343" tittel="Mulige dagsverk" verdiSisteKvartal="345" />
