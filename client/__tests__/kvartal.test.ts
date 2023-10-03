import { forrigeKvartal, lagKvartaler, nesteKvartal } from "../src/domenetyper/kvartal";

describe("Utledding av neste kvartal", () => {
    test('Utledd neste kvartal samme år', () => {
        expect(nesteKvartal({årstall: 2023, kvartal: 1}))
            .toMatchObject({årstall: 2023, kvartal: 2})
    })
    test('Utledd neste kvartal i neste år', () => {
        expect(nesteKvartal({årstall: 2022, kvartal: 4}))
            .toMatchObject({årstall: 2023, kvartal: 1})
    })
})

describe("Utledding av forrige kvartal", () => {
    test('Utledd forrige kvartal samme år', () => {
        expect(forrigeKvartal({årstall: 2023, kvartal: 3}))
            .toMatchObject({årstall: 2023, kvartal: 2})
    })
    test('Utledd forrige kvartal i fjor', () => {
        expect(forrigeKvartal({årstall: 2023, kvartal: 1}))
            .toMatchObject({årstall: 2022, kvartal: 4})
    })
})

describe("Utledding av kvartaler", () => {
    test('Utledd 1 kvartal', () => {
        expect(lagKvartaler({årstall: 2023, kvartal: 3}, 1))
            .toMatchObject([{årstall: 2023, kvartal: 3}])
    })
    test('Utledd mange kvartaler', () => {
        expect(lagKvartaler({årstall: 2023, kvartal: 3}, 6))
            .toMatchObject([
                {årstall: 2023, kvartal: 3},
                {årstall: 2023, kvartal: 2},
                {årstall: 2023, kvartal: 1},
                {årstall: 2022, kvartal: 4},
                {årstall: 2022, kvartal: 3},
                {årstall: 2022, kvartal: 2}
                ]
            )
    })
})
