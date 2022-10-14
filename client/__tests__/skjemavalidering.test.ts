import {datoSchema, iaSakSchema, iaSakshendelseSchema, IASakshendelseTypeEnum} from "../src/domenetyper";

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

    test('kan parse iasak med null felter', () => {
        const iaSakMock = {
            "saksnummer": "01G13JC25YFF9Y13KZBR171V0N",
            "orgnr": "974623528",
            "status": "VURDERES",
            "opprettetAv": "Z994139",
            "opprettetTidspunkt": "2022-04-20T15:25:16.606882",
            "endretTidspunkt": "2022-04-20T15:25:16.606882",
            "endretAv": "Z994139",
            "eidAv": null,
            "endretAvHendelseId": "01G13JC26JDWNM1XZVZH2M1AB9",
            "gyldigeNesteHendelser": [
                {
                    saksHendelsestype: "VIRKSOMHET_ER_IKKE_AKTUELL",
                    gyldigeÅrsaker: [
                        {
                            type: "ÅRSAK_1",
                            navn: "Årsak 1",
                            begrunnelser: [
                                {
                                    type: "BEGRUNNELSE_1_1",
                                    navn: "Begrunnelse 1.1"
                                },
                                {
                                    type: "BEGRUNNELSE_1_2",
                                    navn: "Begrunnelse 1.2"
                                }
                            ]
                        },
                        {
                            type: "ÅRSAK_2",
                            navn: "Årsak 2",
                            begrunnelser: [
                                {
                                    type: "BEGRUNNELSE_2_1",
                                    navn: "Begrunnelse 2.1"
                                }, {
                                    type: "BEGRUNNELSE_2_2",
                                    navn: "Begrunnelse 2.2"
                                }
                            ]
                        }]
                },
                {
                    saksHendelsestype: "TA_EIERSKAP_I_SAK",
                    gyldigeÅrsaker: []
                }],
            lukket: false
        }

        const safeparseResultat = iaSakSchema.safeParse(iaSakMock)
        expect(safeparseResultat.success).toBeTruthy()
        expect(safeparseResultat.success && safeparseResultat.data.eidAv === null).toBeTruthy()
    })
})

