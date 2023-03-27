import { filterverdierMock } from "../src/Pages/Prioritering/mocks/filterverdierMock";
import { finnFylkerForKommuner } from "../src/util/finnFylkeForKommune";
import { sorterAlfabetisk } from "../src/util/sortering";


const fylkerMedKommuner = filterverdierMock.fylker;

describe("Finn fylke for kommune som vert sendt inn", () => {
    test('at vi finn Oslo fylke frå liste med berre Oslo kommune', () => {
        const kommuner = [{ navn: "Oslo", nummer: "0301" }]
        const fylker = finnFylkerForKommuner(kommuner, fylkerMedKommuner)
        const forventaFylker = [{
            nummer: "03",
            navn: "Oslo",
        }]

        expect(fylker).toEqual(forventaFylker)
    })

    test("at vi kan få ut ei liste med fylker (utan duplikat)", () => {
        const kommuner = [
            { navn: "Oslo", nummer: "0301" },           // Oslo
            { navn: "Vågan", nummer: "1865" },          // Nordland
            { navn: "Nord-Aurdal", nummer: "3451" },    // Innlandet
            { navn: "Træna", nummer: "1835" },          // Nordland
        ]
        const fylker = finnFylkerForKommuner(kommuner, fylkerMedKommuner)
        const forventaFylker = [
            { nummer: "34", navn: "Innlandet", },
            { nummer: "18", navn: "Nordland", },
            { nummer: "03", navn: "Oslo", },
        ]

        expect(fylker.sort((a, b) => sorterAlfabetisk(a.navn, b.navn)))
            .toEqual(forventaFylker)
    })

    test("at vi finn Aust- og Vest-Viken", () => {
        const kommuner = [
            { nummer: "3026", navn: "Aurskog-Høland", },    // Øst-Viken
            { nummer: "3024", navn: "Bærum", },             // Vest-Viken
        ]
        const fylker = finnFylkerForKommuner(kommuner, fylkerMedKommuner)
        const forventaFylker = [
            { nummer: "V30", navn: "Vest-Viken", },
            { nummer: "Ø30", navn: "Øst-Viken", },
        ]

        expect(fylker.sort((a, b) => sorterAlfabetisk(a.navn, b.navn)))
            .toEqual(forventaFylker)
    })
})
