import {
    LeveranseStatusEnum,
    MineIATjenester,
} from "../../domenetyper/leveranse";
import { iaTjenester, moduler } from "../Virksomhet/mocks/leveranseMock";

export const mineIATjenesterMock: MineIATjenester[] = [
    {
        orgnr: "995428563",
        virksomhetsnavn: "SUSHISHAPPA PÅ HJØRNET AS",
        iaTjeneste: iaTjenester[0],
        modul: moduler.find((modul) => modul.id == 15) || moduler[0],
        tentativFrist: new Date(),
        status: LeveranseStatusEnum.enum.UNDER_ARBEID,
    },
    {
        orgnr: "995428563",
        virksomhetsnavn: "SUSHISHAPPA PÅ HJØRNET AS",
        iaTjeneste: iaTjenester[1],
        modul: moduler.find((modul) => modul.id == 16) || moduler[0],
        tentativFrist: new Date(),
        status: LeveranseStatusEnum.enum.UNDER_ARBEID,
    },
    {
        orgnr: "974589095",
        virksomhetsnavn: "RÅNEHJØRNET AS",
        iaTjeneste: iaTjenester[2],
        modul: moduler.find((modul) => modul.id == 17) || moduler[0],
        tentativFrist: new Date(),
        status: LeveranseStatusEnum.enum.UNDER_ARBEID,
    },
    {
        orgnr: "123456789",
        virksomhetsnavn: "FREDLØS SPA OG MEDITASJON AS",
        iaTjeneste: iaTjenester[0],
        modul: moduler.find((modul) => modul.id == 1) || moduler[0],
        tentativFrist: new Date(),
        status: LeveranseStatusEnum.enum.UNDER_ARBEID,
    },
];
