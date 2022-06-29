import {
    GyldigNesteHendelse,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../src/domenetyper";
import {sorterHendelserPåKnappeType} from "../src/Pages/Virksomhet/IASakshendelseKnapp";

const nyHendelse = (
    hendelsestype: IASakshendelseType,
): GyldigNesteHendelse => ({
    saksHendelsestype: hendelsestype,
    gyldigeÅrsaker: []
});


describe("kan sortere hendelser", () => {
    const opprettSak = nyHendelse(IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET)
    const vurderes = nyHendelse(IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES)
    const taEierskap = nyHendelse(IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK)
    const kontaktes = nyHendelse(IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES)
    const ikkeAktuell = nyHendelse(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL)


    test('kan sortere hendelser basert på typen knapp de tilhører', () => {
        const hendelser1 = [
            opprettSak,
            vurderes,
            taEierskap,
            kontaktes,
            ikkeAktuell
        ]
        expect(hendelser1.sort(sorterHendelserPåKnappeType)).toStrictEqual(
            [
                ikkeAktuell,
                opprettSak,
                vurderes,
                taEierskap,
                kontaktes,
            ]
        )
    });
    test('hendelser av samme type skal ikke endre rekkefølge', () => {
        const hendelser1 = [
            opprettSak,
            vurderes,
        ]
        expect(hendelser1.sort(sorterHendelserPåKnappeType)).toStrictEqual(
            [
                opprettSak,
                vurderes,
            ]
        )
    });
})
