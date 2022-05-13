import { ComponentMeta } from "@storybook/react";
import { Dekoratør } from "./Dekoratør";
import {Brukerinformasjon} from "../../domenetyper";

export default {
    title: "Dekoratør",
    component: Dekoratør,
} as ComponentMeta<typeof Dekoratør>;


const TRE_TIMER_MS = 1000 * 60 * 60 * 3
const FEM_SEKUNDER_MS = 1000 * 5

const brukerMedGyldigToken : Brukerinformasjon = {
    navn: "Gyldig Bruker",
    ident: "X12345",
    epost: "a@b.com",
    tokenUtløper: Date.now() + TRE_TIMER_MS
}

const brukerMedTokenSomHolderPåÅLøpeUt : Brukerinformasjon = {
    navn: "Utgått Bruker",
    ident: "X12345",
    epost: "a@b.com",
    tokenUtløper: Date.now() + FEM_SEKUNDER_MS
}

export const Autentisert = () => <Dekoratør brukerInformasjon={brukerMedGyldigToken} />

export const IkkeAutentisert = () => <Dekoratør brukerInformasjon={brukerMedTokenSomHolderPåÅLøpeUt} />
