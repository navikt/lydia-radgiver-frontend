import { Meta } from "@storybook/react";
import { Statistikkboks } from "./Statistikkboks";

export default {
    title: "Virksomhet/Virksomhetsoversikt/Statistikkboks",
    component: Statistikkboks,
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
} as Meta<typeof Statistikkboks>;

export const Arbeidsforhold = () => <Statistikkboks tittel="Arbeidsforhold" verdi="5001"
                                                    helpTekst="Antall arbeidsforhold i siste kvartal"/>

export const Sykefravarsprosent = () => <Statistikkboks tittel="Sykefravær" verdi="14.0%"
                                                        helpTekst="Sykefraværsprosent siste 4 kvartal"/>

export const SykefravarsprosentMedVerdiSisteKvartal = () =>
    <Statistikkboks tittel="Sykefravær" verdi="14.0%" verdiSisteKvartal={{verdi:"13.4%", år:2023, kvartal:1}}
                    helpTekst="Sykefraværsprosent siste 4 kvartal"/>

export const TapteDagsverkMedVerdiSisteKvartal = () =>
    <Statistikkboks tittel="Tapte dagsverk" verdi="142" verdiSisteKvartal={{verdi:"11", år:2023, kvartal:1}}
                    helpTekst="Antall tapte dagsverk siste 4 kvartal"/>

export const MuligeDagsverkMedVerdiSisteKvartal = () =>
    <Statistikkboks verdi="343" tittel="Mulige dagsverk" verdiSisteKvartal={{verdi:"345", år:2023, kvartal:1}}
                    helpTekst="Antall mulige dagsverk siste 4 kvartal"/>

export const Gradering = () =>
    <Statistikkboks verdi="20%" tittel="Gradert sykmelding" verdiSisteKvartal={{verdi:"14%", år:2023, kvartal:1}}
                    helpTekst="Graderingsprosent siste 4 kvartal"/>

export const GraderingUtenVerdiSisteKvartal = () =>
    <Statistikkboks verdi="20%" tittel="Gradert sykmelding" verdiSisteKvartal={undefined}
                    helpTekst="Graderingsprosent siste 4 kvartal"/>


