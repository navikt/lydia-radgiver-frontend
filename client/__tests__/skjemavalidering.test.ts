import {datoSchema, iaSakshendelseSchema, IASakshendelseTypeEnum} from "../src/domenetyper";

describe("kan parse datoer", () => {

    test('kan parse datoer fra en string', () => {
        expect(datoSchema.safeParse(new Date("1/12/22")).success).toBeTruthy();
        expect(datoSchema.safeParse("2022-01-12T00:00:00.000Z").success).toBeTruthy();
    });

    test('kan parse datoer som inngår i større skjemaer', () => {
        const iaSakshendelseMock = {
            id: "23456789987654321",
            saksnummer: "123456789987654321",
            orgnummer: "123456789",
            hendelsestype: IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES,
            opprettetAv: "Z123456",
            opprettetTidspunkt: "2022-01-12T00:00:00.000Z"
        }
        const safeParseResultat = iaSakshendelseSchema.safeParse(iaSakshendelseMock)
        expect(safeParseResultat.success).toBeTruthy()
    })
})

