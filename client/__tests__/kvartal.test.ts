import { nesteKvartal } from "../src/domenetyper/kvartal";

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
