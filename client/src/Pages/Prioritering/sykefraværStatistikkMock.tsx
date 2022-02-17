import { SykefraversstatistikkVirksomhet } from "../../domenetyper";

const randomHeltall = () => Math.floor(Math.random() * 100);
const randomProsent = () => parseFloat((Math.random() * 100).toFixed(2));

export const sykefraværStatistikkMock: SykefraversstatistikkVirksomhet[] = [
    {
        orgnr: "987654321",
        virksomhetsnavn: "Generasjonsbaren",
        sektor: "Offentlig",
        neringsgruppe: "Kontortjenester",
        arstall: 2022,
        kvartal: 1,

        sykefraversprosent: randomProsent(),
        antallPersoner: randomHeltall(),
        muligeDagsverk: randomHeltall(),
        tapteDagsverk: randomHeltall(),
    },
    {
        orgnr: "123456789",
        virksomhetsnavn: "Antibaren",
        sektor: "Offentlig",
        neringsgruppe: "Kontortjenester",
        arstall: 2022,
        kvartal: 1,
        sykefraversprosent: randomProsent(),
        antallPersoner: randomHeltall(),
        tapteDagsverk: randomHeltall(),
        muligeDagsverk: randomHeltall(),
    },
    {
        orgnr: "123789456",
        virksomhetsnavn: "Jæger & Co",
        sektor: "Offentlig",
        neringsgruppe: "Kontortjenester",
        arstall: 2022,
        kvartal: 1,
        sykefraversprosent: randomProsent(),
        antallPersoner: randomHeltall(),
        tapteDagsverk: randomHeltall(),
        muligeDagsverk: randomHeltall(),
    },
];
