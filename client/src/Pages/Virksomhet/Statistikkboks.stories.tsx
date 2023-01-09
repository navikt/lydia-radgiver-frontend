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
                <Story/>
            </div>
        )
    ],
} as ComponentMeta<typeof SykefraværsstatistikkVirksomhet>;

export const Arbeidsforhold = () => <StatistikkBoks tittel="Arbeidsforhold" verdi="5001"
                                                    helpTekst="Antall arbeidsforhold i siste kvartal"/>

export const Sykefravarsprosent = () => <StatistikkBoks tittel="Sykefravær" verdi="14.0%"
                                                        helpTekst="Sykefraværsprosent siste 4 kvartal"/>

export const SykefravarsprosentMedVerdiSisteKvartal = () =>
    <StatistikkBoks tittel="Sykefravær" verdi="14.0%" verdiSisteKvartal={{verdi:"13.4%", år:2023, kvartal:1}}
                    helpTekst="Sykefraværsprosent siste 4 kvartal"/>

export const TapteDagsverkMedVerdiSisteKvartal = () =>
    <StatistikkBoks tittel="Tapte dagsverk" verdi="142" verdiSisteKvartal={{verdi:"11", år:2023, kvartal:1}}
                    helpTekst="Antall tapte dagsverk siste 4 kvartal"/>

export const MuligeDagsverkMedVerdiSisteKvartal = () =>
    <StatistikkBoks verdi="343" tittel="Mulige dagsverk" verdiSisteKvartal={{verdi:"345", år:2023, kvartal:1}}
                    helpTekst="Antall mulige dagsverk siste 4 kvartal"/>
