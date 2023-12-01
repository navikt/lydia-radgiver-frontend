import { LeveranseStatusEnum, MineLeveranser } from "../../domenetyper/leveranse";
import { iaTjenester, moduler } from "../Virksomhet/mocks/leveranseMock";

export const mineLeveranserMock: MineLeveranser[] = [
    {
        orgnr: "995428563",
        virksomhetsnavn: "SUSHISHAPPA PÅ HJØRNET",
        iaTjeneste: iaTjenester[1],
        modul: moduler[15],
        tentativFrist: new Date(),
        status: LeveranseStatusEnum.enum.UNDER_ARBEID,
    },
    {
        orgnr: "995428563",
        virksomhetsnavn: "SUSHISHAPPA PÅ HJØRNET",
        iaTjeneste: iaTjenester[2],
        modul: moduler[16],
        tentativFrist: new Date(),
        status: LeveranseStatusEnum.enum.UNDER_ARBEID,
    },
    {
        orgnr: "974589095",
        virksomhetsnavn: "RUNE RUDBERGS RÅNEHJØRNE",
        iaTjeneste: iaTjenester[3],
        modul: moduler[17],
        tentativFrist: new Date(),
        status: LeveranseStatusEnum.enum.UNDER_ARBEID,
    },
];
